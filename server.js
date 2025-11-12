require('dotenv').config();

const express = require('express');
const cors = require('cors');
const SneaksAPI = require('sneaks-api');
const http = require('http');
const socketIO = require('socket.io');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const sneaks = new SneaksAPI();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection (Render provides this automatically)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Socket.io setup
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const GAME_VERSION = '2.0.0-multiplayer';

app.use(cors());
app.use(express.json());

// Disable caching for HTML files
app.use((req, res, next) => {
    if (req.url.endsWith('.html') || req.url === '/' || req.url === '') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
});

app.use(express.static('.'));

// Initialize database tables
async function initDB() {
    try {
        // Players table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS players (
                player_id TEXT PRIMARY KEY,
                player_name TEXT NOT NULL,
                total_sales INTEGER DEFAULT 0,
                total_purchases INTEGER DEFAULT 0,
                created_at BIGINT NOT NULL
            )
        `);

        // Listings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS listings (
                listing_id TEXT PRIMARY KEY,
                seller_id TEXT NOT NULL,
                seller_name TEXT NOT NULL,
                shoe_data JSONB NOT NULL,
                asking_price INTEGER NOT NULL,
                listing_time BIGINT NOT NULL,
                views INTEGER DEFAULT 0,
                active BOOLEAN DEFAULT true,
                sold_to TEXT,
                sold_at BIGINT
            )
        `);

        // Create indexes for better performance
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_listings_active 
            ON listings(active, listing_time DESC)
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_listings_seller 
            ON listings(seller_id)
        `);

        console.log('✅ Database initialized successfully');
    } catch (err) {
        console.error('❌ Database initialization error:', err);
    }
}

// Only initialize DB if DATABASE_URL is provided
if (process.env.DATABASE_URL) {
    initDB();
} else {
    console.log('⚠️  No DATABASE_URL found - multiplayer features disabled');
}

// ==================== EXISTING SNEAKER API ENDPOINTS ====================

app.get('/api/version', (req, res) => {
    res.json({ 
        version: GAME_VERSION,
        timestamp: Date.now()
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        version: GAME_VERSION,
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

app.get('/api/sneaker/:name', (req, res) => {
    const sneakerName = req.params.name;
    let responded = false;
    
    console.log(`[API] Fetching sneaker: ${sneakerName}`);
    
    const timeout = setTimeout(() => {
        if (!responded) {
            console.error(`[API] Timeout fetching: ${sneakerName}`);
            responded = true;
            res.status(504).json({ error: 'Request timeout', searchedFor: sneakerName });
        }
    }, 10000);
    
    sneaks.getProducts(sneakerName, 1, function(err, products) {
        if (responded) return;
        clearTimeout(timeout);
        
        if (err || !products || products.length === 0) {
            console.log(`[API] No products found for: ${sneakerName}`);
            responded = true;
            return res.status(404).json({ error: 'Sneaker not found', searchedFor: sneakerName });
        }
        
        const sneakerData = {
            name: products[0].shoeName,
            imageUrl: products[0].thumbnail,
            retailPrice: products[0].retailPrice || null,
            resellPrice: products[0].lowestResellPrice || null,
            brand: products[0].brand || 'Unknown',
            colorway: products[0].colorway || 'Original',
            releaseDate: products[0].releaseDate || null
        };
        
        console.log(`[API] Successfully fetched: ${products[0].shoeName}`);
        responded = true;
        res.json(sneakerData);
    });
});

app.post('/api/sneakers', (req, res) => {
    const sneakerNames = req.body.names || [];
    
    if (sneakerNames.length === 0) {
        return res.status(400).json({ error: 'No sneaker names provided' });
    }
    
    const results = [];
    let completed = 0;
    let responded = false;
    
    sneakerNames.forEach((name, index) => {
        sneaks.getProducts(name, 1, function(err, products) {
            if (responded) return;
            
            if (!err && products && products.length > 0) {
                results.push({
                    name: products[0].shoeName,
                    imageUrl: products[0].thumbnail,
                    retailPrice: products[0].retailPrice || null,
                    resellPrice: products[0].lowestResellPrice || null,
                    brand: products[0].brand || 'Unknown',
                    colorway: products[0].colorway || 'Original',
                    releaseDate: products[0].releaseDate || null,
                    originalQuery: name
                });
            }
            
            completed++;
            if (completed === sneakerNames.length && !responded) {
                responded = true;
                res.json({ sneakers: results });
            }
        });
    });
});

app.get('/api/search/:query', (req, res) => {
    const query = req.params.query;
    const limit = parseInt(req.query.limit) || 10;
    let responded = false;
    
    sneaks.getProducts(query, limit, function(err, products) {
        if (responded) return;
        
        if (err) {
            console.error(err);
            responded = true;
            return res.status(500).json({ error: 'Search failed' });
        }
        
        if (!products) {
            responded = true;
            return res.json({ results: [] });
        }
        
        const results = products.map(product => ({
            name: product.shoeName,
            imageUrl: product.thumbnail,
            retailPrice: product.retailPrice || null,
            resellPrice: product.lowestResellPrice || null,
            brand: product.brand || 'Unknown',
            colorway: product.colorway || 'Original',
            releaseDate: product.releaseDate || null
        }));
        
        responded = true;
        res.json({ results });
    });
});

// ==================== MULTIPLAYER ENDPOINTS ====================

// Register or get player
app.post('/api/player/register', async (req, res) => {
    if (!process.env.DATABASE_URL) {
        return res.status(503).json({ error: 'Multiplayer not available' });
    }
    
    const { playerId, playerName } = req.body;
    
    try {
        // Check if player exists
        const existing = await pool.query(
            'SELECT * FROM players WHERE player_id = $1',
            [playerId]
        );
        
        if (existing.rows.length > 0) {
            return res.json(existing.rows[0]);
        }
        
        // Create new player
        const result = await pool.query(
            `INSERT INTO players (player_id, player_name, created_at)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [playerId, playerName, Date.now()]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Player registration error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Get all active listings
app.get('/api/listings', async (req, res) => {
    if (!process.env.DATABASE_URL) {
        console.log('⚠️ [LISTINGS] No DATABASE_URL - returning empty array');
        return res.json({ listings: [] });
    }
    
    const { excludePlayerId } = req.query;
    console.log(`📦 [LISTINGS] Fetching listings, excludePlayerId: ${excludePlayerId || 'none'}`);
    
    try {
        let query = `
            SELECT * FROM listings 
            WHERE active = true 
            ORDER BY listing_time DESC 
            LIMIT 100
        `;
        let params = [];
        
        if (excludePlayerId) {
            query = `
                SELECT * FROM listings 
                WHERE active = true AND seller_id != $1
                ORDER BY listing_time DESC 
                LIMIT 100
            `;
            params = [excludePlayerId];
        }
        
        const result = await pool.query(query, params);
        console.log(`✅ [LISTINGS] Found ${result.rows.length} active listings`);
        console.log(`📊 [LISTINGS] Returning listings:`, result.rows.map(r => ({
            id: r.listing_id,
            seller: r.seller_name,
            shoe: r.shoe_data.brand + ' ' + r.shoe_data.model,
            price: r.asking_price
        })));
        
        res.json({ listings: result.rows });
    } catch (err) {
        console.error('❌ [LISTINGS] Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

// Create new listing
app.post('/api/listings/create', async (req, res) => {
    if (!process.env.DATABASE_URL) {
        console.log('⚠️ [CREATE] No DATABASE_URL - multiplayer unavailable');
        return res.status(503).json({ error: 'Multiplayer not available' });
    }
    
    const { shoe, sellerId, sellerName, askingPrice } = req.body;
    console.log(`🆕 [CREATE] New listing from ${sellerName} (${sellerId})`);
    console.log(`👟 [CREATE] Shoe: ${shoe.brand} ${shoe.model} - $${askingPrice}`);
    
    try {
        const listingId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const result = await pool.query(
            `INSERT INTO listings 
             (listing_id, seller_id, seller_name, shoe_data, asking_price, listing_time)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [listingId, sellerId, sellerName, JSON.stringify(shoe), askingPrice, Date.now()]
        );
        
        const listing = result.rows[0];
        console.log(`✅ [CREATE] Listing created successfully: ${listingId}`);
        console.log(`📡 [CREATE] Broadcasting to ${io.engine.clientsCount} connected clients`);
        
        // Notify all connected clients
        io.emit('newListing', listing);
        
        res.json({ success: true, listing });
    } catch (err) {
        console.error('❌ [CREATE] Error:', err);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});

// Buy a listing
app.post('/api/listings/buy', async (req, res) => {
    if (!process.env.DATABASE_URL) {
        return res.status(503).json({ error: 'Multiplayer not available' });
    }
    
    const { listingId, buyerId, buyerName } = req.body;
    
    try {
        // Get and mark as inactive in one query (prevents race conditions)
        const result = await pool.query(
            `UPDATE listings 
             SET active = false, sold_to = $1, sold_at = $2
             WHERE listing_id = $3 AND active = true
             RETURNING *`,
            [buyerId, Date.now(), listingId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Listing not found or already sold' });
        }
        
        const listing = result.rows[0];
        
        // Update player stats
        await pool.query(
            'UPDATE players SET total_sales = total_sales + 1 WHERE player_id = $1',
            [listing.seller_id]
        );
        
        await pool.query(
            `INSERT INTO players (player_id, player_name, total_purchases, created_at)
             VALUES ($1, $2, 1, $3)
             ON CONFLICT (player_id) 
             DO UPDATE SET total_purchases = players.total_purchases + 1`,
            [buyerId, buyerName, Date.now()]
        );
        
        // Notify seller
        io.to(listing.seller_id).emit('yourItemSold', {
            shoe: listing.shoe_data,
            soldPrice: listing.asking_price,
            buyer: buyerName
        });
        
        // Notify all clients
        io.emit('listingSold', { listingId, buyerId });
        
        res.json({ success: true, listing });
    } catch (err) {
        console.error('Purchase error:', err);
        res.status(500).json({ error: 'Purchase failed' });
    }
});

// Remove listing
app.post('/api/listings/remove', async (req, res) => {
    if (!process.env.DATABASE_URL) {
        return res.status(503).json({ error: 'Multiplayer not available' });
    }
    
    const { listingId, sellerId } = req.body;
    
    try {
        const result = await pool.query(
            'UPDATE listings SET active = false WHERE listing_id = $1 AND seller_id = $2 AND active = true RETURNING *',
            [listingId, sellerId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        
        io.emit('listingRemoved', listingId);
        res.json({ success: true });
    } catch (err) {
        console.error('Remove listing error:', err);
        res.status(500).json({ error: 'Failed to remove listing' });
    }
});

// Get player stats
app.get('/api/player/:playerId/stats', async (req, res) => {
    if (!process.env.DATABASE_URL) {
        return res.status(503).json({ error: 'Multiplayer not available' });
    }
    
    const { playerId } = req.params;
    
    try {
        const result = await pool.query(
            'SELECT * FROM players WHERE player_id = $1',
            [playerId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// ==================== SOCKET.IO REAL-TIME ====================

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    socket.on('registerPlayer', (playerId) => {
        socket.join(playerId);
        console.log(`Player ${playerId} registered`);
    });
    
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
    });
});

// ==================== START SERVER ====================

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 Multiplayer Sneaker Server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready`);
    if (process.env.DATABASE_URL) {
        console.log(`🗄️  PostgreSQL connected`);
    } else {
        console.log(`⚠️  Running without database - multiplayer disabled`);
    }
});

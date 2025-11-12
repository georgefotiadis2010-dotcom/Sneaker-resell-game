const express = require('express');
const cors = require('cors');
const SneaksAPI = require('sneaks-api');
const fs = require('fs');
const path = require('path');

const app = express();
const sneaks = new SneaksAPI();
const PORT = process.env.PORT || 3000;

// Game version - UPDATE THIS WITH EACH DEPLOYMENT
const GAME_VERSION = '1.2.0';

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Disable caching for HTML files to ensure updates are always served
app.use((req, res, next) => {
    if (req.url.endsWith('.html') || req.url === '/' || req.url === '') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
});

// Version endpoint - allows clients to check for updates
app.get('/api/version', (req, res) => {
    res.json({ 
        version: GAME_VERSION,
        timestamp: Date.now()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        version: GAME_VERSION,
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

app.use(express.static('.'));

// Get sneaker data by name
app.get('/api/sneaker/:name', (req, res) => {
    const sneakerName = req.params.name;
    let responded = false;
    
    console.log(`[API] Fetching sneaker: ${sneakerName}`);
    
    // Set a timeout to prevent hanging requests
    const timeout = setTimeout(() => {
        if (!responded) {
            console.error(`[API] Timeout fetching: ${sneakerName}`);
            responded = true;
            res.status(504).json({ error: 'Request timeout', searchedFor: sneakerName });
        }
    }, 10000); // 10 second timeout
    
    sneaks.getProducts(sneakerName, 1, function(err, products) {
        if (responded) return;
        
        clearTimeout(timeout);
        
        if (err) {
            console.log(`[API] Could not fetch ${sneakerName} (API issue, will use fallback)`);
            responded = true;
            // Return 404 instead of 500 - this is not a server error, just data not found
            return res.status(404).json({ error: 'Sneaker not found in database', searchedFor: sneakerName });
        }
        
        if (!products || products.length === 0) {
            console.log(`[API] No products found for: ${sneakerName}`);
            responded = true;
            return res.status(404).json({ error: 'No sneaker found', searchedFor: sneakerName });
        }
        
        // Return exact sneaker name and image URL
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

// Get multiple sneakers (for batch loading)
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

// Search for sneakers
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sneaker API Server running on port ${PORT}`);
    console.log(`Ready to accept connections`);
});

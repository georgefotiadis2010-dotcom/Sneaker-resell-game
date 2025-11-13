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
    
    try {
        sneaks.getProducts(sneakerName, 1, function(err, products) {
            if (responded) return;
            
            clearTimeout(timeout);
            
            if (err) {
                const errorMessage = err.message || err.toString();
                console.error(`[API] Error fetching ${sneakerName}:`, errorMessage);
                
                // Check if it's a StockX connection error
                if (errorMessage.includes('StockX') || errorMessage.includes('Could not connect')) {
                    console.error(`[API] StockX connection error for ${sneakerName}`);
                    responded = true;
                    return res.status(503).json({ 
                        error: 'Sneaker database temporarily unavailable', 
                        message: 'Unable to connect to sneaker database. Please try again in a moment.',
                        searchedFor: sneakerName 
                    });
                }
                
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
    } catch (syncErr) {
        clearTimeout(timeout);
        if (!responded) {
            const errorMessage = syncErr.message || syncErr.toString();
            console.error(`[API] Synchronous error fetching ${sneakerName}:`, errorMessage);
            responded = true;
            if (errorMessage.includes('StockX') || errorMessage.includes('Could not connect')) {
                return res.status(503).json({ 
                    error: 'Sneaker database temporarily unavailable', 
                    message: 'Unable to connect to sneaker database. Please try again in a moment.',
                    searchedFor: sneakerName 
                });
            }
            res.status(500).json({ error: 'Internal server error', searchedFor: sneakerName });
        }
    }
});

// Get multiple sneakers (for batch loading)
app.post('/api/sneakers', (req, res) => {
    const sneakerNames = req.body.names || [];
    let responded = false;
    
    if (sneakerNames.length === 0) {
        return res.status(400).json({ error: 'No sneaker names provided' });
    }
    
    // Set a timeout to prevent hanging requests
    const timeout = setTimeout(() => {
        if (!responded) {
            console.error(`[API] Timeout fetching batch sneakers`);
            responded = true;
            res.status(504).json({ error: 'Request timeout', sneakers: [] });
        }
    }, 15000); // 15 second timeout for batch requests
    
    const results = [];
    let completed = 0;
    
    sneakerNames.forEach((name, index) => {
        try {
            sneaks.getProducts(name, 1, function(err, products) {
                if (responded) return;
                
                if (err) {
                    const errorMessage = err.message || err.toString();
                    if (errorMessage.includes('StockX') || errorMessage.includes('Could not connect')) {
                        console.error(`[API] StockX connection error for ${name} in batch request`);
                    }
                }
                
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
                    clearTimeout(timeout);
                    responded = true;
                    // If we got some results, return them even if some failed
                    res.json({ sneakers: results });
                }
            });
        } catch (syncErr) {
            const errorMessage = syncErr.message || syncErr.toString();
            console.error(`[API] Synchronous error fetching ${name} in batch:`, errorMessage);
            completed++;
            if (completed === sneakerNames.length && !responded) {
                clearTimeout(timeout);
                responded = true;
                res.json({ sneakers: results });
            }
        }
    });
});

// Search for sneakers
app.get('/api/search/:query', (req, res) => {
    const query = req.params.query;
    const limit = parseInt(req.query.limit) || 10;
    let responded = false;
    
    console.log(`[API] Searching for: ${query}`);
    
    // Set a timeout to prevent hanging requests
    const timeout = setTimeout(() => {
        if (!responded) {
            console.error(`[API] Timeout searching for: ${query}`);
            responded = true;
            res.status(504).json({ error: 'Search timeout', results: [] });
        }
    }, 10000); // 10 second timeout
    
    try {
        sneaks.getProducts(query, limit, function(err, products) {
            if (responded) return;
            
            clearTimeout(timeout);
            
            if (err) {
                const errorMessage = err.message || err.toString();
                console.error(`[API] Search error for ${query}:`, errorMessage);
                
                // Check if it's a StockX connection error
                if (errorMessage.includes('StockX') || errorMessage.includes('Could not connect')) {
                    console.error(`[API] StockX connection error during search for ${query}`);
                    responded = true;
                    return res.status(503).json({ 
                        error: 'Search service temporarily unavailable', 
                        message: 'Unable to connect to sneaker database. Please try again in a moment.',
                        results: [] 
                    });
                }
                
                responded = true;
                return res.status(500).json({ error: 'Search failed', results: [] });
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
    } catch (syncErr) {
        clearTimeout(timeout);
        if (!responded) {
            const errorMessage = syncErr.message || syncErr.toString();
            console.error(`[API] Synchronous error searching for ${query}:`, errorMessage);
            responded = true;
            if (errorMessage.includes('StockX') || errorMessage.includes('Could not connect')) {
                return res.status(503).json({ 
                    error: 'Search service temporarily unavailable', 
                    message: 'Unable to connect to sneaker database. Please try again in a moment.',
                    results: [] 
                });
            }
            res.status(500).json({ error: 'Internal server error', results: [] });
        }
    }
});

// Global error handler for unhandled errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sneaker API Server running on port ${PORT}`);
    console.log(`Ready to accept connections`);
});

const express = require('express');
const cors = require('cors');
const SneaksAPI = require('sneaks-api');

const app = express();
const sneaks = new SneaksAPI();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Get sneaker data by name
app.get('/api/sneaker/:name', (req, res) => {
    const sneakerName = req.params.name;
    
    sneaks.getProducts(sneakerName, 1, function(err, products) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch sneaker data' });
        }
        
        if (products.length === 0) {
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
    
    sneakerNames.forEach((name, index) => {
        sneaks.getProducts(name, 1, function(err, products) {
            if (!err && products.length > 0) {
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
            if (completed === sneakerNames.length) {
                res.json({ sneakers: results });
            }
        });
    });
});

// Search for sneakers
app.get('/api/search/:query', (req, res) => {
    const query = req.params.query;
    const limit = parseInt(req.query.limit) || 10;
    
    sneaks.getProducts(query, limit, function(err, products) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Search failed' });
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
        
        res.json({ results });
    });
});

app.listen(PORT, () => {
    console.log(`Sneaker API Server running on http://localhost:${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}/index.html`);
});


# Sneaks API Integration - Usage Guide

## Overview

Your sneaker resell game now includes real sneaker data and images powered by the Sneaks API. This document explains how the integration works and how you can extend it.

## Starting the Server

### Quick Start
```bash
npm start
```

### Using the Startup Script (Mac/Linux)
```bash
./start.sh
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Get Single Sneaker Data

**Endpoint:** `GET /api/sneaker/:name`

**Example:**
```bash
curl http://localhost:3000/api/sneaker/Nike%20Dunk%20Low%20Panda
```

**Response:**
```json
{
  "name": "Nike Dunk Low Retro White Black Panda",
  "imageUrl": "https://images.stockx.com/...",
  "retailPrice": 110,
  "resellPrice": 180,
  "brand": "Nike",
  "colorway": "White/Black",
  "releaseDate": "2021-01-14"
}
```

### 2. Search for Sneakers

**Endpoint:** `GET /api/search/:query?limit=10`

**Example:**
```bash
curl http://localhost:3000/api/search/Jordan?limit=5
```

**Response:**
```json
{
  "results": [
    {
      "name": "Air Jordan 1 High OG...",
      "imageUrl": "https://...",
      "retailPrice": 170,
      "resellPrice": 250,
      "brand": "Jordan",
      "colorway": "Chicago",
      "releaseDate": "2015-05-30"
    },
    // ... more results
  ]
}
```

### 3. Batch Fetch Multiple Sneakers

**Endpoint:** `POST /api/sneakers`

**Request Body:**
```json
{
  "names": [
    "Nike Dunk Low Panda",
    "Adidas Yeezy 350 Zebra",
    "New Balance 550 White Green"
  ]
}
```

**Response:**
```json
{
  "sneakers": [
    {
      "name": "Nike Dunk Low Retro White Black Panda",
      "imageUrl": "https://...",
      "originalQuery": "Nike Dunk Low Panda"
    },
    // ... more sneakers
  ]
}
```

## Frontend Integration

### How Images Are Loaded

1. **Automatic Loading**: When sneaker cards are rendered, the game automatically fetches images
2. **Caching**: Images are cached in memory to avoid repeated API calls
3. **Fallback**: If an image fails to load, brand initials are displayed instead
4. **Preloading**: Popular sneakers are preloaded on game startup

### Functions Available

#### `fetchSneakerData(sneakerName)`
Fetches complete sneaker data for a given name.

```javascript
const data = await fetchSneakerData('Nike Dunk Low Panda');
console.log(data.imageUrl); // https://...
```

#### `getSneakerImage(brand, model)`
Gets just the image URL for a sneaker (uses cache if available).

```javascript
const imageUrl = await getSneakerImage('Nike', 'Dunk Low Panda');
```

#### `searchSneakers(query, limit)`
Search for multiple sneakers.

```javascript
const results = await searchSneakers('Jordan 1', 10);
```

## Extending the Integration

### Adding More API Endpoints

Edit `server.js` to add new endpoints:

```javascript
// Example: Get trending sneakers
app.get('/api/trending', (req, res) => {
    // Your logic here
    res.json({ trending: [] });
});
```

### Customizing Image Display

Edit the `loadSneakerImages()` function in `index.html` to customize how images are displayed.

### Using Different APIs

The current integration uses `sneaks-api`, but you can swap it out for other APIs:
- StockX API (requires authentication)
- GOAT API (requires authentication)
- Custom scraping solution

## Performance Tips

1. **Image Caching**: Images are cached in memory - refresh the page to clear cache
2. **Batch Requests**: Use the batch endpoint for multiple sneakers to reduce API calls
3. **Preloading**: Extend the `preloadPopularSneakers()` function to preload more sneakers
4. **Rate Limiting**: The Sneaks API has rate limits - be mindful of frequent requests

## Troubleshooting

### Server Won't Start
- Make sure port 3000 is available
- Check if Node.js is installed: `node --version`
- Try reinstalling dependencies: `rm -rf node_modules && npm install`

### Images Not Loading
- Check browser console for errors (F12)
- Verify the server is running
- Check if the sneaker name matches exactly
- API might be temporarily unavailable

### CORS Errors
- Make sure you're accessing via `http://localhost:3000/index.html`
- Don't open `index.html` directly from file system when using API

## API Sources

The Sneaks API aggregates data from:
- StockX
- GOAT
- Flight Club
- Stadium Goods

## Rate Limits

Be mindful of API usage. The game caches images to minimize API calls, but excessive requests may be throttled.

---

**Built with passion for sneaker culture!**


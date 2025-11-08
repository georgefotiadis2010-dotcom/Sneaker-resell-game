# Sneaks API Integration - Complete!

## What Was Added

Your sneaker resell game now includes **real sneaker data and images** from the Sneaks API!

### New Files Created

1. **`server.js`** - Express backend server that handles API requests
2. **`package.json`** - Dependency management with sneaks-api, express, and cors
3. **`start.sh`** - Quick startup script for Mac/Linux
4. **`.gitignore`** - Prevents committing node_modules and other unnecessary files
5. **`API_USAGE.md`** - Complete API documentation and usage guide

### Modified Files

1. **`index.html`** - Added API integration functions:
   - `fetchSneakerData()` - Fetch complete sneaker data
   - `getSneakerImage()` - Get sneaker image URLs
   - `searchSneakers()` - Search for sneakers
   - `loadSneakerImages()` - Load real images into sneaker cards
   - `preloadPopularSneakers()` - Preload popular sneakers on startup

2. **`README.md`** - Updated with setup instructions and API features

## How to Start Playing

### Method 1: Quick Start (Recommended)
```bash
npm start
```
Then open: http://localhost:3000/index.html

### Method 2: Using Startup Script
```bash
./start.sh
```

### Method 3: Without API (Original Version)
Just open `index.html` directly in your browser (no real images)

## Features

- **Real Sneaker Images**: Displays actual product photos from StockX
- **Smart Caching**: Images are cached to avoid repeated API calls
- **Fallback Support**: Brand initials shown if images fail to load
- **Preloading**: Popular sneakers loaded on game startup
- **Multiple Endpoints**: Search, single fetch, and batch fetch available

## Example API Response

When you search for "Nike Dunk Low Panda", you get:

```json
{
  "name": "Nike Dunk Low Retro White Black Panda",
  "imageUrl": "https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg",
  "retailPrice": 115,
  "resellPrice": {"stockX": 55, "goat": 40, "flightClub": 60},
  "brand": "Nike",
  "colorway": "White/Black",
  "releaseDate": "2021-03-10"
}
```

## What Happens in the Game

1. **On Startup**: Popular sneakers (Panda Dunks, Jordan 1, Yeezy 350) are preloaded
2. **When Browsing**: As you view sneaker cards, real images load automatically
3. **Image Display**: 
   - Shows brand initial first (instant)
   - Fetches real image in background
   - Replaces initial with actual sneaker photo when loaded
4. **Caching**: Once an image is loaded, it's cached for the session

## File Structure

```
Sneaker resell game/
├── index.html              # Main game (updated with API integration)
├── server.js               # Backend API server (new)
├── package.json            # Dependencies (new)
├── start.sh                # Startup script (new)
├── README.md               # Updated documentation
├── API_USAGE.md            # API guide (new)
├── .gitignore              # Git ignore file (new)
└── node_modules/           # Dependencies (created by npm install)
```

## API Endpoints Available

### 1. Get Sneaker Data
```
GET /api/sneaker/:name
Example: /api/sneaker/Nike%20Dunk%20Low%20Panda
```

### 2. Search Sneakers
```
GET /api/search/:query?limit=10
Example: /api/search/Jordan?limit=5
```

### 3. Batch Fetch
```
POST /api/sneakers
Body: { "names": ["Nike Dunk Low", "Yeezy 350"] }
```

## Troubleshooting

### Server Won't Start
- Check if port 3000 is in use
- Verify Node.js is installed: `node --version`
- Try: `rm -rf node_modules && npm install`

### Images Not Loading
- Check browser console (F12) for errors
- Verify server is running
- Some sneaker names might not exist in the API
- API sources might be temporarily unavailable (will fallback to brand initials)

### CORS Errors
- Always access via: `http://localhost:3000/index.html`
- Don't open `index.html` directly from file system when using API

## Testing the Integration

1. Start the server: `npm start`
2. Open: http://localhost:3000/index.html
3. Navigate to the "Buy Shoes" tab
4. You should see real sneaker images loading on the cards!

## Next Steps

- Extend the API to fetch more detailed data (resell prices, release dates)
- Add search functionality within the game
- Implement trending sneakers from real market data
- Add sneaker comparison features

## Credits

- **Sneaks API**: https://github.com/druv5319/Sneaks-API
- Data sources: StockX, GOAT, Flight Club, Stadium Goods

---

**Enjoy your enhanced sneaker resell game with real data!**


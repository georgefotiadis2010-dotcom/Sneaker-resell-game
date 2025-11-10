# Server-Side Auto-Update System Guide

## How It Works

The game now has a **server-side automatic update system** that checks version updates directly from the Render deployment!

### Features:
- ✅ **Server-side version checking** - Checks `/api/version` endpoint on Render
- ✅ **Automatic update detection** - Players are notified when a new version is deployed
- ✅ **Progress preservation** - All game data stays safe in localStorage
- ✅ **No cache issues** - Both server and client headers prevent caching
- ✅ **User-friendly** - Clean popup with version numbers and update button
- ✅ **Works everywhere** - Functions on localhost AND Render server
- ✅ **Background checking** - Checks for updates every 3 minutes automatically

---

## For Developers: How to Deploy Updates

### When you make changes to the game:

1. **Update the version number in BOTH files:**
   
   **server.js (line ~12):**
   ```javascript
   const GAME_VERSION = '1.2.0'; // Change to '1.3.0'
   ```
   
   **index.html (line ~2768):**
   ```javascript
   const CLIENT_VERSION = '1.2.0'; // Change to '1.3.0' (must match server)
   ```
   
   ⚠️ **IMPORTANT:** Both version numbers must match!

2. **Commit and push** your changes:
   ```bash
   git add -A
   git commit -m "v1.3.0: [describe your changes]"
   git push origin main
   ```

3. **Wait for Render to deploy** (2-3 minutes)

4. **That's it!** When players visit or the app checks for updates:
   - Client requests `/api/version` from server
   - Server responds with new version number
   - If versions don't match, popup appears: "🎉 UPDATE AVAILABLE! 🎉"
   - Shows: "Current: v1.2.0" → "New: v1.3.0"
   - Player clicks "Update Now"
   - Page reloads with latest code
   - **Progress is preserved!**

---

## Version Numbering

Use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes or major features
- **MINOR** (1.0.0 → 1.1.0): New features, improvements
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, small tweaks

### Examples:
```javascript
const GAME_VERSION = '1.0.0'; // Initial version
const GAME_VERSION = '1.1.0'; // Added new sneakers
const GAME_VERSION = '1.1.1'; // Fixed pricing bug
const GAME_VERSION = '1.2.0'; // Added rarity badge colors
const GAME_VERSION = '2.0.0'; // Complete redesign
```

---

## How It Works Technically

### 1. Server Version Endpoint
**server.js:**
```javascript
app.get('/api/version', (req, res) => {
    res.json({ 
        version: GAME_VERSION,
        timestamp: Date.now()
    });
});
```
- Server exposes current version via API
- Client can check this anytime

### 2. Client Version Check
**index.html:**
```javascript
async function checkServerVersion() {
    const response = await fetch('/api/version', { cache: 'no-cache' });
    const data = await response.json();
    
    if (data.version !== CLIENT_VERSION) {
        showUpdateNotification(data.version);
    }
}
```
- Fetches server version every 3 minutes
- Compares with client version
- Shows popup if different

### 3. Cache Control Headers
**Server-side (server.js):**
```javascript
res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
```

**Client-side (index.html):**
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
```
- Prevents browsers from caching HTML
- Ensures fresh content on every load

### 4. Progress Preservation
- Game data stored in `localStorage`
- `localStorage` persists through page reloads
- Survives version updates
- Only clears on explicit game reset

### 5. Automatic Background Checking
```javascript
setInterval(async () => {
    await checkServerVersion();
}, 180000); // Every 3 minutes
```
- Runs in background while playing
- Non-intrusive checks
- Shows popup only when update found

---

## API Endpoints

### `/api/version`
Returns current server version
```json
{
  "version": "1.2.0",
  "timestamp": 1699999999999
}
```

### `/api/health`
Health check with version info
```json
{
  "status": "ok",
  "version": "1.2.0",
  "uptime": 12345.67,
  "timestamp": 1699999999999
}
```

---

## Testing Updates

### Test locally:
1. Start the server: `npm start` or `node server.js`
2. Play the game and save progress
3. Stop the server
4. Change both `GAME_VERSION` and `CLIENT_VERSION` to `1.3.0`
5. Restart the server
6. Reload the page in browser
7. You should see update popup
8. Click "Update Now"
9. Verify progress is still there

### Test on Render:
1. Make changes and update version numbers
2. Commit and push to GitHub
3. Wait for Render to deploy (check dashboard)
4. Open live site in browser
5. The client will detect server version is newer
6. Update popup should appear
7. Click "Update Now"
8. Verify game loads with new features

### Test automatic checking:
1. Open browser console (F12)
2. Leave the game open for 3+ minutes
3. Deploy a new version to Render
4. Wait up to 3 minutes
5. Console should log: "New version available: 1.3.0"
6. Update popup appears automatically

---

## Troubleshooting

### Players not seeing updates?
✅ **Solution:**
- Verify both version numbers were updated
- Check Render deployment completed successfully
- Wait 3 minutes for background check
- Try manual refresh (popup should appear)

### Version endpoint not working?
✅ **Solution:**
- Check server logs on Render
- Verify `/api/version` endpoint is accessible
- Test: `curl https://your-app.onrender.com/api/version`
- Should return JSON with version

### Update popup not showing?
✅ **Solution:**
- Open browser console for errors
- Verify `CLIENT_VERSION` in HTML changed
- Verify `GAME_VERSION` in server.js changed
- Check versions don't match (that's what triggers popup)
- Clear localStorage: `localStorage.removeItem('gameVersion')`

### Progress lost after update?
✅ **Solution:**
- This shouldn't happen! 
- Check if player clicked "Reset Game"
- Verify `saveGame()` is being called
- Check browser localStorage: `localStorage.getItem('sneakerGameState')`

### Different versions in server.js and index.html?
✅ **Solution:**
- Both must match for clean deployments
- Update popup will show correctly if server is newer
- But best practice: keep them in sync
- Use same version number in both files

---

## Deployment Workflow

### Standard Update Process:
```bash
# 1. Make your changes to the game
vim index.html

# 2. Update version in server.js
vim server.js  # Change GAME_VERSION = '1.3.0'

# 3. Update version in index.html  
vim index.html # Change CLIENT_VERSION = '1.3.0'

# 4. Commit with version in message
git add -A
git commit -m "v1.3.0: Add new feature description"

# 5. Push to GitHub (triggers Render deploy)
git push origin main

# 6. Monitor Render dashboard for deployment
# Usually takes 2-3 minutes

# 7. Test on live site
# Should see update notification if you were already on the site
```

---

## Benefits

✅ **No more cache issues** - Server-controlled version checking  
✅ **Automatic detection** - Checks every 3 minutes in background  
✅ **Better UX** - Shows version numbers, non-intrusive  
✅ **Safe updates** - Progress always preserved  
✅ **Easy deployment** - Just update two version numbers and push  
✅ **Works everywhere** - localhost, Render, anywhere  
✅ **Production ready** - Handles errors gracefully  
✅ **Zero user friction** - No cache clearing needed  

---

## Current Version

**v1.2.0** - Server-side auto-update system + Rarity badge colors with tier-condition gradients and shake animations

### Version History:
- **v1.0.0** - Initial release
- **v1.1.0** - Added auto-update system (client-side)
- **v1.2.0** - Server-side version checking + rarity badge improvements

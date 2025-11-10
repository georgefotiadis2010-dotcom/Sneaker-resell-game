# Auto-Update System Guide

## How It Works

The game now has an **automatic update system** that ensures players always get the latest version without losing their progress!

### Features:
- ✅ **Automatic update detection** - Players are notified when a new version is available
- ✅ **Progress preservation** - All game data stays safe in localStorage
- ✅ **No cache issues** - Meta tags prevent HTML caching
- ✅ **User-friendly** - Clean popup notification with update button

---

## For Developers: How to Deploy Updates

### When you make changes to the game:

1. **Update the version number** in `index.html`:
   ```javascript
   const GAME_VERSION = '1.2.0'; // Change this to '1.3.0' (or any new version)
   ```

2. **Commit and push** your changes:
   ```bash
   git add -A
   git commit -m "Update: [describe your changes]"
   git push origin main
   ```

3. **That's it!** When players reload or visit the site:
   - They'll see a popup: "🎉 UPDATE AVAILABLE! 🎉"
   - They click "Update Now"
   - Page refreshes with new version
   - **Their game progress is preserved!**

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
const GAME_VERSION = '2.0.0'; // Complete redesign
```

---

## How It Works Technically

### 1. Cache Control Headers
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
```
- Prevents browsers from caching the HTML file
- Ensures users always fetch the latest version

### 2. Version Check
```javascript
const storedVersion = localStorage.getItem('gameVersion');
if (storedVersion !== GAME_VERSION) {
    // Show update notification
}
```
- Compares stored version with current version
- Shows popup if versions don't match

### 3. Periodic Checks
- Checks for updates every 5 minutes
- Auto-reloads if user has been idle
- Tracks user activity to avoid disrupting gameplay

### 4. Progress Preservation
- Game data is stored in `localStorage`
- `localStorage` persists through page reloads
- Only clears if user explicitly resets the game

---

## Testing Updates

### Test locally:
1. Play the game and save some progress
2. Change `GAME_VERSION` to a new number
3. Reload the page
4. You should see the update popup
5. Click "Update Now"
6. Verify your progress is still there

### Test on production:
1. Deploy with a new version number
2. Open the live site in a browser
3. Wait for Render to deploy (2-3 minutes)
4. Reload the page
5. Update popup should appear

---

## Troubleshooting

### Players not seeing updates?
- Make sure you incremented `GAME_VERSION`
- Check that Render deployed successfully
- Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Update popup not showing?
- Check browser console for errors
- Verify `GAME_VERSION` changed
- Clear localStorage manually to test: `localStorage.removeItem('gameVersion')`

### Progress lost after update?
- This shouldn't happen! The game uses localStorage which persists
- Check if player accidentally clicked "Reset Game"
- Verify `saveGame()` function is working properly

---

## Benefits

✅ **No more cache issues** - Players always get latest version
✅ **Better user experience** - No manual cache clearing needed
✅ **Safe updates** - Progress is always preserved
✅ **Easy deployment** - Just change version number and push
✅ **Automatic** - Works in the background without user action

---

## Current Version

**v1.2.0** - Auto-update system + Rarity badge colors with gradients and shake animations


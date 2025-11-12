# 🎮 Multiplayer Setup Guide

Your game has full multiplayer functionality, but it needs to connect to your Render database!

## Current Issue
You're running the server **locally** on your Mac, but the database is on **Render**. Your local server doesn't have the `DATABASE_URL` environment variable that tells it how to connect to the database.

## Quick Fix (3 Steps)

### Step 1: Get Your Database URL from Render

1. Go to https://dashboard.render.com/
2. Click on your **PostgreSQL database** (not your web service)
3. Scroll down to find **Connection String** section
4. Copy the **Internal Database URL** (it looks like this):
   ```
   postgresql://username:password@hostname.region.render.com/database_name
   ```

### Step 2: Set the Environment Variable

Open Terminal in this project folder and run:

```bash
export DATABASE_URL='paste-your-database-url-here'
```

**Important:** Replace `paste-your-database-url-here` with the actual URL you copied from Render!

### Step 3: Start the Server with Database

Run the new startup script:

```bash
./start-with-db.sh
```

You should now see:
- ✅ Multiplayer ENABLED - Database connected!

## Testing Multiplayer

Once connected, you should see in your browser console:
- `Multiplayer enabled: true`
- `Global listings: [number]`
- Player ID and Name

## Troubleshooting

### "command not found: export"
You might be in the wrong terminal. Use `bash` or `zsh`.

### "Connection refused" or "Database error"
- Make sure you copied the **Internal Database URL** (not External)
- Check that your Render database is running
- Verify the URL has no extra spaces or quotes

### Multiplayer still shows as disabled
- Stop the server (Ctrl+C)
- Make sure you ran `export DATABASE_URL=...` in the same terminal window
- Run `./start-with-db.sh` again in the **same terminal window**

## Alternative: Connect to Live Render Server

If you want to play on the live Render deployment instead of locally:

1. Go to your Render Web Service dashboard
2. Copy your live URL (like `https://your-app-name.onrender.com`)
3. Open that URL in your browser
4. Multiplayer should work automatically there!

## Making DATABASE_URL Permanent (Optional)

If you don't want to export the variable every time, create a file called `.env` in this folder:

```bash
DATABASE_URL=your-database-url-here
```

Then install `dotenv`:
```bash
npm install dotenv
```

And add this at the top of `server.js`:
```javascript
require('dotenv').config();
```

---

Need help? Check the server console output for detailed error messages!


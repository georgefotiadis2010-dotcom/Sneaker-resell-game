# Sneaker Hustle - Resell Game

A browser-based sneaker reselling simulation game where you flip kicks for profit, negotiate deals, and build your reputation in the sneaker game. Now featuring **real sneaker data and images** powered by the Sneaks API!

## Quick Start

### Option 1: With Real Sneaker Images (Recommended)

This version fetches real sneaker data and images from the Sneaks API:

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or use the startup script (Mac/Linux)
chmod +x start.sh
./start.sh
```

Then open your browser to: **http://localhost:3000/index.html**

### Option 2: Public Server (Share with Friends!)

Want to share your game with friends online? Use localtunnel to create a public URL:

```bash
# Run the public server script
./start-public.sh

# Or use npm
npm run start:public
```

This will:
1. Start your local server on port 3000
2. Create a public tunnel URL (e.g., `https://random-name-123.loca.lt`)
3. Display the public URL in your terminal
4. Allow anyone with the URL to play your game online

**Note:** The URL changes each time you restart. Share the new URL with your friends each session!

### Option 3: Basic Version (No Backend)

Simply open `index.html` in any modern web browser to play without real sneaker images.

## API Integration Features

The game now includes real sneaker data integration:

- **Real Sneaker Images**: Fetches actual product images from StockX, GOAT, and Flight Club
- **Authentic Data**: Real sneaker names, colorways, and pricing information
- **Image Caching**: Images are cached to improve performance and reduce API calls
- **Fallback Support**: If an image fails to load, the game displays brand initials as before
- **Preloading**: Popular sneakers like Nike Dunk Low Panda, Air Jordan 1, and Yeezy 350 are preloaded on startup

### How It Works

1. **Backend Server** (`server.js`): A lightweight Express server that uses the `sneaks-api` package to fetch sneaker data
2. **API Endpoints**:
   - `GET /api/sneaker/:name` - Get data for a specific sneaker
   - `POST /api/sneakers` - Batch fetch multiple sneakers
   - `GET /api/search/:query` - Search for sneakers
3. **Frontend Integration**: The game automatically fetches and displays real sneaker images when available

## Game Features

### Core Gameplay

**Starting Resources:**
- $1,000 starting cash
- 10 inventory slots (expandable)
- 3-star reputation

### 1. Buy Shoes Tab
- Browse 5-12 available sneakers that rotate hourly
- Each shoe displays:
  - Brand, model, colorway, and size
  - Condition (New, VNDS, Used)
  - Rarity (Common to Legendary)
  - Asking price and estimated value
  - Market status (Hot items marked with 🔥)
- **Sales History System:**
  - Each shoe shows last 5 recent sales
  - Sales matched by brand, model, and similar metrics
  - Exact matches (same size, condition, rarity) highlighted in green with ✓
  - Shows condition, size, hot status, and sale price
  - No estimated value shown - use sales data to determine fair offers
  - Sales history builds as you and others sell shoes
- **Negotiation System (MUCH HARDER):**
  - Make custom offers to sellers
  - Seller reactions based on offer fairness:
    - 100%+ of asking price: Instant acceptance
    - 97-99%: 65% acceptance rate (often counter)
    - 92-96%: 40% acceptance rate (usually counter)
    - 85-91%: 20% acceptance rate (mostly counter or coin flip)
    - 75-84%: Counter-offer or coin flip
    - 60-74%: Coin flip almost guaranteed
    - Below 60%: Insulting - outright rejection
  - **Counter-offers common:** Sellers negotiate back more often
  - **Coin Flip Mini-Game:** When offers are too low, flip for the deal!
- Manual refresh available for $50

### 2. Inventory Tab
- Grid view of all owned sneakers
- Each card shows:
  - Days held (affects value over time)
  - Purchase price vs. estimated value
  - Profit projection
  - Current market status
- Filter options: All, Hot Items, High Profit
- View detailed stats for any shoe

### 3. Customers Tab
- Active customers who can either BUY from you or SELL to you
- **Two types of customers:**
  
  **Buyers (Green border):**
  - Looking for specific brands from your inventory
  - Shows brand preference and budget
  - Price willingness (80-120% of value)
  - Match inventory to customer demands
  - **Counter-offers:** Will negotiate if your asking price is too high
  
  **Sellers (Blue border):**
  - Approach you with shoes they want to sell
  - Shows complete shoe details (brand, model, colorway, rarity)
  - Displays asking price, estimated value, and potential profit
  - **Asking prices are HIGH:** 95-120% of estimated value
  - **Hidden personality types affect negotiation:**
    - Some sellers are very firm and tough to negotiate with
    - Others are more flexible and willing to move on price
    - You'll have to read their dialogue and reactions to figure out their personality
  - **Contextual dialogue:** Messages adapt to shoe hype, condition, and rarity
  - **Counter-offers:** Will negotiate if your offer is too low (happens frequently!)
  - **Figure out the right price yourself** - no hints given!
  
- Each customer shows:
  - Avatar and name with type badge (BUYING/SELLING)
  - **Real-time countdown display:**
    - Green: 3+ minutes available (⏰ Xm Xs)
    - Orange: 1-3 minutes remaining (⏰ Xm Xs)
    - Red: Under 1 minute (⚠️ Xs)
    - Updates every second in real-time
    - Customers stay for 3-15 minutes of actual real time
    - Time pressure is real - act fast!
- **Advanced Negotiation System:**
  - Customers intelligently counter based on shoe attributes
  - Hot items (🔥) = stronger negotiating position
  - New condition = higher counter-offers
  - Rare/Epic/Legendary = rarity affects pricing
  - Multiple rounds of negotiation possible
  - Accept their counter or negotiate further
  - Deals can fall through if you push too hard

### 4. Sell Shoes Tab
- **Two sections:**
  - **Listed Shoes:** Active listings waiting for buyers
  - **Inventory:** Unlisted shoes ready to sell

- **Three selling methods:**
  
  **📋 List for Sale (NEW!):**
  - Set your own asking price
  - Buyers evaluate based on:
    - **Price vs Market Value** (most important factor)
    - **Hype Status** (🔥 hot items sell faster)
    - **Condition** (New/VNDS/Used affects appeal)
    - **Rarity** (Legendary/Epic more desirable)
    - **Size** (9-11 most popular, extremes harder to sell)
    - **Time Listed** (stale listings lose interest)
  - Real-time buyer interest meter (High/Medium/Low)
  - View counter shows listing visibility
  - Can unlist anytime to adjust price or keep
  - **No guaranteed sale** - buyers decide!
  
  **⚡ Quick Sale:**
  - Instant cash (15% fee)
  - 85% of estimated value
  - Guaranteed sale
  
  **🤖 Bulk Deal:**
  - Instant sale to reseller bot (5% fee)
  - Random offer (70-95% of value)
  - Guaranteed but unpredictable

### 5. Market Trends Tab
- **Individual shoe model tracking** organized by brand
- **Easy-to-Read Brand Sections:**
  - Each brand in its own white card (e.g., "N Nike")
  - All Nike shoes listed as rows underneath
  - Then Adidas section, then New Balance, etc.
  - Shoes within each brand sorted by hottest first
  - Average brand trend shown in header
- Real-time trend indicators for each shoe:
  - 🔥 Hot! (+10% or more) - Extremely high demand
  - 📈 Rising (+1% to +9%) - Growing interest
  - ➡️ Stable (0%) - Steady market
  - 📉 Falling (-1% to -9%) - Declining interest
  - 💀 Tanking (-10% or worse) - Very low demand
- **Clean List Format:**
  - Model name on left (with HOT badge if applicable)
  - Trend icon and percentage on right
  - Hot shoes highlighted with red background and border
  - Proper spacing and alignment - everything fits
  - Text truncates gracefully for long names
  - Easy to scan and find specific models at a glance
- **Trends directly affect gameplay:**
  - Trending shoes worth more
  - Sellers ask premium prices for hot trends
  - Buyers more interested in trending items
  - Market changes every 5 minutes
- **Fully Synced System:**
  - Shoes with +10% trend automatically marked as 🔥 HOT
  - Hot badge in Market Trends shows which shoes are hot everywhere
  - All shoe cards (inventory, listings, customers) sync with current trends
  - Values update in real-time as trends change
- Progress tracker for profit milestones

## Game Mechanics

### Dynamic Pricing & Market Trends
- **Market trends now track individual shoe models** (e.g., "Air Jordan 1", "Yeezy 350")
- Trends range from -20% to +20%
- **Perfect Sync:** Market Trends tab and shoe hot status (🔥) are always in sync
  - If Market Trends shows a shoe at +10% or higher, it's marked HOT everywhere
  - If a shoe is marked HOT, you'll see it trending in Market Trends
  - All inventory, listings, and customer shoes update their status every 5 minutes
- Market values fluctuate based on:
  - **Shoe-specific trends** (updated every 5 minutes)
  - Time held (slight depreciation)
  - Rarity multipliers
  - Condition factors

**How Trends Affect Prices:**
- Trending up (+10%+): Shoes worth 10-20% MORE + marked as HOT (🔥)
- Rising (+5% to +9%): Shoes worth 5-10% MORE
- Trending down (-10%+): Shoes worth 10-15% LESS
- Falling (-5% to -9%): Shoes worth 5-10% LESS

**Random Trend Spikes:**
- Every 5 minutes, there's a 30% chance a random shoe spikes to +10-20%
- Get notified when shoes start trending
- Strategic buying: purchase before trends spike!

### Sales History System
- **Market-wide sales tracking:**
  - Tracks sales from EVERYONE in the market (not just your sales)
  - Other sellers and buyers transact every 2-5 minutes
  - Your sales also added to the history
  - Creates a realistic, dynamic market
  - History shows: brand, model, size, condition, rarity, price, hot status
  - Keeps last 100 sales to maintain performance
  
- **Realistic Pricing:**
  - Market sales occur at 85-110% of estimated value
  - Reflects real market behavior (some deals, some premiums)
  - Prices adjust based on trends, rarity, and condition
  - Hot shoes (🔥) command higher prices in history
  
- **Smart Matching Algorithm:**
  - Prioritizes exact matches (same size, condition, rarity)
  - Recent sales weighted more heavily than old ones
  - Returns top 5 most relevant sales
  - Exact matches marked with ✓ in green
  
- **Displayed on Buy Cards:**
  - Shows last 5 relevant sales for each shoe
  - Helps you determine fair offers without estimated value
  - Use real market data from all sellers
  - If no sales exist, shows "No recent sales data"
  
- **Also Shown in Negotiation Modals:**
  - Sales history visible during buy negotiations
  - Use data to make informed offers
  - Sellers are tough - use history strategically

### Listing & Buyer Interest System
- **Buyers evaluate listings in real-time based on:**
  
  **Market Trend Factor:**
  - Strong uptrend (+10%+) → +25% interest (Everyone wants it!)
  - Rising (+5% to +9%) → +15% interest (Growing demand)
  - Slight uptrend (+1% to +4%) → +5% interest (Mild interest)
  - Strong downtrend (-10%+) → -20% interest (Nobody wants it)
  - Falling (-5% to -9%) → -10% interest (Declining demand)
  
  **Price Analysis (Biggest Factor):**
  - 80% or less of market value → +40% interest (Great deal!)
  - 81-100% of market value → +25% interest (Fair price)
  - 101-120% of market value → +10% interest (Slightly high)
  - 121-140% of market value → -15% interest (Too expensive)
  - 141%+ of market value → -35% interest (Way overpriced)
  
  **Hype Multiplier:**
  - Hot items (🔥) → +20% interest
  
  **Condition Impact:**
  - New/Deadstock → +15% interest
  - VNDS → +5% interest
  - Used → -10% interest
  
  **Rarity Appeal:**
  - Legendary → +20% interest
  - Epic → +15% interest
  - Rare → +10% interest
  - Uncommon → +5% interest
  - Common → No bonus
  
  **Size Desirability:**
  - Size 9-11 → +10% interest (most popular)
  - Size 7-13 → No penalty/bonus
  - Size <7 or >13 → -15% interest (harder to sell)
  
  **Time Listed:**
  - Fresh listings → No penalty
  - 2+ hours listed → -3% per hour (listing gets stale)
  
  **Days Held:**
  - 5+ days → -5% interest (perceived as older inventory)
  
- **Purchase Probability:**
  - High interest (70-100%) → 2-3x more likely to sell quickly
  - Medium interest (40-70%) → Normal sell rate
  - Low interest (0-40%) → May never sell at that price
  
- **Active listings update every second:**
  - Views increment randomly
  - Interest calculated continuously
  - Purchase checked based on interest level

### Counter-Offer Negotiation System
- **Intelligent AI negotiation** based on multiple factors:
  
  **When Buying from Customers (Sellers):**
  - **Challenging negotiation:** Sellers are tough and know their value
  - Acceptance rates:
    - 100%+ of asking → instant accept
    - 95-99% of asking → 60-90% accept rate (personality dependent)
    - 85-95% of minimum → 85-90% will counter or reject
    - 80-85% of minimum → 70-80% counter or force coin flip
    - Below 80% → coin flip or outright rejection
  - Personality drastically affects behavior:
    - Tough Negotiators barely budge and counter aggressively
    - Eager Sellers are more willing to negotiate
    - Collectors value rare shoes even more
  - Hot shoes → they're more firm on price
  - New condition → +5% to counter
  - Rarity bonuses: Common (0%), Uncommon (+3%), Rare (+5%), Epic (+8%), Legendary (+12%)
  - Estimated value vs asking price affects their firmness
  - **Contextual dialogue:** Specific reasons based on shoe attributes
  
  **When Selling to Customers (Buyers):**
  - Price too high → they counter DOWN
  - Hot shoes → they'll pay more
  - Used condition → -15% penalty
  - Days held → -2% per day (older inventory devalues)
  - Budget constraints limit their maximum offer
  
  **Negotiation Flow:**
  1. Make initial offer/asking price (no pre-filled suggestions!)
  2. Customer reacts with personality-based dialogue
  3. They may accept, counter, demand coin flip, or walk away
  4. If countered: accept their price or negotiate again
  5. Multiple rounds possible but deals can fall through
  6. Visual indicators show why they're countering (hype, condition, rarity)
  7. Learn each seller's personality through their reactions and dialogue

### Rarity Impact System
**Rarity now HEAVILY affects all aspects of gameplay:**

**Price Multipliers:**
- Common: 1.0x base price
- Uncommon: 1.2x base price
- Rare: 1.5x base price
- Epic: 2.2x base price
- Legendary: 3.5x base price

**Negotiation Firmness:**
- Common: 80% firmness (easier to negotiate)
- Uncommon: 85% firmness
- Rare: 90% firmness (tough negotiations)
- Epic: 95% firmness (very tough)
- Legendary: 98% firmness (extremely tough, almost no room to negotiate)

**Seller Behavior Changes:**
- Legendary shoes: 95% chance to counter offers below asking, special dialogue ("These are GRAILS")
- Epic shoes: 90% chance to counter, harder to get deals
- Rare shoes: Significantly tougher than before
- Common shoes: Easiest to negotiate

**Counter-Offer Bonuses:**
- Legendary: +30% to counter offers
- Epic: +18% to counter offers
- Rare: +10% to counter offers
- Uncommon: +5% to counter offers
- Common: No bonus

**Buyer Interest:**
- Legendary: +35% buyer interest when listed
- Epic: +25% buyer interest
- Rare: +15% buyer interest
- Uncommon: +8% buyer interest
- Common: No bonus

**Special Dialogue:**
- Legendary shoes get unique responses: "These are LEGENDARY grails", "You trying to disrespect me with that on LEGENDARY kicks?!"
- Epic shoes: "Epic kicks don't go for cheap", "That's Epic rarity bro"
- Sellers are MUCH tougher on rare shoes

### Reputation System
- 5-star rating system
- Increases with profitable deals
- Affects customer trust and access to better deals
- Visual display in header

### Progression Milestones
- **$5,000:** +2 inventory slots (12 total)
- **$10,000:** +2 inventory slots (14 total)
- **$15,000:** +2 inventory slots (16 total)
- **$20,000:** +2 inventory slots (18 total)
- **$25,000:** Final milestone - Game mastery!

### Sneaker Database
**90+ authentic real-life sneakers** with realistic rarities and pricing:

**Legendary (Ultra Limited, <10k pairs made):**
- Air Jordan 1 Dior ($5000 base)
- SB Dunk Low Pigeon ($2000 base)
- Air Jordan 1 Off-White Chicago ($1500 base)
- Air Jordan 1 Travis Scott ($1200 base)
- Union Jordan 1 Storm Blue ($1100 base)
- Air Jordan 4 Travis Scott, Air Max 1 Atmos Elephant, and more

**Epic (Limited Releases, 10-50k pairs):**
- Air Jordan 1 Fragment ($600 base)
- Yeezy 350 V2 Beluga Reflective ($350 base)
- New Balance 990v3 JJJJound ($400 base)
- Air Jordan 3 A Ma Maniere, Union Jordan 4, SB Dunk Low Strangelove, and more

**Rare (Popular Limited, 50-200k pairs):**
- Air Jordan 1 High Chicago ($280 base)
- Yeezy 350 V2 Zebra ($280 base)
- Air Jordan 11 Bred, Dunk Low Panda, and many more

**Uncommon (General Limited, 200k-500k pairs):**
- Air Jordan 1 High Dark Mocha ($180 base)
- New Balance 550, Samba OG, Yeezy Slides, and more

**Common (Mass GR, 500k+ pairs):**
- Air Force 1 Low White/Black ($90 base)
- Superstar, Converse Chuck 70, Vans Old Skool, and more

**Real Prices Based on:**
- Actual market prices (2024-2025)
- Production numbers
- Resale demand
- Collab exclusivity

## Save System
- Automatic save every 30 seconds
- Data stored in browser localStorage
- Saves include: cash, inventory, stats, customers, reputation
- Game can be paused and resumed anytime

## Tips & Strategies

1. **Start Conservative:** Buy low-risk Common shoes to build capital
2. **Rarity = Difficulty:** Legendary and Epic shoes are MUCH harder to negotiate - be prepared to pay near asking
3. **Common Shoes for Practice:** Learn negotiation on Common/Uncommon before tackling rare shoes
4. **Watch Market Trends Tab:** Check regularly to see which shoes are trending (📈 or 🔥)
5. **Buy Trending Shoes Early:** If you see a shoe at +5-10%, buy before it spikes to +15-20%
6. **Avoid Tanking Shoes:** Don't buy shoes with -10% or worse trends - hard to sell
7. **Seller Premiums on Hot Trends:** Expect sellers to ask 15%+ more for strongly trending shoes
8. **List Trending Shoes High:** Buyers will pay premium for trending items - use higher prices
9. **Use Sales History:** Recent sales are from ALL sellers - study the data carefully!
10. **Look for Exact Matches:** Sales with ✓ (same size, condition, rarity) are most comparable
11. **Rarity in Sales:** Legendary sales will be $800-$5000, Common $50-$200
12. **Negotiate Smart:** Offer 97%+ for best acceptance rates; 92-96% usually triggers counters
13. **Legendary = Near Impossible:** Legendary shoes need 98-100% offers or you'll get rejected/coin flip
14. **Epic = Very Tough:** Epic shoes need 95-97% offers, almost always counter below that
15. **Buying is HARD:** Expect frequent rejections, counter-offers, and coin flips - be strategic
16. **Sales Build Over Time:** Market gets more active sales, providing better data as you play
17. **Hot Items Move Fast:** Prioritize buying 🔥 marked shoes but expect tough negotiations
18. **Real-Time Urgency:** Customer timers are REAL - 5m 30s means 5 minutes 30 seconds of actual time
19. **Act Fast on Good Deals:** When you see a good customer seller with low time, negotiate immediately
20. **Match Customers:** Keep diverse brands to match buyer demands
21. **Customer Personality Matters:** Learn to read people through their dialogue
22. **Two Buying Sources:** Use both the marketplace (Buy Shoes tab) and customer sellers for inventory
23. **Time Your Sales:** Use quick sale when you need cash fast
24. **Milestone Planning:** Expand inventory to scale operations
25. **Reputation Matters:** Profitable flips build your star rating
26. **Counter-Offer Strategy:** Expect frequent counter-offers! Be patient and negotiate multiple rounds
27. **Read the Room:** Pay attention to their dialogue - they tell you why they're countering
28. **Know When to Walk:** Sellers are TOUGH everywhere. If they're too firm, walk away
29. **Condition = Leverage:** Deadstock (New) shoes give sellers more negotiating power
30. **Don't Sit on Inventory:** The longer you hold shoes, the less buyers will offer (-2% per day)
31. **Listen to Context:** When they mention trends, hype, or condition - that's affecting their price
32. **Coin Flips:** Low offers often result in coin flips - sometimes worth the risk
33. **Accept Counters Strategically:** If their counter still gives profit, consider taking it
34. **Trial and Error:** Use sales history to learn pricing, not estimated values
35. **Listing Strategy:** Price at or below market value for high interest and quick sales
36. **Premium Pricing:** Hot + trending + high rarity can command 30-50% over base value
37. **Size Matters:** Size 9-11 shoes sell fastest - price extremes (under 7, over 13) lower
38. **Condition Premium:** Deadstock can justify higher prices, Used should be discounted
39. **Watch Interest Meter:** High interest (green) = likely sale soon; Low interest (red) = drop price
40. **Active Management:** Check listings regularly - unlist and relist at better prices if needed
41. **Quick vs Listed:** List when you want max profit; quick sale when you need cash now
42. **Grail Hunting:** Legendary shoes are investments - huge profit potential but need big offers

## Game Culture References & Dialogue
- **Authentic sneaker culture language** throughout
- Dynamic dialogue based on context, market trends, AND rarity:
  - "These are LEGENDARY grails. [Price] or I'm out." - Legendary rarity
  - "These are GRAILS. That offer ain't even close." - Legendary rejection
  - "You trying to disrespect me with that on LEGENDARY kicks?!" - Legendary insult
  - "Epic kicks don't go for cheap. [Price] is my floor." - Epic rarity
  - "These are rare, you gotta come correct with the price." - Epic negotiation
  - "That's Epic rarity bro, you gotta come correct." - Epic defense
  - "These are trending hard right now. Price is only going up!" - Strong uptrend
  - "Market's heating up on these. Get em while you can." - Rising trend
  - "Got [shoe], market's slow but they're still solid." - Downtrend
  - "These are trending up hard, that price is way too low." - Seller defending trending shoe
  - "Market's rising on these, I can't take that." - Negotiation with trend context
  - "Straight grails bro, don't sleep on these" - Legendary hot items
  - "Deadstock pairs don't move for that price" - New condition justification
  - "You're really trying to lowball me?" - Reaction to low offers
  - "Come correct or don't come at all" - Firm negotiation
  - "That's disrespectful honestly" - Insulting offers
  - "Bet, that's what I'm talking about!" - Fair offer acceptance
  - "Grails like these don't come around. [Price] is fair." - Collector with Legendary
- Terminology:
  - **Grails** - Holy grail shoes, rare/desired
  - **Heat** - Fire/hot shoes
  - **Deadstock** - New, unworn condition
  - **VNDS** - Very Near Deadstock
  - **Cop** - To buy/acquire
  - **Finesse** - To trick/lowball someone
  - **That's a heater!** - That's fire/great
- Personalities have distinct speaking styles:
  - Tough: "Take it or leave it", "I know what I got"
  - Collector: "These mean something to me"
  - Eager: "Let's make it happen", "I need to move these"

## Visual Design Features
- **Brand-Specific Color Schemes:**
  - Nike: Orange gradient (#FF6B35)
  - Adidas: Blue gradient (#0066B3)
  - New Balance: Red gradient (#CC0000)
  - Asics: Blue gradient (#0051BA)
  - Converse: Black gradient
  - Vans: Red gradient (#DC0000)
  
- **Multi-Layer Visual Distinction:**
  - Top border of each card in brand color (4px thick)
  - Shoe image area with brand-colored gradient
  - Vertical accent strip next to shoe name in brand color
  - Makes every brand instantly recognizable
  
- **Rarity Visual Effects:**
  - Legendary: Gold glow + animated shining badge
  - Epic: Purple glow + pulsing badge
  - Rare: Blue glow
  - Uncommon: Green glow
  - Common: No glow
  
- **Enhanced Typography:**
  - Colorway text: uppercase, bold, letter-spaced
  - Trend indicators: color-coded and bold
  - Clean hierarchy makes info easy to scan
  
- **Card Identification at a Glance:**
  - Brand (color), Rarity (glow + badge), Model (name), Condition (emoji)
  - Hot status (🔥 + red border)
  - Trend status (📈/📉 with percentage)
  - No two shoes look the same!

## Technical Details
- **Platform:** Browser-based (HTML/CSS/JavaScript)
- **No Dependencies:** Runs entirely client-side
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop
- **Performance:** Optimized for smooth 60 FPS animations
- **Storage:** Uses localStorage API for game saves

## Mobile Optimization

The game now features comprehensive mobile optimization that automatically detects your device and provides the best experience:

### Automatic Device Detection
- **Mobile Devices** (phones): Single-column layout, touch-optimized controls
- **Tablets** (iPad, etc.): 2-column layout with medium sizing
- **Laptops/Desktops**: Full original optimized layout (unchanged)

### Mobile Features
- **Touch-Optimized Controls**: Large tap targets, no tap delay
- **Responsive Layout**: Adapts to portrait and landscape orientations
- **Mobile-Friendly UI**: Adjusted font sizes, spacing, and button sizes
- **Smooth Scrolling**: Momentum scrolling on iOS and Android
- **Optimized Performance**: Lighter visual elements for better battery life
- **PWA Support**: Can be added to home screen on mobile devices

### How to Play on Mobile
1. Open the game URL in your mobile browser
2. The game automatically detects mobile and switches to mobile layout
3. All features work identically - just optimized for touch
4. Save system works across devices (same localStorage)

### Mobile-Specific Adjustments
- **Header**: Stacks vertically with wrapped stats
- **Navigation**: 2x2 grid instead of single row
- **Sneaker Cards**: Full-width for easy reading
- **Buttons**: Full-width for easy tapping
- **Modals**: 95% screen width for mobile
- **Font Sizes**: Optimized for mobile readability

### Device Breakpoints
- Extra Small Mobile: ≤480px width
- Mobile: 481-768px width
- Tablet: 769-1024px width
- Desktop/Laptop: >1024px width

For complete mobile optimization details, see `MOBILE_OPTIMIZATION_GUIDE.md`.

## Controls
- **Mouse:** Click to navigate, negotiate, buy, and sell
- **Keyboard:** Type custom offers in negotiation
- **Tabs:** Switch between game sections
- **Modal Interactions:** Click outside or X to close

## Winning Condition
Reach $25,000 total profit with maximum reputation!

---

**Built with sneakerhead culture in mind. Happy hustling!**


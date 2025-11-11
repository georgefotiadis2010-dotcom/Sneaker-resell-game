# Market Value Calculation System

## Overview
The market value system in this sneaker resell game has been enhanced to provide **realistic, comprehensive, and dynamic pricing** that reflects all the factors that affect real-world sneaker resale values.

## How Market Values Are Calculated

The `calculateMarketValue()` function evaluates **9 major factors** to determine the market price of any sneaker. Values are recalculated every 5 minutes when market trends update, ensuring prices always reflect current market conditions.

---

## Phase 1: Core Value (Base × Rarity × Condition)

### 1. BASE PRICE
- **Source**: Each sneaker model has a base price from the SNEAKER_MODELS database
- **Range**: $50 - $50,000+
- **Description**: This is the retail or historical base value for the specific model
- **Example**: Air Jordan 1 Chicago has a higher base than Air Force 1

### 2. TIER MULTIPLIER (Rarity/Scarcity)
The **biggest** impact on value comes from how rare the shoe is:

| Tier | Multiplier | Description | Example |
|------|-----------|-------------|---------|
| **Standard** | 1.0x | General release, widely available | Yeezy 350 V2 Cream White |
| **Limited** | 2.5x | Limited quantities, regional exclusives | Jordan 1 Bred Toe |
| **Premium** | 4.0x | Special collabs, 1,000-5,000 pairs | Off-White Blazer Mid |
| **Vaulted** | 6.0x | No longer produced, vintage appeal | Jordan 1 Shattered Backboard |
| **Exclusive** | 9.0x | F&F, ultra-exclusive, 200-1,000 pairs | Jordan 1 Dior |
| **Grail** | 15.0x | Museum pieces, under 200 pairs | Nike Mag Back to Future |
| **Unreleased** | 25.0x | Samples, prototypes, never released | Air Yeezy 3 |

### 3. CONDITION MULTIPLIER
Condition has a **HUGE** impact on value:

| Condition | Multiplier | Description |
|-----------|-----------|-------------|
| **Scuffed** | 0.5x | Heavily worn, creasing, stains - budget option |
| **Used** | 0.8x | Lightly worn, some signs of use |
| **VNDS** | 0.9x | Very near deadstock, tried on/worn once |
| **Deadstock** | 1.0x | Brand new, unworn - the baseline |
| **OG** | 1.15x | Vintage deadstock with original box/tags - premium |
| **Celeb Worn** | 1.35x | Celebrity provenance adds value despite wear |

**Example**: A Grail tier shoe in Scuffed condition = 15.0x × 0.5x = 7.5x base price  
A Standard tier shoe in OG condition = 1.0x × 1.15x = 1.15x base price

---

## Phase 2: Size Adjustment

### 4. SIZE MULTIPLIER
Popular sizes command premium prices:

| Size Range | Multiplier | Description |
|------------|-----------|-------------|
| **9.0 - 11.0** | 1.15x | Sweet spot - highest demand |
| **8.5 - 8.9** | 1.08x | Still very popular |
| **11.1 - 11.5** | 1.08x | Still very popular |
| **8.0 - 8.4** | 1.0x | Neutral - acceptable demand |
| **11.6 - 12.0** | 1.0x | Neutral - acceptable demand |
| **7.5 - 7.9** | 0.92x | Less common size |
| **12.1 - 12.5** | 0.92x | Less common size |
| **< 7.5 or > 12.5** | 0.80x | Extreme sizes - limited buyer pool |

**Reasoning**: Size 9-11 fits the majority of buyers, creating higher demand and prices.

---

## Phase 3: Aesthetic & Cultural Value

### 5. COLORWAY MULTIPLIER
Iconic colorways hold value better:

| Colorway Type | Multiplier | Examples |
|--------------|-----------|----------|
| **OG/Original** | 1.25x | OG Chicago, Original colorways |
| **Retro** | 1.15x | Retro releases |
| **Triple Black/White** | 1.10x | Monochrome classics |
| **Black/White** | 1.05x | Classic two-tone |
| **Other** | 1.0x | Standard colorways |

**Reasoning**: OG and classic colorways have historical significance and timeless appeal.

### 6. BRAND PRESTIGE & COLLABORATION BONUS
Some brands and collaborations dominate the resale market:

| Brand/Collab | Multiplier | Description |
|--------------|-----------|-------------|
| **Off-White / Travis Scott** | 1.22x | Ultra-hyped collabs (Virgil Abloh/Travis) |
| **Yeezy** (in model name) | 1.16x | Yeezy brand (Kanye influence) |
| **Jordan** | 1.18x | Strongest resale market (MJ legacy) |
| **Nike / Adidas** | 1.10x | Dominant market players |
| **New Balance** | 1.08x | Rising popularity, collab culture |
| **Asics / Reebok** | 1.05x | Niche brands with loyal following |
| **Other** | 1.0x | Standard brands |

**Note**: The system checks the model name for "Yeezy", "Off-White", and "Travis Scott" to apply special collab bonuses, since these are collaborations within Nike/Adidas brands.

---

## Phase 4: Market Dynamics

### 7. MARKET TREND MULTIPLIER
Real-time market sentiment affects prices:

- **Trend Range**: -20 (cold market) to +20 (hot market)
- **Formula**: `1 + (trend / 100)`
- **Examples**:
  - Trend = +20 → 1.20x multiplier (20% boost)
  - Trend = +10 → 1.10x multiplier (10% boost)
  - Trend = 0 → 1.0x multiplier (neutral)
  - Trend = -10 → 0.90x multiplier (10% decrease)
  - Trend = -20 → 0.80x multiplier (20% decrease)

**Dynamics**:
- Trends change every 5 minutes
- Each shoe's trend shifts by -5 to +5 points
- 30% chance a random shoe gets a hot spike (+10 to +20)
- Reflects social media buzz, celebrity sightings, market hype

### 8. RARITY × CONDITION INTERACTION BONUS
Pristine rare pieces get exponential value boost:

- **Grail/Unreleased/Exclusive + Deadstock/OG**: +12% bonus
- **Premium/Vaulted + Deadstock/OG**: +8% bonus

**Reasoning**: Collectors pay premiums for museum-quality rare pieces.

### 9. MARKET VARIANCE
Realistic market fluctuation accounts for different seller pricing:

- **Range**: -2% to +8%
- **Reasoning**: Different sellers list at different prices based on:
  - Urgency to sell
  - Market knowledge
  - Negotiation room
  - Platform fees

**Previous System**: Had 10-35% variance (too random, inconsistent pricing)  
**New System**: Reduced to -2% to +8% for more predictable, realistic pricing

---

## Value Update System

### When Values Are Recalculated

1. **Every 5 Minutes**: `syncShoeHotStatus()` is called when market trends update
   - Recalculates ALL shoes in inventory
   - Recalculates ALL listed shoes
   - Recalculates ALL available market shoes
   - Recalculates ALL customer offer shoes

2. **On Generation**: When new shoes are generated (market, auctions, customers)

3. **Never During Transactions**: Values are stable during negotiations to prevent exploits

### What Gets Updated

- `shoe.trend` - Current market trend value
- `shoe.isHot` - Whether shoe is currently hot (trend > 10)
- `shoe.estimatedValue` - Comprehensive market value based on all factors

---

## Example Calculations

### Example 1: Standard General Release
**Shoe**: Adidas Yeezy 350 V2 Cream White  
- Base Price: $220
- Tier: Standard (1.0x)
- Condition: Deadstock (1.0x)
- Size: 10 (1.15x - popular size)
- Colorway: Standard (1.0x)
- Brand: Yeezy in model name (1.16x)
- Trend: +5 (1.05x)
- Interaction: None (1.0x)
- Variance: ~1.03x (average)

**Calculation**:  
$220 × 1.0 × 1.0 × 1.15 × 1.0 × 1.16 × 1.05 × 1.0 × 1.03 = **$320**

### Example 2: Grail Sneaker
**Shoe**: Nike Air Mag Back to the Future  
- Base Price: $15,000
- Tier: Grail (15.0x)
- Condition: OG (1.15x)
- Size: 9.5 (1.15x - popular size)
- Colorway: OG (1.25x)
- Brand: Nike (1.10x)
- Trend: +15 (1.15x - hot!)
- Interaction: Grail + OG bonus (1.12x)
- Variance: ~1.03x (average)

**Calculation**:  
$15,000 × 15.0 × 1.15 × 1.15 × 1.25 × 1.10 × 1.15 × 1.12 × 1.03 = **$645,000+**

### Example 3: Heavily Worn Limited Release
**Shoe**: Jordan 1 Bred Toe  
- Base Price: $450
- Tier: Limited (2.5x)
- Condition: Scuffed (0.5x)
- Size: 13 (0.80x - large size)
- Colorway: Black/White (1.05x)
- Brand: Jordan (1.18x)
- Trend: -8 (0.92x - declining)
- Interaction: None (1.0x)
- Variance: ~1.03x (average)

**Calculation**:  
$450 × 2.5 × 0.5 × 0.80 × 1.05 × 1.18 × 0.92 × 1.0 × 1.03 = **$571**

---

## Key Improvements Over Previous System

### ✅ More Realistic Pricing
- Reduced variance from 10-35% to -2% to +8%
- Values are more predictable and consistent
- Better reflects real market conditions

### ✅ Comprehensive Factor Analysis
- Now considers ALL relevant factors (9 phases)
- Added rarity × condition interaction bonus
- Fixed brand detection for Yeezy/Off-White/Travis Scott collabs

### ✅ Dynamic Market System
- Values update every 5 minutes with trend changes
- Hot items appreciate, cold items depreciate
- Market spikes create opportunities

### ✅ Well-Documented Code
- Each multiplier is thoroughly explained
- Clear comments show reasoning
- Easier to maintain and balance

### ✅ Removed Redundant Systems
- Eliminated conflicting daily depreciation
- Now uses single source of truth (calculateMarketValue)
- Values are recalculated comprehensively every 5 minutes

---

## Game Balance Considerations

### Progression
- Standard shoes: $50 - $500 (early game)
- Limited/Premium: $500 - $5,000 (mid game)
- Vaulted/Exclusive: $5,000 - $50,000 (late game)
- Grail/Unreleased: $50,000+ (end game)

### Risk vs Reward
- Higher tier shoes have bigger profit potential
- But also require more capital
- Market trends add timing strategy
- Condition and size create deal hunting opportunities

### Strategy Elements
1. **Buy Low, Sell High**: Purchase during negative trends, sell during positive trends
2. **Size Hunting**: Look for popular sizes for easier resale
3. **Condition Matters**: Deadstock/OG always command premiums
4. **Collab Value**: Off-White, Travis Scott, and Yeezy pieces are instant value
5. **Patience Pays**: Wait for market trends to favor your inventory

---

## Technical Notes

### Performance
- Calculation is O(1) - constant time
- No database queries needed (all data in memory)
- Efficient enough to run every 5 minutes for all shoes

### Extensibility
- Easy to add new factors (just add new multiplier section)
- Easy to adjust balance (tweak multiplier values)
- Clear structure makes modifications straightforward

### Testing
To verify pricing is working correctly:
1. Generate multiple shoes of the same model
2. Compare values with different conditions
3. Check that trends affect prices correctly
4. Verify size premiums/discounts
5. Confirm brand/collab bonuses apply

---

## Future Enhancement Ideas

- Add age multiplier (vintage shoes appreciate over time)
- Add celebrity endorsement events (spike specific models)
- Add seasonal trends (certain styles hot in summer/winter)
- Add authentication system (fake risk for valuable shoes)
- Add condition degradation for held shoes (encourage fast flipping)
- Add market crash events (all values drop temporarily)
- Add hype release events (new shoes enter with hot trends)

---

## Conclusion

The market value system now provides a **realistic, balanced, and engaging** economic simulation that rewards smart buying, patient holding, and strategic selling. Every factor that matters in real sneaker resale is represented, creating depth without overwhelming complexity.


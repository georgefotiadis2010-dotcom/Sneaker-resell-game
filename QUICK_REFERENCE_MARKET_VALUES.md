# Quick Reference: Market Value Multipliers

## At-a-Glance Multiplier Chart

### Rarity Tiers (Biggest Impact)
```
Standard:    1.0x   | General release
Limited:     2.5x   | Regional exclusive
Premium:     4.0x   | Special collab
Vaulted:     6.0x   | No longer produced
Exclusive:   9.0x   | F&F / Ultra limited
Grail:       15.0x  | Museum piece
Unreleased:  25.0x  | Sample/prototype
```

### Condition
```
Scuffed:      0.5x   | Heavily worn
Used:         0.8x   | Lightly worn
VNDS:         0.9x   | Tried on once
Deadstock:    1.0x   | Brand new (baseline)
OG:           1.15x  | Vintage pristine
Celeb Worn:   1.35x  | Celebrity provenance
```

### Size (US Men's)
```
< 7.5:        0.80x  | Too small
7.5 - 7.9:    0.92x  | Small
8.0 - 8.4:    1.00x  | Below average
8.5 - 8.9:    1.08x  | Average
9.0 - 11.0:   1.15x  | SWEET SPOT ⭐
11.1 - 11.5:  1.08x  | Average
11.6 - 12.0:  1.00x  | Above average
12.1 - 12.5:  0.92x  | Large
> 12.5:       0.80x  | Too large
```

### Colorway
```
OG/Original:        1.25x  | Original release
Retro:              1.15x  | Retro style
Triple Black/White: 1.10x  | Monochrome
Black/White:        1.05x  | Classic two-tone
Other:              1.00x  | Standard
```

### Brand/Collab
```
Off-White / Travis Scott: 1.22x  | Ultra-hype collabs
Yeezy (in model name):    1.16x  | Kanye brand
Jordan:                   1.18x  | MJ legacy
Nike / Adidas:            1.10x  | Top brands
New Balance:              1.08x  | Rising star
Asics / Reebok:           1.05x  | Niche
Other:                    1.00x  | Standard
```

### Market Trend
```
-20 to -11:   0.80x - 0.89x  | COLD ❄️
-10 to -1:    0.90x - 0.99x  | Declining
0 to +9:      1.00x - 1.09x  | Stable
+10 to +20:   1.10x - 1.20x  | HOT 🔥
```

### Special Bonuses
```
Grail/Unreleased/Exclusive + Deadstock/OG:  +12%
Premium/Vaulted + Deadstock/OG:             +8%
```

### Market Variance
```
Range: 0.98x - 1.08x (±2% to +8%)
Accounts for different seller pricing strategies
```

---

## Quick Calculation Formula

```
FINAL VALUE = 
  Base Price
  × Tier
  × Condition
  × Size
  × Colorway
  × Brand/Collab
  × Trend
  × Interaction Bonus
  × Variance
```

---

## Quick Tips for Max Value

🎯 **Buy Low**:
- Scuffed condition (50% off!)
- Extreme sizes (20% off!)
- Negative trends (up to 20% off!)
- Standard colorways

🎯 **Sell High**:
- Deadstock/OG condition
- Size 9-11 (sweet spot!)
- Positive trends (up to 20% bonus!)
- OG colorways
- During collaboration hype

🎯 **Hold For**:
- Market trend to improve (+5 to +20)
- 5-minute value recalculation cycles
- Hot status (trend > 10)

🎯 **Flip Fast**:
- Negative trend items (declining!)
- Standard tier (low base value)
- Non-popular sizes (harder to sell)

---

## Value Ranges by Tier

**Standard**: $50 - $500  
**Limited**: $300 - $2,000  
**Premium**: $1,000 - $8,000  
**Vaulted**: $2,000 - $15,000  
**Exclusive**: $5,000 - $50,000  
**Grail**: $30,000 - $300,000  
**Unreleased**: $100,000 - $3,000,000+  

*Note: Actual values depend on all factors*

---

## When Values Update

⏰ **Every 5 Minutes**:
- Market trends shift (-5 to +5 points)
- 30% chance of hot spike (random shoe → +10 to +20 trend)
- ALL shoe values recalculated
- Hot status updated (trend > 10)

📈 **On Generation**:
- New market shoes
- Customer offers
- Auction items

🔒 **Never During**:
- Active negotiations
- Transaction processing

---

## Console Commands for Testing

```javascript
// Check a shoe's trend
getShoeTrend('Nike', 'Air Jordan 1 Chicago')

// Calculate value manually
calculateMarketValue({
    brand: 'Nike',
    model: 'Air Jordan 1 Chicago',
    tier: 'Premium',
    condition: 'Deadstock',
    size: 10,
    colorway: 'OG',
    trend: 0
})

// Force market trend update (testing only)
syncShoeHotStatus()
```

---

## Pro Strategies

### The Condition Flip
Buy scuffed grails cheap → Still 7.5x base price!

### The Size Hunt
Target size 9-11 → 15% instant premium

### The Trend Ride
Buy during negative trends → Sell during positive

### The Collab Bonus
Off-White/Travis Scott → Always 22% more valuable

### The Pristine Grail
Grail + OG condition → 12% interaction bonus

---

## Red Flags (Avoid)

❌ Standard tier + Scuffed + size 14 + negative trend  
❌ Holding items during strong negative trends  
❌ Buying at peak hot trend (buy the dip!)  
❌ Extreme sizes unless deep discount  
❌ Used condition on standard tier (low value)  

---

## Green Lights (Target)

✅ Grail/Exclusive + Deadstock + size 10 + hot trend  
✅ Any collaboration (Off-White, Travis, Yeezy)  
✅ OG colorway + OG condition (nostalgia premium)  
✅ Popular sizes (9-11) on any tier  
✅ Any shoe during market dip (trend < -5)  

---

## Remember

1. **Rarity > Everything** - Tier is the biggest multiplier
2. **Condition Matters** - 2.7x difference (Scuffed vs Celeb Worn)
3. **Size Matters** - 44% premium for sweet spot
4. **Timing Matters** - 50% swings from trends
5. **Knowledge = Profit** - Understanding multipliers beats luck

---

Print this and keep it handy! 🎯


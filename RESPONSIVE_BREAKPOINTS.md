# Responsive Breakpoints Reference

## Quick Reference Card

### Device Breakpoints

```
┌─────────────────────────────────────────────────────────────┐
│                    RESPONSIVE BREAKPOINTS                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📱 EXTRA SMALL MOBILE (≤480px)                             │
│  ├─ Title: 22px                                             │
│  ├─ Single column grid                                      │
│  ├─ Minimal padding                                         │
│  └─ Smallest touch targets                                  │
│                                                              │
│  📱 MOBILE (481px - 768px)                                   │
│  ├─ Title: 28px                                             │
│  ├─ Single column grid (portrait)                           │
│  ├─ 2-column grid (landscape)                               │
│  ├─ Wrapped navigation (2x2)                                │
│  └─ Optimized touch targets                                 │
│                                                              │
│  📱 TABLET (769px - 1024px)                                  │
│  ├─ Title: 36px                                             │
│  ├─ 2-column grid                                           │
│  ├─ Single row navigation                                   │
│  └─ Medium sizing                                           │
│                                                              │
│  💻 DESKTOP/LAPTOP (>1024px)                                │
│  ├─ Title: 42px                                             │
│  ├─ 3-column grid                                           │
│  ├─ Full navigation bar                                     │
│  └─ Original optimized layout                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Layout Comparison

### Header Layout

#### Desktop (>1024px)
```
┌────────────────────────────────────────────────────────────┐
│ SNEAKER HUSTLE | Cash | Profit | Rep | Inv | Odds | Reset │
└────────────────────────────────────────────────────────────┘
```

#### Tablet (769-1024px)
```
┌────────────────────────────────────────────────────────────┐
│ SNEAKER HUSTLE    | Cash | Profit | Rep | Inv | Odds |    │
│                   | Reset                                  │
└────────────────────────────────────────────────────────────┘
```

#### Mobile (≤768px)
```
┌────────────────────────┐
│    SNEAKER HUSTLE      │
│ ┌────────┬────────┐    │
│ │ Cash   │ Profit │    │
│ ├────────┼────────┤    │
│ │ Rep    │ Inv    │    │
│ ├────────┼────────┤    │
│ │ Odds   │ Reset  │    │
│ └────────┴────────┘    │
└────────────────────────┘
```

### Navigation Tabs

#### Desktop (>1024px)
```
┌──────────────────────────────────────────────────────┐
│ [Buy Shoes] [Sell Shoes] [Auctions] [Market Trends] │
└──────────────────────────────────────────────────────┘
```

#### Mobile (≤768px)
```
┌────────────────────────┐
│ [Buy Shoes] [Sell]     │
│ [Auctions]  [Market]   │
└────────────────────────┘
```

### Sneaker Grid

#### Desktop (>1024px)
```
┌─────────────────────────────────────────┐
│ [Card 1] [Card 2] [Card 3]             │
│ [Card 4] [Card 5] [Card 6]             │
└─────────────────────────────────────────┘
```

#### Tablet (769-1024px)
```
┌─────────────────────────────────────────┐
│ [Card 1]          [Card 2]             │
│ [Card 3]          [Card 4]             │
└─────────────────────────────────────────┘
```

#### Mobile Portrait (≤768px)
```
┌──────────────────┐
│   [Card 1]       │
│   [Card 2]       │
│   [Card 3]       │
└──────────────────┘
```

#### Mobile Landscape (≤768px, landscape)
```
┌─────────────────────────────────┐
│  [Card 1]      [Card 2]         │
│  [Card 3]      [Card 4]         │
└─────────────────────────────────┘
```

## Font Sizes

| Element        | Desktop | Tablet | Mobile | Small Mobile |
|---------------|---------|--------|--------|--------------|
| Title         | 42px    | 36px   | 28px   | 22px         |
| Stat Value    | 16px    | 16px   | 14px   | 12px         |
| Stat Label    | 12px    | 12px   | 10px   | 9px          |
| Tab Button    | 14px    | 12px   | 11px   | 10px         |
| Sneaker Name  | 16px    | 15px   | 13px   | 12px         |
| Sneaker Price | 24px    | 20px   | 18px   | 16px         |
| Button Text   | 13px    | 12px   | 12px   | 11px         |

## Spacing & Padding

| Element        | Desktop | Tablet | Mobile |
|---------------|---------|--------|--------|
| Container     | 20px    | 15px   | 10px   |
| Cards         | 15px    | 12px   | 10px   |
| Buttons       | 12-20px | 10-16px| 8-12px |
| Grid Gap      | 15px    | 12px   | 10px   |

## Border & Shadow Sizes

| Element        | Desktop | Mobile |
|---------------|---------|--------|
| Border Width  | 4px     | 2px    |
| Box Shadow    | 8px 8px | 3px 3px|

## Touch Target Sizes

### Minimum Touch Targets (Mobile)
- **Buttons**: 44px × 44px minimum
- **Tab Buttons**: 48px height minimum
- **Input Fields**: 44px height minimum
- **Close Buttons**: 44px × 44px minimum

## CSS Media Query Reference

```css
/* Extra Small Mobile */
@media (max-width: 480px) { }

/* Mobile */
@media (max-width: 768px) { }

/* Mobile Landscape */
@media (max-width: 768px) and (orientation: landscape) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop (default, no media query needed) */
/* min-width: 1025px */
```

## JavaScript Device Detection

```javascript
// Check if mobile
if (isMobileDevice()) {
    // Mobile-specific code
}

// Check if tablet
if (isTabletDevice()) {
    // Tablet-specific code
}

// Check orientation
if (window.innerWidth > window.innerHeight) {
    // Landscape
} else {
    // Portrait
}
```

## Common Screen Sizes

### Mobile Devices
- iPhone SE: 375 × 667
- iPhone 12/13: 390 × 844
- iPhone 12/13 Pro Max: 428 × 926
- Samsung Galaxy S21: 360 × 800
- Google Pixel 5: 393 × 851

### Tablets
- iPad Mini: 768 × 1024
- iPad Air: 820 × 1180
- iPad Pro 11": 834 × 1194
- iPad Pro 12.9": 1024 × 1366
- Android Tablets: 800 × 1280

### Laptops/Desktops
- Laptop: 1366 × 768
- Desktop: 1920 × 1080
- Wide Desktop: 2560 × 1440

## Testing Checklist

### Orientation Testing
- [ ] Portrait mode (mobile)
- [ ] Landscape mode (mobile)
- [ ] Tablet portrait
- [ ] Tablet landscape

### Screen Size Testing
- [ ] 320px width (smallest)
- [ ] 375px width (iPhone)
- [ ] 768px width (tablet)
- [ ] 1024px width (small laptop)
- [ ] 1366px+ width (laptop)

### Feature Testing
- [ ] All buttons tappable
- [ ] No horizontal scroll
- [ ] Text readable
- [ ] Images load
- [ ] Modals fit screen
- [ ] Forms usable
- [ ] Navigation works
- [ ] Game saves/loads

## Performance Targets

### Mobile Targets
- First Paint: < 1.5s
- Interactive: < 3s
- Smooth scrolling: 60fps
- Button response: < 100ms

### Optimization Applied
- Reduced shadow complexity
- Smaller borders
- Optimized font sizes
- Hardware-accelerated scrolling
- Passive event listeners
- Touch action optimization

## Browser Support

✅ iOS Safari 12+
✅ Chrome Mobile 80+
✅ Samsung Internet 12+
✅ Firefox Mobile 80+
✅ Edge Mobile 80+
✅ Opera Mobile 60+

## Notes

- All measurements in pixels (px)
- Breakpoints based on width
- Mobile-first approach for critical features
- Progressive enhancement for desktop
- Graceful degradation for older browsers


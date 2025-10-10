# 📁 Project Structure Guide

## Overview

The project is now organized into modular sections for easy maintenance and modification. Each file has a specific purpose and is clearly documented.

```
landing page voxy/
├── index.html                    # Main HTML file
│
├── css/                          # 🎨 All styles (modular)
│   ├── variables.css            # Colors, fonts, spacing (MODIFY HERE)
│   ├── base.css                 # Reset & foundation styles
│   ├── layout.css               # Grid, flexbox, containers
│   ├── typography.css           # Headings, text styles
│   ├── components.css           # Section components
│   └── responsive.css           # Mobile/tablet adjustments
│
├── js/                           # 🔧 All JavaScript (modular)
│   ├── config.js                # GSAP configuration (MODIFY HERE)
│   ├── main.js                  # Main initialization
│   │
│   ├── animations/              # Animation modules
│   │   ├── scroll-smoother-init.js   # ScrollSmoother setup
│   │   ├── heading-animation.js      # Heading reveal
│   │   ├── text-effects.js           # Text splitting
│   │   ├── bar-animations.js         # Bar colors/heights
│   │   └── zoom-animation.js         # Zoom effect
│   │
│   └── utils/                   # Utility functions
│       ├── helpers.js           # Reusable helpers
│       └── browser-fixes.js     # Browser-specific fixes
│
├── animation-examples.js         # 📚 Ready-to-use animations
├── README.md                     # Full documentation
├── QUICKSTART.md                 # Quick start guide
└── STRUCTURE.md                  # This file
```

---

## 🎯 Where to Make Changes

### 🎨 **Styling Changes**

#### Colors, Fonts, Spacing
**File:** `css/variables.css`

```css
:root {
  /* Colors */
  --color-bg: #111;           /* Background color */
  --color-text: white;        /* Text color */
  --color-border: white;      /* Border color */
  
  /* Spacing */
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  
  /* Fonts */
  --font-body: "Open Sans", sans-serif;
  --font-display: "wild_worldbold", sans-serif;
}
```

#### Layout & Grid
**File:** `css/layout.css`
- Container widths
- Grid layouts
- Flexbox configurations

#### Individual Components
**File:** `css/components.css`
- `.image-grid` - Image grid layout
- `.bars` - Bar section
- `.parallax-images` - Parallax section
- `.staggered` - Staggered text section

#### Mobile Responsive
**File:** `css/responsive.css`
- All media queries
- Mobile-specific overrides

---

### 🔧 **JavaScript Changes**

#### GSAP Settings (START HERE!)
**File:** `js/config.js`

```javascript
const GSAP_CONFIG = {
  scrollSmoother: {
    smooth: 1,              // Change smoothness
    effects: true,          // Enable/disable effects
  },
  
  animations: {
    enableTextSplit: true,  // Toggle text animations
    enableBarColors: true,  // Toggle bar colors
    staggerDelay: 0.1,     // Animation delays
  },
  
  debug: {
    enabled: false,         // Show console logs
    showMarkers: false      // Show ScrollTrigger markers
  }
};
```

#### Individual Animations
- **Heading:** `js/animations/heading-animation.js`
- **Text Effects:** `js/animations/text-effects.js`
- **Bars:** `js/animations/bar-animations.js`
- **Zoom Effect:** `js/animations/zoom-animation.js`
- **ScrollSmoother:** `js/animations/scroll-smoother-init.js`

#### Utilities
- **Helpers:** `js/utils/helpers.js`
- **Browser Fixes:** `js/utils/browser-fixes.js`

---

## 🚀 Common Tasks

### Task 1: Change Color Scheme

1. Open `css/variables.css`
2. Modify color variables:
```css
:root {
  --color-bg: #0a0a0a;        /* Darker background */
  --color-text: #f0f0f0;      /* Lighter text */
}
```

### Task 2: Adjust Scroll Smoothness

1. Open `js/config.js`
2. Change smooth value:
```javascript
scrollSmoother: {
  smooth: 1.5,  // Higher = smoother (try 0.5 - 2)
}
```

### Task 3: Disable Text Animations

1. Open `js/config.js`
2. Set to false:
```javascript
animations: {
  enableTextSplit: false,
}
```

### Task 4: Add New Animation

1. Create new file in `js/animations/`
2. Export function
3. Import in `index.html`
4. Call in `js/main.js`

Example:
```javascript
// js/animations/my-animation.js
function initMyAnimation() {
  gsap.from('.my-element', {
    scrollTrigger: {
      trigger: '.my-element',
      start: 'top 80%'
    },
    opacity: 0,
    y: 100
  });
}
```

### Task 5: Modify Mobile Layout

1. Open `css/responsive.css`
2. Find the breakpoint section:
```css
@media screen and (max-width: 768px) {
  /* Add your mobile styles here */
}
```

### Task 6: Add New Section Component

1. Add HTML to `index.html`
2. Add styles to `css/components.css`:
```css
/* ========== MY NEW SECTION ========== */
.my-section {
  /* styles here */
}
```
3. Add animation in new file: `js/animations/my-section.js`
4. Include in `index.html` and `js/main.js`

---

## 📝 File Dependencies

### CSS Load Order (Important!)
```
1. variables.css    → Defines all CSS variables
2. base.css         → Uses variables
3. layout.css       → Uses variables
4. typography.css   → Uses variables
5. components.css   → Uses variables
6. responsive.css   → Overrides everything
```

### JavaScript Load Order (Important!)
```
1. GSAP libraries   → Core functionality
2. config.js        → Configuration
3. helpers.js       → Utilities
4. browser-fixes.js → Uses helpers
5. animations/*     → Use config & helpers
6. main.js          → Initializes everything
```

---

## 🔍 Quick Reference

### Finding Code

| What to Change | File to Edit |
|---------------|--------------|
| Colors | `css/variables.css` |
| Fonts | `css/variables.css` |
| Spacing | `css/variables.css` |
| Scroll smoothness | `js/config.js` |
| Enable/disable animations | `js/config.js` |
| Debug mode | `js/config.js` |
| Mobile layout | `css/responsive.css` |
| Grid layouts | `css/layout.css` |
| Component styles | `css/components.css` |
| Add new animation | `js/animations/[new-file].js` |
| Browser fixes | `js/utils/browser-fixes.js` |

### Adding New Content

1. **New HTML Section**
   - Add to `index.html`
   - Style in `css/components.css`
   - Animate in `js/animations/[name].js`

2. **New Animation**
   - Create `js/animations/my-animation.js`
   - Add `<script>` tag in `index.html`
   - Call in `js/main.js`

3. **New Utility Function**
   - Add to `js/utils/helpers.js`
   - Use in any animation file

---

## 🎨 Best Practices

### CSS
- ✅ Use CSS variables for all colors/spacing
- ✅ Keep component styles in `components.css`
- ✅ All responsive in `responsive.css`
- ❌ Don't use inline styles
- ❌ Don't repeat values (use variables)

### JavaScript
- ✅ One file per animation
- ✅ Use `GSAP_CONFIG` for settings
- ✅ Use `Helpers` for utilities
- ✅ Check `prefersReducedMotion`
- ❌ Don't put everything in one file
- ❌ Don't hardcode values (use config)

### Organization
- ✅ Group related files in folders
- ✅ Use descriptive file names
- ✅ Comment your code
- ✅ Keep files focused (one purpose)

---

## 🐛 Debugging

### Enable Debug Mode

1. Open `js/config.js`
2. Enable debug:
```javascript
debug: {
  enabled: true,        // Show console logs
  showMarkers: true     // Show ScrollTrigger markers
}
```

3. Open browser console (F12)
4. Scroll and check logs

### Common Issues

**Animations not working?**
- Check console for errors
- Verify file load order in `index.html`
- Check `config.js` settings

**Styles not applying?**
- Check CSS variable names
- Verify specificity
- Check responsive overrides

**ScrollTrigger issues?**
- Call `ScrollTrigger.refresh()` after changes
- Check trigger elements exist
- Enable markers for debugging

---

## 📚 Next Steps

1. **Customize Colors**: Edit `css/variables.css`
2. **Adjust Animations**: Edit `js/config.js`
3. **Add Content**: Edit `index.html` and `css/components.css`
4. **Test Mobile**: Check `css/responsive.css`

For detailed documentation, see:
- `README.md` - Full guide
- `QUICKSTART.md` - Quick start
- `animation-examples.js` - Animation library

---

**Happy coding! 🚀**


# GSAP ScrollSmoother Demo

A modern, smooth-scrolling website built with GSAP's ScrollSmoother plugin, featuring parallax effects, speed controls, and text animations.

## 🚀 Features

- **Smooth Scrolling**: Native-feeling scroll with GSAP ScrollSmoother
- **Parallax Effects**: Multiple parallax image animations
- **Speed Control**: Variable scroll speeds for different elements
- **Text Animations**: Split-text stagger effects
- **Accessibility**: Full support for `prefers-reduced-motion`
- **Mobile Optimized**: Works seamlessly on iOS, Android, and all major browsers
- **Cross-browser Compatible**: Safari, Chrome, Firefox, Edge, Opera

## 📦 Setup

### Quick Start

1. Open `index.html` in your browser
2. That's it! The site uses CDN-hosted libraries.

### File Structure

```
landing page voxy/
├── index.html                    # Main HTML file
├── css/                          # 🎨 Modular styles
│   ├── variables.css            # Colors, fonts, spacing
│   ├── base.css                 # Reset & foundation
│   ├── layout.css               # Grid & flexbox
│   ├── typography.css           # Text styles
│   ├── components.css           # Section components
│   └── responsive.css           # Mobile/tablet
├── js/                           # 🔧 Modular JavaScript
│   ├── config.js                # GSAP configuration
│   ├── main.js                  # Main initialization
│   ├── animations/              # Animation modules
│   │   ├── scroll-smoother-init.js
│   │   ├── heading-animation.js
│   │   ├── text-effects.js
│   │   └── bar-animations.js
│   └── utils/                   # Utility functions
│       ├── helpers.js
│       └── browser-fixes.js
├── animation-examples.js         # Ready-to-use animations
├── README.md                     # This file
├── QUICKSTART.md                 # Quick start guide
└── STRUCTURE.md                  # Project structure guide
```

> **💡 Tip:** See `STRUCTURE.md` for detailed information about the modular structure and where to make changes.

## 🎨 GSAP ScrollSmoother Guide

### Core Concepts

ScrollSmoother creates a smooth scrolling experience by wrapping your content in two containers:

```html
<div id="wrapper">
  <section id="content">
    <!-- Your scrolling content here -->
  </section>
</div>
```

### Data Attributes

#### `data-speed`

Controls how fast/slow elements move while scrolling:

```html
<!-- Moves slower than scroll (parallax effect) -->
<div data-speed="0.8">Slower</div>

<!-- Moves at normal scroll speed -->
<div data-speed="1">Normal</div>

<!-- Moves faster than scroll -->
<div data-speed="1.2">Faster</div>
```

**Values:**
- `< 1.0` = Slower than scroll (creates depth)
- `1.0` = Normal scroll speed
- `> 1.0` = Faster than scroll (moves ahead)

#### `data-speed="auto"`

Automatic parallax for images:

```html
<div class="image-container" style="overflow: hidden; height: 500px;">
  <img data-speed="auto" src="image.jpg" style="height: 140%;">
</div>
```

**Requirements for auto parallax:**
- Container must have `overflow: hidden`
- Image must be larger than container (typically 120-150% height)
- Container needs defined height

### Adding New Animations

#### 1. Simple Speed Control

```html
<div data-speed="0.5">
  <h2>This moves half the scroll speed</h2>
</div>
```

#### 2. Image Parallax

```html
<div class="parallax-container" style="overflow: hidden; height: 600px;">
  <img data-speed="auto" src="your-image.jpg" style="height: 150%; object-fit: cover;">
</div>
```

#### 3. Custom Lag Effect (JavaScript)

```javascript
// Add lag to make element "follow" the scroll
smoother.effects(element, { 
  speed: 1,      // Base speed
  lag: 0.5       // Lag amount (0-1)
});
```

#### 4. ScrollTrigger Animations

Combine with ScrollTrigger for more complex animations:

```javascript
gsap.to('.my-element', {
  scrollTrigger: {
    trigger: '.my-element',
    start: 'top 80%',
    end: 'top 20%',
    scrub: true,        // Smooth scrubbing
    markers: false      // Set true for debugging
  },
  opacity: 1,
  scale: 1,
  y: 0
});
```

#### 5. Split Text Animation

```javascript
// Split text into characters
const split = new SplitText('.my-text', { type: 'chars' });

// Animate each character with lag
split.chars.forEach((char, i) => {
  smoother.effects(char, { 
    speed: 1, 
    lag: i * 0.1  // Increasing lag per character
  });
});
```

### ScrollTrigger Integration

ScrollSmoother works seamlessly with ScrollTrigger:

```javascript
ScrollTrigger.create({
  trigger: '.section',
  start: 'top center',
  end: 'bottom center',
  onEnter: () => console.log('Section entered'),
  onLeave: () => console.log('Section left'),
  markers: true  // Debug markers
});
```

### Animation Patterns

#### Pattern 1: Fade In on Scroll

```javascript
gsap.from('.fade-in-element', {
  scrollTrigger: {
    trigger: '.fade-in-element',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  },
  opacity: 0,
  y: 50,
  duration: 1
});
```

#### Pattern 2: Pin Section

```javascript
ScrollTrigger.create({
  trigger: '.pinned-section',
  start: 'top top',
  end: '+=500',
  pin: true,
  pinSpacing: true
});
```

#### Pattern 3: Scrub Animation

```javascript
gsap.to('.scrub-element', {
  scrollTrigger: {
    trigger: '.scrub-element',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1  // Smooth scrubbing with 1 second lag
  },
  x: 500,
  rotation: 360
});
```

#### Pattern 4: Batch Animation

```javascript
ScrollTrigger.batch('.batch-items', {
  onEnter: batch => gsap.to(batch, {
    opacity: 1,
    y: 0,
    stagger: 0.1
  }),
  start: 'top 80%'
});
```

## 🎯 Best Practices

### Performance

1. **Limit Parallax Elements**: Keep parallax effects under 20 elements per page
2. **Use `data-speed="auto"`**: Let GSAP calculate parallax instead of manual values
3. **Optimize Images**: Use appropriate image sizes and formats (WebP when possible)
4. **Debounce Resize**: Already implemented in `script.js`
5. **Lazy Load Images**: Use `loading="lazy"` attribute (already in HTML)

### Accessibility

```javascript
// Check for reduced motion preference (already implemented)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const smoother = ScrollSmoother.create({
  smooth: prefersReducedMotion ? 0 : 1,  // Disable smooth scroll
  effects: !prefersReducedMotion         // Disable parallax effects
});
```

### Mobile Optimization

- ✅ `normalizeScroll: true` - Prevents mobile browser chrome issues
- ✅ `ignoreMobileResize: true` - Prevents refresh on address bar show/hide
- ✅ `preventDefault: true` - Better touch handling
- ✅ Safari iOS bounce prevention (implemented in script.js)

### Cross-Browser Support

All features work on:
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox
- ✅ Safari (Desktop & iOS)
- ✅ Edge
- ✅ Opera

## 🔧 Customization

### Centralized Configuration

All main settings are in `js/config.js`. This is the easiest way to customize the site:

```javascript
// js/config.js
const GSAP_CONFIG = {
  scrollSmoother: {
    smooth: 1.5,           // Change scroll smoothness
    effects: true,         // Enable/disable parallax
  },
  animations: {
    enableTextSplit: true, // Toggle text animations
    enableBarColors: true, // Toggle bar colors
  },
  debug: {
    enabled: true,         // Show debug logs
  }
};
```

### Change Smooth Scroll Speed

**Method 1 (Recommended):** Edit `js/config.js`
```javascript
scrollSmoother: {
  smooth: 2,  // Higher = smoother but slower (default: 1)
}
```

**Method 2:** Edit `js/animations/scroll-smoother-init.js` directly

### Disable on Mobile

```javascript
ScrollSmoother.create({
  smooth: window.innerWidth > 768 ? 1 : 0,
  effects: window.innerWidth > 768
});
```

### Custom Easing

```javascript
ScrollSmoother.create({
  smooth: 1,
  effects: true,
  smoothTouch: 0.1  // Smooth scrolling on touch devices
});
```

## 📚 Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollSmoother Docs](https://greensock.com/docs/v3/Plugins/ScrollSmoother)
- [ScrollTrigger Docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP Forums](https://greensock.com/forums/)
- [CodePen Examples](https://codepen.io/GreenSock)

## 🚨 Important Notes

### GSAP Premium Plugins

ScrollSmoother and SplitText are **premium plugins** that require:
- Club GreenSock membership, OR
- A commercial license

For development/testing:
- Use the CodePen CDN links (included in this demo)
- Get a free trial at [greensock.com/trial](https://greensock.com/trial)

### Production Deployment

For production:
1. Purchase Club GreenSock membership or license
2. Download plugins from your GSAP account
3. Host plugins on your own server
4. Update script tags in `index.html`

## 🐛 Troubleshooting

### Scrolling feels laggy
- Reduce `smooth` value (try 0.5 or 0.7)
- Reduce number of parallax elements
- Check for heavy images

### Parallax not working
- Ensure parent has `overflow: hidden`
- Image must be larger than container
- Check `data-speed="auto"` is set

### Mobile issues
- Verify `normalizeScroll: true` is set
- Check `ignoreMobileResize: true` is enabled
- Test without smooth scrolling on mobile

### ScrollTrigger refresh needed
```javascript
ScrollTrigger.refresh();  // Call after DOM changes
```

## 📝 License

This is a demo project. GSAP itself has its own licensing:
- **GSAP Core**: Free for all uses
- **ScrollTrigger**: Free for all uses
- **ScrollSmoother**: Requires membership/license
- **SplitText**: Requires membership/license

---

**Built with ❤️ using GSAP**


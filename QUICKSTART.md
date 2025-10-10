# Quick Start Guide

## 🚀 Getting Started (2 Minutes)

### Step 1: Open the Website
Simply open `index.html` in your browser:
- **Double-click** `index.html`, or
- **Right-click** → Open with → Your browser, or
- **Drag and drop** `index.html` into a browser window

### Step 2: That's it! 🎉
The site is ready to use. Scroll to see all the smooth animations.

---

## 📱 Testing

### Desktop Testing
- Open in Chrome, Firefox, Safari, or Edge
- Scroll through the page to see all effects
- Check browser console (F12) - should show no errors

### Mobile Testing
- Upload to a server or use local server
- Test on iOS Safari and Chrome Mobile
- Verify smooth scrolling works

---

## 📁 Project Structure

The project is now modular and easy to customize:

```
css/
  ├── variables.css      ← Edit colors, fonts, spacing HERE
  ├── base.css           ← Foundation styles
  ├── layout.css         ← Grid & flexbox
  ├── typography.css     ← Text styles
  ├── components.css     ← Section styles
  └── responsive.css     ← Mobile styles

js/
  ├── config.js          ← Edit GSAP settings HERE
  ├── main.js            ← Main initialization
  ├── animations/        ← Individual animations
  └── utils/             ← Helper functions
```

See `STRUCTURE.md` for detailed guide.

---

## 🛠️ Adding Your Own Animations

### Method 1: Use Data Attributes (Easiest)

```html
<!-- In your HTML -->
<div data-speed="0.8">
  This moves slower than scroll
</div>

<div data-speed="1.2">
  This moves faster than scroll
</div>
```

### Method 2: Use Ready-Made Functions

1. Include `animation-examples.js` in your HTML:
```html
<script src="animation-examples.js"></script>
```

2. Call functions in your `script.js`:
```javascript
// Fade in elements
fadeInOnScroll('.my-element');

// Slide from left
slideInLeft('.my-card');

// Pin section
pinSection('.my-section', 500);

// Batch animate
batchAnimation('.list-item');
```

### Method 3: Custom ScrollTrigger

Add to `script.js`:

```javascript
gsap.from('.my-element', {
  scrollTrigger: {
    trigger: '.my-element',
    start: 'top 80%',
    end: 'top 50%',
    scrub: true
  },
  opacity: 0,
  y: 100
});
```

---

## 🎨 Common Animation Patterns

### 1. Image Parallax
```html
<div style="overflow: hidden; height: 500px;">
  <img data-speed="auto" src="image.jpg" style="height: 150%;">
</div>
```

### 2. Stagger Items
```javascript
gsap.from('.item', {
  scrollTrigger: {
    trigger: '.container',
    start: 'top 80%'
  },
  opacity: 0,
  y: 50,
  stagger: 0.2  // Delay between each item
});
```

### 3. Text Reveal
```javascript
const split = new SplitText('.title', { type: 'chars' });
gsap.from(split.chars, {
  scrollTrigger: '.title',
  opacity: 0,
  y: 50,
  stagger: 0.05
});
```

---

## 🔧 Customization

### Easy Configuration (NEW!)

All settings are centralized in `js/config.js`:

```javascript
const GSAP_CONFIG = {
  scrollSmoother: {
    smooth: 1.5,  // Change this!
  },
  animations: {
    enableTextSplit: true,
    enableBarColors: true,
  },
  debug: {
    enabled: true,  // Show debug logs
  }
};
```

### Change Scroll Smoothness
**Edit:** `js/config.js`
```javascript
scrollSmoother: {
  smooth: 1.5,  // Higher = smoother (try 0.5 - 2)
}
```

### Change Colors
**Edit:** `css/variables.css`
```css
:root {
  --color-bg: #000;
  --color-text: #fff;
}
```

### Disable on Mobile
```javascript
ScrollSmoother.create({
  smooth: window.innerWidth > 768 ? 1 : 0,
  effects: window.innerWidth > 768
});
```

### Add Debug Markers
```javascript
gsap.to('.element', {
  scrollTrigger: {
    trigger: '.element',
    markers: true,  // Shows trigger points
    start: 'top 80%'
  }
});
```

---

## 🐛 Troubleshooting

### Issue: Animations not working
**Solution:** Open browser console (F12) and check for errors

### Issue: Smooth scroll too slow/fast
**Solution:** Adjust `smooth` value in `script.js` (line 11)

### Issue: Mobile scroll issues
**Solution:** 
- Ensure `normalizeScroll: true` is set
- Try `smooth: 0` for mobile devices

### Issue: Images loading slowly
**Solution:** Optimize images or add loading states

### Issue: After adding content, triggers are off
**Solution:** Call `ScrollTrigger.refresh()` after adding content

---

## 📚 Learn More

- **Project Structure**: See `STRUCTURE.md` ⭐ (NEW!)
- **Full Documentation**: See `README.md`
- **Animation Examples**: See `animation-examples.js`
- **GSAP Docs**: https://greensock.com/docs/

---

## 🎯 Next Steps

1. **Replace images** with your own
2. **Modify text content** in `index.html`
3. **Adjust colors** in `styles.css`
4. **Add animations** using examples above
5. **Test on mobile** devices

---

## ⚡ Quick Commands

```bash
# Open in browser (Mac)
open index.html

# Open in browser (Windows)
start index.html

# Start local server (Python 3)
python -m http.server 8000

# Start local server (Node.js)
npx serve
```

Then visit: http://localhost:8000

---

**Happy Animating! 🎨**


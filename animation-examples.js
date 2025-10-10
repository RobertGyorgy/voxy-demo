/**
 * GSAP ANIMATION EXAMPLES & QUICK REFERENCE
 * ==========================================
 * Copy and paste these examples to quickly add new animations
 * All examples work with the current ScrollSmoother setup
 */

// ============================================
// 1. BASIC SCROLL ANIMATIONS
// ============================================

// Fade in element when it enters viewport
function fadeInOnScroll(selector) {
  gsap.from(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      end: 'top 50%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 1
  });
}

// Slide in from left
function slideInLeft(selector) {
  gsap.from(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    x: -100,
    opacity: 0,
    duration: 1
  });
}

// Slide in from right
function slideInRight(selector) {
  gsap.from(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    x: 100,
    opacity: 0,
    duration: 1
  });
}

// Scale up animation
function scaleUp(selector) {
  gsap.from(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)'
  });
}

// ============================================
// 2. SCRUB ANIMATIONS (tied to scroll position)
// ============================================

// Rotate on scroll
function rotateOnScroll(selector) {
  gsap.to(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    rotation: 360
  });
}

// Move horizontally on scroll
function horizontalMove(selector) {
  gsap.to(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    x: 300
  });
}

// Opacity change on scroll
function opacityChange(selector) {
  gsap.to(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top center',
      end: 'bottom center',
      scrub: true
    },
    opacity: 0.3
  });
}

// ============================================
// 3. PIN ANIMATIONS (sticky sections)
// ============================================

// Pin section while scrolling
function pinSection(selector, duration = 500) {
  ScrollTrigger.create({
    trigger: selector,
    start: 'top top',
    end: `+=${duration}`,
    pin: true,
    pinSpacing: true
  });
}

// Pin with animation
function pinWithAnimation(selector) {
  gsap.to(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top top',
      end: '+=500',
      scrub: 1,
      pin: true
    },
    scale: 1.2,
    opacity: 0.5
  });
}

// ============================================
// 4. TEXT ANIMATIONS
// ============================================

// Stagger text reveal (requires SplitText)
function staggerTextReveal(selector) {
  const split = new SplitText(selector, { type: 'chars, words' });
  
  gsap.from(split.chars, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%'
    },
    opacity: 0,
    y: 50,
    stagger: 0.05,
    duration: 0.8
  });
}

// Wave text animation
function waveText(selector) {
  const split = new SplitText(selector, { type: 'chars' });
  
  gsap.from(split.chars, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%'
    },
    y: (i) => Math.sin(i * 0.5) * 50,
    opacity: 0,
    stagger: 0.03,
    duration: 1
  });
}

// ============================================
// 5. BATCH ANIMATIONS
// ============================================

// Animate multiple elements as they enter
function batchAnimation(selector) {
  ScrollTrigger.batch(selector, {
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 1
    }),
    start: 'top 80%',
    once: true
  });
  
  // Set initial state
  gsap.set(selector, { opacity: 0, y: 50 });
}

// Batch with different animations
function batchVaried(selector) {
  ScrollTrigger.batch(selector, {
    onEnter: batch => {
      batch.forEach((elem, i) => {
        gsap.to(elem, {
          opacity: 1,
          x: 0,
          rotation: 0,
          delay: i * 0.1,
          duration: 1
        });
      });
    },
    start: 'top 80%'
  });
  
  gsap.set(selector, { opacity: 0, x: -100, rotation: -15 });
}

// ============================================
// 6. PARALLAX EFFECTS (with ScrollSmoother)
// ============================================

// Add parallax to element
function addParallax(element, speed = 0.8) {
  element.setAttribute('data-speed', speed);
  // ScrollSmoother will automatically handle it
}

// Custom parallax with lag
function customParallax(element, speed = 1, lag = 0.3) {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.effects(element, { speed, lag });
  }
}

// ============================================
// 7. ADVANCED ANIMATIONS
// ============================================

// Reveal with mask
function maskReveal(selector) {
  gsap.from(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    clipPath: 'inset(0 100% 0 0)',
    duration: 1.5,
    ease: 'power2.out'
  });
}

// Counter animation
function counterAnimation(selector, endValue) {
  const obj = { value: 0 };
  const element = document.querySelector(selector);
  
  gsap.to(obj, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    value: endValue,
    duration: 2,
    ease: 'power1.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value);
    }
  });
}

// Morphing path (SVG)
function morphPath(selector, newPath) {
  gsap.to(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      scrub: 1
    },
    attr: { d: newPath },
    duration: 1
  });
}

// Parallax layers
function parallaxLayers(containerSelector) {
  const container = document.querySelector(containerSelector);
  const layers = container.querySelectorAll('[data-layer]');
  
  layers.forEach(layer => {
    const depth = layer.dataset.layer || 1;
    const speed = 1 - (depth * 0.2);
    layer.setAttribute('data-speed', speed);
  });
}

// ============================================
// 8. USAGE EXAMPLES IN YOUR HTML
// ============================================

/*

<!-- Example 1: Fade in on scroll -->
<div class="fade-in">Content here</div>

<script>
fadeInOnScroll('.fade-in');
</script>


<!-- Example 2: Batch animation for cards -->
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div class="card">Card 3</div>

<script>
batchAnimation('.card');
</script>


<!-- Example 3: Pin section -->
<section class="sticky-section">
  <h2>This section will pin</h2>
</section>

<script>
pinSection('.sticky-section', 800);
</script>


<!-- Example 4: Text reveal -->
<h1 class="reveal-text">Amazing Title</h1>

<script>
staggerTextReveal('.reveal-text');
</script>


<!-- Example 5: Parallax layers -->
<div class="parallax-container">
  <div data-layer="1">Background</div>
  <div data-layer="2">Middle</div>
  <div data-layer="3">Foreground</div>
</div>

<script>
parallaxLayers('.parallax-container');
</script>

*/

// ============================================
// 9. HELPER FUNCTIONS
// ============================================

// Refresh ScrollTrigger (call after DOM changes)
function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

// Kill all ScrollTriggers
function killAllTriggers() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

// Get ScrollSmoother instance
function getSmoother() {
  return ScrollSmoother.get();
}

// Smooth scroll to element
function scrollToElement(selector, duration = 1) {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(selector, true, `top ${duration}s`);
  }
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

// ============================================
// 10. RESPONSIVE ANIMATIONS
// ============================================

// Different animations for mobile/desktop
function responsiveAnimation(selector) {
  const isMobile = window.innerWidth < 768;
  
  gsap.from(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%'
    },
    x: isMobile ? 0 : 100,
    y: isMobile ? 50 : 0,
    opacity: 0,
    duration: 1
  });
}

// Disable animations on mobile
function desktopOnly(selector, animationFunction) {
  if (window.innerWidth > 768) {
    animationFunction(selector);
  }
}

// ============================================
// EXPORT FOR USE (if using modules)
// ============================================

// Uncomment if using ES6 modules
/*
export {
  fadeInOnScroll,
  slideInLeft,
  slideInRight,
  scaleUp,
  rotateOnScroll,
  pinSection,
  staggerTextReveal,
  batchAnimation,
  maskReveal,
  counterAnimation,
  scrollToElement,
  refreshScrollTrigger
};
*/



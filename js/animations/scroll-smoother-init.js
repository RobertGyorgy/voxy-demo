/* ================================
   SCROLL SMOOTHER INITIALIZATION
   ================================
   Initialize GSAP ScrollSmoother with configuration
*/

function initScrollSmoother() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = Helpers.prefersReducedMotion();
  
  // Get config
  const config = GSAP_CONFIG.scrollSmoother;
  
  // Create ScrollSmoother instance
  const smoother = ScrollSmoother.create({
    wrapper: "#wrapper",
    content: "#content",
    smooth: prefersReducedMotion ? 0 : config.smooth,
    normalizeScroll: config.normalizeScroll,
    ignoreMobileResize: config.ignoreMobileResize,
    effects: prefersReducedMotion ? false : config.effects,
    preventDefault: config.preventDefault,
    smoothTouch: config.smoothTouch
  });

  Helpers.log('ScrollSmoother initialized', 'success');
  Helpers.log(`Reduced motion: ${prefersReducedMotion}`, 'info');

  return smoother;
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initScrollSmoother };
}



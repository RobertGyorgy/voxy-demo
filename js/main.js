/* ================================
   MAIN INITIALIZATION
   ================================
   Main entry point for all GSAP animations
*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Apply GSAP global configuration
  gsap.config(GSAP_CONFIG.gsap);
  
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  // Initialize browser fixes
  BrowserFixes.init();

  // Initialize ScrollSmoother
  const smoother = initScrollSmoother();

  // Initialize heading animation
  initHeadingAnimation();

  // Initialize text effects
  initTextEffects(smoother);

  // Initialize VOXY clone effects
  initVoxyTextEffects(smoother);

  // Initialize waveform background for horizontal section
  initWaveformBackground();

  // Initialize horizontal scroll (with small delay to ensure ScrollSmoother is ready)
  setTimeout(() => {
    initHorizontalScroll(smoother);
  }, 100);

  // Initialize zoom animation
  initZoomAnimation();

  // Initialize contact popup
  initContactPopup();

  // Refresh ScrollTrigger after initial setup
  ScrollTrigger.refresh();

  Helpers.log('All animations initialized successfully! 🎉', 'success');
});


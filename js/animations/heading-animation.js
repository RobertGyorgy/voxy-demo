/* ================================
   HEADING ANIMATION
   ================================
   Initial heading reveal animation
*/

function initHeadingAnimation() {
  const prefersReducedMotion = Helpers.prefersReducedMotion();
  const isMobile = Helpers.getViewportWidth() <= 768;
  
  if (prefersReducedMotion) {
    // Just show the heading without animation
    gsap.set(".heading", { yPercent: 0, opacity: 1 });
    Helpers.log('Heading animation skipped (reduced motion)', 'info');
  } else if (isMobile) {
    // Mobile: Ensure heading is visible with less dramatic animation
    gsap.set(".heading", {
      yPercent: -50,
      opacity: 1
    });
    Helpers.log('Mobile heading animation initialized', 'success');
  } else {
    // Desktop: Full animation
    gsap.set(".heading", {
      yPercent: -150,
      opacity: 1
    });
    Helpers.log('Desktop heading animation initialized', 'success');
  }
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initHeadingAnimation };
}



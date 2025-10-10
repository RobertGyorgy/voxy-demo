/* ================================
   ZOOM ANIMATION
   ================================
   Zoom-in effect on scroll
*/

function initZoomAnimation() {
  const prefersReducedMotion = Helpers.prefersReducedMotion();
  
  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) {
    Helpers.log('Zoom animation skipped (reduced motion)', 'info');
    return;
  }

  // Check if zoom elements exist
  const zoomContainer = document.querySelector('.zoom-container');
  const zoomCircle = document.querySelector('.zoom-circle');
  const zoomContent = document.querySelector('.zoom-content');
  
  if (!zoomContainer || !zoomCircle || !zoomContent) {
    Helpers.log('Zoom elements not found', 'warning');
    return;
  }

  // Detect mobile mode
  const mobileMode = Helpers.getViewportWidth() <= 768;

  // ZOOM IN - Circle fills entire section
  if (!mobileMode) {
    // Desktop: Large scale to fill viewport
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".zoom-container",
        scrub: 1,
        start: "top top",
        end: "bottom bottom",
        pin: ".zoom",
        markers: GSAP_CONFIG.debug.showMarkers
      }
    });

    timeline
      .to(".zoom-circle", {
        scale: 25, // Increased scale to fill entire viewport
        ease: "power2.out"
      })
      .to(".zoom-content", {
        scale: 1,
        opacity: 1,
        ease: "power2.out"
      }, 0.3); // Slight delay for content appearance

    Helpers.log('Desktop zoom animation initialized', 'success');
  } else {
    // Mobile: Moderate scale to fill mobile viewport
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".zoom-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        markers: GSAP_CONFIG.debug.showMarkers
      }
    });

    timeline
      .to(".zoom-circle", {
        scale: 12, // Increased mobile scale
        ease: "power2.out"
      })
      .to(".zoom-content", {
        scale: 1,
        opacity: 1,
        ease: "power2.out"
      }, 0.3);

    Helpers.log('Mobile zoom animation initialized', 'success');
  }
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initZoomAnimation };
}


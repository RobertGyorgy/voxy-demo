/* ================================
   VOXY TEXT EFFECTS
   ================================
   Clone/layered text effect on scroll
*/

function initVoxyTextEffects(smoother) {
  const prefersReducedMotion = Helpers.prefersReducedMotion();
  const isMobile = Helpers.getViewportWidth() <= 768;
  
  // Skip if reduced motion
  if (prefersReducedMotion) {
    Helpers.log('VOXY text effects skipped (reduced motion)', 'info');
    return;
  }

  // Get all VOXY text elements
  const voxyTexts = document.querySelectorAll('.text-container p');
  
  if (voxyTexts.length === 0) {
    Helpers.log('VOXY text elements not found', 'warning');
    return;
  }

  // Mobile: Disable clone effect to prevent glitching - just show base text
  if (isMobile) {
    // Hide all clone layers on mobile, keep only the first one visible
    voxyTexts.forEach((text, index) => {
      if (index > 0) {
        gsap.set(text, {
          opacity: 0,
          display: 'none'
        });
      }
    });
    Helpers.log('VOXY clone effect disabled on mobile (prevents glitching)', 'info');
    return;
  }

  // Desktop: Full clone effect with smooth animation
  const desktopSettings = {
    start: "top 80%",
    end: "top 20%",
    yOffset: -20,
    scrub: 1
  };

  // Animate each layer - ALL LAYERS (Desktop only)
  voxyTexts.forEach((text, index) => {
    if (index === 0) return; // Skip the first one (it's already visible)
    
    // Set initial state
    gsap.set(text, {
      opacity: 0,
      y: 0,
      zIndex: 999 - index, // Ensure proper stacking order
      willChange: 'transform, opacity' // Performance hint
    });

    // Desktop: All layers animate together
    gsap.to(text, {
      scrollTrigger: {
        trigger: ".heading",
        start: desktopSettings.start,
        end: desktopSettings.end,
        scrub: desktopSettings.scrub,
        markers: GSAP_CONFIG.debug.showMarkers,
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: desktopSettings.yOffset,
      ease: "power2.out",
      onComplete: () => {
        text.style.willChange = 'auto'; // Remove performance hint after animation
      }
    });
  });

  Helpers.log('VOXY clone effect initialized (desktop only)', 'success');
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initVoxyTextEffects };
}

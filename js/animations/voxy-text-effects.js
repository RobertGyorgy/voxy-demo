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

  // Mobile-specific animation settings
  const mobileSettings = {
    start: "top 90%",
    end: "top 30%",
    yOffset: -10,
    scrub: 0.5
  };

  const desktopSettings = {
    start: "top 80%",
    end: "top 20%",
    yOffset: -20,
    scrub: 1
  };

  const settings = isMobile ? mobileSettings : desktopSettings;

  // Animate each layer with different delays - ALL LAYERS
  voxyTexts.forEach((text, index) => {
    if (index === 0) return; // Skip the first one (it's already visible)
    
    // Set initial state
    gsap.set(text, {
      opacity: 0,
      y: 0,
      zIndex: 999 - index // Ensure proper stacking order
    });

    // Mobile: Simple animation without delays to prevent glitch
    if (isMobile) {
      gsap.to(text, {
        scrollTrigger: {
          trigger: ".heading",
          start: settings.start,
          end: settings.end,
          scrub: settings.scrub,
          markers: GSAP_CONFIG.debug.showMarkers,
          toggleActions: "play none none reverse" // Allow reverse on mobile
        },
        opacity: 1,
        y: settings.yOffset,
        ease: "power1.out"
      });
    } else {
      // Desktop: All layers animate together
      gsap.to(text, {
        scrollTrigger: {
          trigger: ".heading",
          start: settings.start,
          end: settings.end,
          scrub: settings.scrub,
          markers: GSAP_CONFIG.debug.showMarkers,
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: settings.yOffset,
        ease: "power2.out"
      });
    }
  });

  Helpers.log(`VOXY clone effect initialized (${isMobile ? 'mobile' : 'desktop'}) - all layers`, 'success');
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initVoxyTextEffects };
}

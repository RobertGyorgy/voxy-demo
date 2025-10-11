/* ================================
   ZOOM ANIMATION
   ================================
   Zoom-in effect on scroll
*/

function initZoomAnimation() {
  console.log('initZoomAnimation called');
  
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
        pinSpacing: true, // Add spacing - needed for animation to work
        anticipatePin: 1,
        markers: true, // Temporarily enable for debugging
        onEnter: () => {
          console.log('Zoom animation started (desktop)');
        },
        onLeave: () => {
          console.log('Zoom animation ended (desktop)');
        },
        onUpdate: (self) => {
          console.log('Zoom progress:', self.progress);
        }
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
    // Mobile: Larger scale and faster growth
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".zoom-container",
        start: "top top", // Start when section hits top
        end: "bottom bottom",
        scrub: 0.5, // Faster scrub for quicker animation (was 1)
        pin: ".zoom", // Pin the zoom element (same as desktop)
        pinSpacing: true, // Add spacing for proper scroll lock
        anticipatePin: 1,
        markers: true, // Temporarily enable for debugging
        onEnter: () => {
          console.log('Zoom animation started (mobile)');
        },
        onLeave: () => {
          console.log('Zoom animation ended (mobile)');
        },
        onEnterBack: () => {
          console.log('Zoom animation re-entered (mobile)');
        },
        onLeaveBack: () => {
          console.log('Zoom animation left (mobile)');
        },
        onUpdate: (self) => {
          console.log('Zoom progress (mobile):', self.progress);
        }
      }
    });

    timeline
      .to(".zoom-circle", {
        scale: 18, // Much larger mobile scale (was 12)
        ease: "power1.out" // Faster easing for quicker growth
      })
      .to(".zoom-content", {
        scale: 1,
        opacity: 1,
        ease: "power1.out" // Faster easing to match circle
      }, 0.2); // Earlier content appearance (was 0.3)

    Helpers.log('Mobile zoom animation initialized', 'success');
  }
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initZoomAnimation };
}


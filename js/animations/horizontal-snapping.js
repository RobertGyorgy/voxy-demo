/**
 * Horizontal Scroll Animation
 * Works on both desktop and mobile with ScrollSmoother
 */

console.log('Horizontal scroll script loaded');

function initHorizontalScroll(smoother) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    Helpers.log('GSAP or ScrollTrigger not available for horizontal scroll', 'warning');
    return;
  }

  const horizontalContainer = document.querySelector(".horizontal-scroller");
  const horizontalWrapper = document.querySelector(".horizontal-wrapper");
  
  if (!horizontalContainer || !horizontalWrapper) {
    Helpers.log('Horizontal scroll elements not found', 'warning');
    return;
  }

  // Check if mobile mode
  const isMobile = Helpers.getViewportWidth() <= 768;
  
  // Calculate scroll width - use the actual content width
  const containerWidth = horizontalContainer.scrollWidth;
  const scrollWidth = containerWidth - window.innerWidth;
  
  // Calculate the scroll distance needed to see all cards
  // Make the scroll distance match the actual horizontal movement needed
  // Each card should get enough scroll space to be fully visible
  const numberOfCards = document.querySelectorAll('.horizontal-item').length;
  const cardWidth = 400; // Card width from CSS
  const cardGap = 32; // Gap between cards (2rem = 32px)
  const totalCardWidth = (cardWidth + cardGap) * numberOfCards - cardGap; // Total width of all cards
  const viewportWidth = window.innerWidth;
  const horizontalScrollDistance = totalCardWidth - viewportWidth; // Actual horizontal distance
  const totalScrollDistance = horizontalScrollDistance * 1.2; // Add 20% buffer for controlled scroll
  
  Helpers.log(`Horizontal scroll debug: cards=${numberOfCards}, cardWidth=${cardWidth}px, totalCardWidth=${totalCardWidth}px, horizontalDistance=${horizontalScrollDistance}px, totalScrollDistance=${totalScrollDistance}px`, 'info');
  
  if (scrollWidth > 0) {
    // Both mobile and desktop: Horizontal scroll with pinning (locks vertical scroll)
    gsap.to(horizontalContainer, {
      x: () => -scrollWidth,
      scrollTrigger: {
        markers: GSAP_CONFIG.debug.showMarkers,
        trigger: '.horizontal-section',
        start: 'top top',
        end: () => "+=" + totalScrollDistance,
        scrub: 1,
        pin: '.horizontal-section',
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    
    Helpers.log(`Horizontal scroll with pinning initialized (scroll: ${scrollWidth}px, total: ${totalScrollDistance}px)`, 'success');
  } else {
    Helpers.log('Horizontal scroll not needed - content fits viewport', 'info');
  }
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = initHorizontalScroll;
}

console.log('initHorizontalScroll function defined');
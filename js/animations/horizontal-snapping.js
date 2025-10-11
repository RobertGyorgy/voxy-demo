/**
 * Horizontal Scroll Animation
 * Works on both desktop and mobile with ScrollSmoother
 */

console.log('Horizontal scroll script loaded');

function initHorizontalScroll(smoother) {
  console.log('initHorizontalScroll called with smoother:', !!smoother);
  
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    Helpers.log('GSAP or ScrollTrigger not available for horizontal scroll', 'warning');
    console.log('GSAP available:', typeof gsap !== 'undefined');
    console.log('ScrollTrigger available:', typeof ScrollTrigger !== 'undefined');
    return;
  }

  const horizontalContainer = document.querySelector(".horizontal-scroller");
  const horizontalWrapper = document.querySelector(".horizontal-wrapper");
  
  if (!horizontalContainer || !horizontalWrapper) {
    Helpers.log('Horizontal scroll elements not found', 'warning');
    console.log('horizontalContainer found:', !!horizontalContainer);
    console.log('horizontalWrapper found:', !!horizontalWrapper);
    return;
  }

  // Check if mobile mode
  const isMobile = Helpers.getViewportWidth() <= 768;
  
  // Calculate scroll width - use the actual content width
  const containerWidth = horizontalContainer.scrollWidth;
  const scrollWidth = containerWidth - window.innerWidth;
  
  // Calculate the scroll distance needed to see all cards
  // Use actual rendered card width instead of hardcoded values
  const cards = document.querySelectorAll('.horizontal-item');
  const numberOfCards = cards.length;
  
  // Get the actual rendered width of the first card (accounts for all CSS breakpoints)
  const firstCard = cards[0];
  const actualCardWidth = firstCard ? firstCard.offsetWidth : (isMobile ? 280 : 400);
  
  const cardGap = 32; // Gap between cards (2rem = 32px)
  const totalCardWidth = (actualCardWidth + cardGap) * numberOfCards - cardGap; // Total width of all cards
  const viewportWidth = window.innerWidth;
  const horizontalScrollDistance = totalCardWidth - viewportWidth; // Actual horizontal distance
  
  // Same calculation for both mobile and desktop - scroll until last card is visible
  const totalScrollDistance = horizontalScrollDistance * 0.95; // 95% of exact distance for perfect stopping point
  
  Helpers.log(`Horizontal scroll debug: cards=${numberOfCards}, actualCardWidth=${actualCardWidth}px, totalCardWidth=${totalCardWidth}px, horizontalDistance=${horizontalScrollDistance}px, totalScrollDistance=${totalScrollDistance}px`, 'info');
  
  if (scrollWidth > 0) {
    // Both mobile and desktop: Horizontal scroll with pinning (locks vertical scroll)
    gsap.to(horizontalContainer, {
      x: () => -horizontalScrollDistance,
      scrollTrigger: {
        markers: GSAP_CONFIG.debug.showMarkers,
        trigger: '.horizontal-section',
        start: 'top top',
        end: () => "+=" + totalScrollDistance,
        scrub: isMobile ? 1 : 1, // Same scrub speed for mobile and desktop
        pin: '.horizontal-section',
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          console.log('Horizontal scroll started');
          document.body.style.overflow = 'hidden'; // Force lock on mobile
          // Show start indicator
          const startIndicator = document.querySelector('.scroll-indicator.start');
          if (startIndicator) startIndicator.classList.add('show');
        },
        onLeave: () => {
          console.log('Horizontal scroll ended');
          document.body.style.overflow = ''; // Restore scroll
          // Hide all indicators
          document.querySelectorAll('.scroll-indicator').forEach(indicator => {
            indicator.classList.remove('show');
          });
        },
        onEnterBack: () => {
          console.log('Horizontal scroll re-entered');
          document.body.style.overflow = 'hidden'; // Force lock on mobile
          // Show end indicator when coming back
          const endIndicator = document.querySelector('.scroll-indicator.end');
          if (endIndicator) endIndicator.classList.add('show');
        },
        onLeaveBack: () => {
          console.log('Horizontal scroll left');
          document.body.style.overflow = ''; // Restore scroll
          // Hide all indicators
          document.querySelectorAll('.scroll-indicator').forEach(indicator => {
            indicator.classList.remove('show');
          });
        },
        onUpdate: (self) => {
          // Show end indicator when scroll is almost complete
          const progress = self.progress;
          const endIndicator = document.querySelector('.scroll-indicator.end');
          const startIndicator = document.querySelector('.scroll-indicator.start');
          
          if (progress > 0.8) {
            if (endIndicator) endIndicator.classList.add('show');
            if (startIndicator) startIndicator.classList.remove('show');
          } else if (progress > 0.1) {
            if (startIndicator) startIndicator.classList.remove('show');
          }
        }
      }
    });
    
    Helpers.log(`Horizontal scroll with pinning initialized (scroll: ${scrollWidth}px, total: ${totalScrollDistance}px, mobile: ${isMobile})`, 'success');
  } else {
    Helpers.log('Horizontal scroll not needed - content fits viewport', 'info');
  }
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = initHorizontalScroll;
}

console.log('initHorizontalScroll function defined');
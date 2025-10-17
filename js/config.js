/* ================================
   GSAP CONFIGURATION
   ================================
   Centralized configuration for GSAP and ScrollSmoother
   Modify these values to customize scroll behavior
*/

const GSAP_CONFIG = {
  // ScrollSmoother Settings
  scrollSmoother: {
    smooth: 1,                    // Smoothness (0 = off, 1 = normal, 2 = very smooth)
    normalizeScroll: true,        // Prevents mobile browser chrome issues
    ignoreMobileResize: true,     // Prevents refresh on address bar show/hide
    effects: true,                // Enable data-speed and data-lag attributes
    preventDefault: true,         // Better touch handling
    smoothTouch: 0                // Smooth scrolling on touch (0 = off, 0.1-1 = on)
  },

  // Animation Settings
  animations: {
    enableTextSplit: true,        // Enable SplitText animations
    enableBarColors: true,        // Enable colored bars with dynamic heights
    staggerDelay: 0.1,           // Delay between stagger animations (seconds)
    textLagMultiplier: 0.1       // Multiplier for text lag effect
  },

  // Accessibility
  accessibility: {
    respectReducedMotion: true   // Disable animations for users who prefer reduced motion
  },

  // Debug Mode
  debug: {
    enabled: true,               // Show console logs
    showMarkers: false           // Show ScrollTrigger markers
  },

  // GSAP Global Settings
  gsap: {
    trialWarn: false             // Disable trial version warning (for localhost development)
  }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GSAP_CONFIG;
}

// ================================
//   VOXY VOICE AI CONFIGURATION
// ================================

// VOXY Voice AI Configuration
const VOXY_CONFIG = {
  // API Key - SECURE: Loaded from server environment or user input
  apiKey: '', // Will be loaded at runtime
  
  // Voice settings
  voice: 'ballad', // Masculine, deep voice
};

// Make VOXY_CONFIG globally available
if (typeof window !== 'undefined') {
  window.VOXY_CONFIG = VOXY_CONFIG;
}



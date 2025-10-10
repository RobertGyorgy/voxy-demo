/* ================================
   UTILITY HELPERS
   ================================
   Reusable utility functions
*/

const Helpers = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Detect if device is mobile
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * Detect if device is iOS
   */
  isIOS() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  },

  /**
   * Get viewport width
   */
  getViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  },

  /**
   * Get viewport height
   */
  getViewportHeight() {
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  },

  /**
   * Debounce function
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Log message if debug mode is enabled
   */
  log(message, type = 'info') {
    if (GSAP_CONFIG.debug.enabled) {
      const emoji = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
      };
      console.log(`${emoji[type] || 'ℹ️'} ${message}`);
    }
  },

  /**
   * Refresh ScrollTrigger
   */
  refreshScrollTrigger() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
      this.log('ScrollTrigger refreshed', 'success');
    }
  },

  /**
   * Get ScrollSmoother instance
   */
  getSmoother() {
    if (typeof ScrollSmoother !== 'undefined') {
      return ScrollSmoother.get();
    }
    return null;
  }
};

// Export helpers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Helpers;
}



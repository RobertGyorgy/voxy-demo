/* ================================
   BROWSER-SPECIFIC FIXES
   ================================
   Fixes for Safari iOS and other browsers
*/

const BrowserFixes = {
  /**
   * Safari iOS bounce prevention
   */
  iosScrollFix() {
    if (Helpers.isIOS()) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Re-enable after ScrollSmoother initializes
      setTimeout(() => {
        document.body.style.position = '';
        document.body.style.width = '';
      }, 100);

      Helpers.log('iOS scroll fix applied', 'success');
    }
  },

  /**
   * Handle window resize with debounce
   */
  initResizeHandler() {
    const debouncedRefresh = Helpers.debounce(() => {
      Helpers.refreshScrollTrigger();
    }, 250);

    window.addEventListener('resize', debouncedRefresh);
    Helpers.log('Resize handler initialized', 'success');
  },

  /**
   * Error handling for GSAP plugins
   */
  initErrorHandling() {
    window.addEventListener('error', function(e) {
      if (e.message.includes('ScrollSmoother') || e.message.includes('SplitText')) {
        console.warn('⚠️ GSAP premium plugin not loaded. Some animations may not work.');
        console.info('ℹ️ To use ScrollSmoother and SplitText, you need a Club GreenSock membership or trial.');
      }
    });
  },

  /**
   * Initialize all browser fixes
   */
  init() {
    this.iosScrollFix();
    this.initResizeHandler();
    this.initErrorHandling();
    Helpers.log('Browser fixes initialized', 'success');
  }
};

// Export browser fixes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrowserFixes;
}



/* ================================
   TEXT EFFECTS
   ================================
   Text splitting and stagger animations
*/

function initTextEffects(smoother) {
  const prefersReducedMotion = Helpers.prefersReducedMotion();
  const config = GSAP_CONFIG.animations;

  // Skip if reduced motion or text split disabled
  if (prefersReducedMotion || !config.enableTextSplit) {
    Helpers.log('Text effects skipped', 'info');
    return;
  }

  // Check if SplitText is available
  if (typeof SplitText === 'undefined') {
    Helpers.log('SplitText plugin not available', 'warning');
    return;
  }

  const splitStaggerElement = document.getElementById('split-stagger');
  
  if (splitStaggerElement) {
    const mySplitText = new SplitText("#split-stagger", { type: "words,chars" });
    const chars = mySplitText.chars;

    chars.forEach((char, i) => {
      smoother.effects(char, { 
        speed: 1, 
        lag: (i + 1) * config.textLagMultiplier 
      });
    });

    Helpers.log('Text stagger effect initialized', 'success');
  }
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initTextEffects };
}



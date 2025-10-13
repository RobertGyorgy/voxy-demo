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
  
  // API endpoint - Will use proxy for secure connection
  apiUrl: 'wss://api.openai.com/v1/realtime'
};

// Load API key securely
async function loadVoxyApiKey() {
  console.log('🔍 Loading API key...');
  
  // Try to load from Vercel environment variable via API
  try {
    const response = await fetch('/api/voxy-proxy?action=get-api-key');
    if (response.ok) {
      const data = await response.json();
      if (data.apiKey && data.apiKey.startsWith('sk-')) {
        VOXY_CONFIG.apiKey = data.apiKey;
        console.log('✅ API key loaded from Vercel environment:', data.apiKey.substring(0, 20) + '...');
        return;
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not load API key from server:', error.message);
  }
  
  // Fallback: Check localStorage
  const storedKey = localStorage.getItem('voxy_api_key');
  
  if (storedKey && storedKey.trim().startsWith('sk-')) {
    VOXY_CONFIG.apiKey = storedKey.trim();
    console.log('✅ API key loaded from localStorage:', storedKey.substring(0, 20) + '...');
    return;
  }
  
  // Last resort: prompt user (development only)
  console.warn('⚠️ No API key found, prompting user...');
  const apiKey = prompt(
    '🔑 Pentru demo-ul Voxy, introduceți OpenAI API Key:\n\n' +
    '(Obțineți de la: https://platform.openai.com/api-keys)\n\n' +
    'În producție, acest pas nu va fi necesar!'
  );
  
  if (apiKey && apiKey.trim().startsWith('sk-')) {
    const trimmedKey = apiKey.trim();
    localStorage.setItem('voxy_api_key', trimmedKey);
    VOXY_CONFIG.apiKey = trimmedKey;
    console.log('✅ API key saved and loaded:', trimmedKey.substring(0, 20) + '...');
  } else {
    console.error('❌ No valid API key provided');
  }
}

// Make VOXY_CONFIG globally available and load API key automatically
if (typeof window !== 'undefined') {
  window.VOXY_CONFIG = VOXY_CONFIG;
  window.loadVoxyApiKey = loadVoxyApiKey;
  
  // Auto-load API key when page loads
  loadVoxyApiKey().catch(error => {
    console.error('❌ Failed to load API key:', error);
  });
}



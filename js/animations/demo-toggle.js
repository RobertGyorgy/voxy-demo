/* ================================
   DEMO TOGGLE ANIMATION
   ================================
   Handles toggling between VOXY text and interactive demo circle
   Integrates with Voxy Voice AI for real voice interaction
*/

function initDemoToggle() {
  console.log('🎯 initDemoToggle called');
  
  const toggleBtn = document.getElementById('toggleDemoBtn');
  const demoContainer = document.getElementById('demoContainer');
  const demoCircle = document.getElementById('demoCircle');
  const stopBtn = document.getElementById('stopConversationBtn');
  
  console.log('🔍 Elements found:', {
    toggleBtn: !!toggleBtn,
    demoContainer: !!demoContainer,
    demoCircle: !!demoCircle,
    stopBtn: !!stopBtn
  });
  
  if (!toggleBtn || !demoContainer || !demoCircle || !stopBtn) {
    console.warn('❌ Demo toggle elements not found');
    return;
  }
  
  let isDemoActive = false;
  let voxyVoice = null;
  let isVoiceActive = false;
  let isFirstInteraction = true; // Track if this is the first click
  
  // API Key - Load from config or localStorage
  let VOXY_API_KEY = window.VOXY_CONFIG?.apiKey || localStorage.getItem('voxy_api_key') || '';
  const VOXY_VOICE = 'ballad'; // Fixed voice - masculine, deep
  
  // If no API key found, prompt user
  if (!VOXY_API_KEY) {
    console.warn('⚠️ No API key found in config or localStorage');
    const userKey = prompt('Vă rugăm introduceți OpenAI API Key pentru demo vocal:\n(Obțineți de la: https://platform.openai.com/api-keys)');
    if (userKey) {
      VOXY_API_KEY = userKey.trim();
      localStorage.setItem('voxy_api_key', VOXY_API_KEY);
      console.log('✅ API key saved to localStorage');
    }
  }
  
  // Toggle button click handler
  toggleBtn.addEventListener('click', async function(e) {
    console.log('🖱️ Button clicked!');
    e.preventDefault();
    
    isDemoActive = !isDemoActive;
    
    if (isDemoActive) {
      // Show demo circle
      demoContainer.classList.add('demo-active');
      toggleBtn.textContent = 'Încheie conversația';
      
      console.log('✅ Demo mode activated');
      
      // Initialize Voxy Voice
      if (!voxyVoice) {
        console.log('🎤 Initializing Voxy with voice:', VOXY_VOICE);
        console.log('🔑 API Key available:', !!VOXY_API_KEY);
        console.log('🔑 API Key starts with:', VOXY_API_KEY ? VOXY_API_KEY.substring(0, 20) + '...' : 'NONE');
        
        // Check if VoxyVoice class is available
        console.log('🔍 VoxyVoice class available:', typeof window.VoxyVoice);
        
        if (typeof window.VoxyVoice === 'undefined') {
          console.error('❌ VoxyVoice class not found! Check if voxy-voice.js is loaded');
          const content = demoCircle.querySelector('.demo-circle-text');
          content.textContent = 'Eroare: VoxyVoice nu este încărcat';
          return;
        }
        
        console.log('✅ Creating VoxyVoice instance...');
        voxyVoice = new VoxyVoice(VOXY_API_KEY, VOXY_VOICE);
        console.log('✅ VoxyVoice instance created:', !!voxyVoice);
        
        try {
          const content = demoCircle.querySelector('.demo-circle-text');
          content.textContent = 'Conectare...';
          
          console.log('🔄 Attempting to connect to OpenAI...');
          await voxyVoice.connect();
          
          content.textContent = 'Click pentru a începe';
          console.log('✅ Voxy Voice connected successfully');
          
        } catch (error) {
          console.error('❌ Failed to connect:', error);
          console.error('❌ Error details:', error.message, error.stack);
          const content = demoCircle.querySelector('.demo-circle-text');
          content.textContent = 'Eroare conexiune: ' + error.message;
        }
      }
    } else {
      // Show VOXY text
      demoContainer.classList.remove('demo-active');
      toggleBtn.textContent = 'Vezi demo-ul';
      
      // Disconnect and cleanup
      if (voxyVoice) {
        voxyVoice.disconnect();
        voxyVoice = null;
      }
      
      demoCircle.classList.remove('listening');
      isVoiceActive = false;
      isFirstInteraction = true; // Reset for next time
      stopBtn.style.display = 'none'; // Hide stop button
      console.log('✅ Demo mode deactivated');
    }
    
    // Refresh ScrollTrigger after layout change
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
  
  // Listen for voice activity events to update UI
  window.addEventListener('voxy-user-speaking', function() {
    if (!isVoiceActive) return;
    const content = demoCircle.querySelector('.demo-circle-text');
    content.textContent = 'Te ascult...';
    console.log('👂 UI updated: User speaking');
  });
  
  window.addEventListener('voxy-user-stopped', function() {
    if (!isVoiceActive) return;
    const content = demoCircle.querySelector('.demo-circle-text');
    content.textContent = 'Voxy gândește...';
    console.log('🧠 UI updated: Processing');
  });
  
  window.addEventListener('voxy-response-complete', function() {
    if (!isVoiceActive) return;
    const content = demoCircle.querySelector('.demo-circle-text');
    content.textContent = 'Conversație activă...';
    console.log('✅ UI updated: Ready for next input');
  });
  
  // Click handler: First click triggers AI greeting and starts continuous conversation
  demoCircle.addEventListener('click', async function(e) {
    if (!voxyVoice || !voxyVoice.isConnected) return;
    
    e.preventDefault();
    
    const content = demoCircle.querySelector('.demo-circle-text');
    
    // First click: Trigger AI greeting and start continuous listening
    if (isFirstInteraction) {
      console.log('🎤 First interaction - triggering AI greeting');
      
      content.textContent = 'Voxy vorbește...';
      demoCircle.classList.add('listening');
      
      // Trigger Voxy's greeting
      voxyVoice.triggerGreeting();
      
      isFirstInteraction = false;
      
      // After AI finishes greeting, start continuous listening
      setTimeout(async () => {
        console.log('🎤 Starting continuous listening mode');
        
        try {
          // For mobile, add a small delay and ensure user interaction
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          if (isMobile) {
            console.log('📱 Mobile detected - adding interaction delay');
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          await voxyVoice.startListening();
          content.textContent = 'Conversație activă...';
          isVoiceActive = true;
          stopBtn.style.display = 'block'; // Show stop button
          console.log('✅ Continuous listening started');
        } catch (error) {
          console.error('❌ Failed to start listening:', error);
          content.textContent = 'Permite microfon';
          demoCircle.classList.remove('listening');
          
          // Show more specific error message on mobile
          if (isMobile && error.message.includes('Permission denied')) {
            content.textContent = 'Click "Permite" în browser';
          }
        }
      }, 4000);
      
      return;
    }
    
    // After first interaction, clicks do nothing - conversation is continuous
    console.log('ℹ️ Conversation already active - use stop button to end');
  });
  
  // Stop conversation button handler
  stopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('🛑 Stop conversation clicked');
    
    if (voxyVoice && isVoiceActive) {
      voxyVoice.stopListening();
      isVoiceActive = false;
      isFirstInteraction = true; // Reset for next conversation
      
      const content = demoCircle.querySelector('.demo-circle-text');
      content.textContent = 'Click pentru a începe';
      
      demoCircle.classList.remove('listening');
      stopBtn.style.display = 'none'; // Hide stop button
      
      console.log('✅ Conversation stopped - ready to restart');
    }
  });
  
  console.log('✅ Demo toggle with Voxy Voice initialized');
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initDemoToggle };
}


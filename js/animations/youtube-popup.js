/* ================================
   YOUTUBE VIDEO POPUP
   ================================
   Handles YouTube video popup functionality
   Opens video in full-screen overlay when clicked
*/

function initYouTubePopup() {
  console.log('🎥 initYouTubePopup called');
  
  // Wait a bit for DOM to be fully ready
  setTimeout(() => {
    const videoContainer = document.getElementById('youtubeVideoContainer');
    const videoOverlay = document.getElementById('videoClickOverlay');
    const popupOverlay = document.getElementById('youtubePopup');
    const popupIframe = document.querySelector('.youtube-popup-iframe');
    const closeButton = document.getElementById('youtubePopupClose');
    
    console.log('🔍 Elements found:', {
      videoContainer: !!videoContainer,
      videoOverlay: !!videoOverlay,
      popupOverlay: !!popupOverlay,
      popupIframe: !!popupIframe,
      closeButton: !!closeButton
    });
    
    if (!videoContainer || !videoOverlay || !popupOverlay || !popupIframe || !closeButton) {
      console.warn('❌ YouTube popup elements not found, retrying...');
      // Retry after a longer delay
      setTimeout(initYouTubePopup, 500);
      return;
    }
    
    setupPopupEvents(videoOverlay, popupOverlay, popupIframe, closeButton);
  }, 100);
}

function setupPopupEvents(videoOverlay, popupOverlay, popupIframe, closeButton) {
  console.log('🔧 Setting up popup events');
  
  // Original video URL
  const originalVideoUrl = 'https://www.youtube.com/embed/D1bV9YiIEzU?si=w5g8oz8E81EZGrIb';
  const popupVideoUrl = 'https://www.youtube.com/embed/D1bV9YiIEzU?si=w5g8oz8E81EZGrIb&autoplay=1';
  
  // Click handler for video overlay
  videoOverlay.addEventListener('click', function(e) {
    console.log('🖱️ Video overlay clicked');
    e.preventDefault();
    e.stopPropagation();
    
    // Set popup iframe source with autoplay
    popupIframe.src = popupVideoUrl;
    
    // Show popup
    popupOverlay.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    console.log('✅ YouTube popup opened');
  });
  
  // Close button handler
  closeButton.addEventListener('click', function(e) {
    console.log('❌ Close button clicked');
    e.preventDefault();
    closePopup();
  });
  
  // Overlay click handler (click outside to close)
  popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
      console.log('❌ Overlay clicked - closing popup');
      e.preventDefault();
      closePopup();
    }
  });
  
  // ESC key handler
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
      console.log('⌨️ ESC key pressed - closing popup');
      e.preventDefault();
      closePopup();
    }
  });
  
  // Close popup function
  function closePopup() {
    // Hide popup
    popupOverlay.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear iframe source to stop video
    setTimeout(() => {
      popupIframe.src = '';
    }, 300); // Wait for animation to complete
    
    console.log('✅ YouTube popup closed');
  }
  
  console.log('✅ YouTube popup initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initYouTubePopup);
} else {
  initYouTubePopup();
}

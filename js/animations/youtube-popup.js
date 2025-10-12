/* ================================
   YOUTUBE VIDEO POPUP
   ================================
   Handles YouTube video popup functionality
   Opens video in full-screen overlay when clicked
*/

function initYouTubePopup() {
  console.log('🎥 initYouTubePopup called');
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupYouTubePopup, 200);
  });
  
  // Also try immediate setup if DOM is already ready
  if (document.readyState !== 'loading') {
    setTimeout(setupYouTubePopup, 200);
  }
}

function setupYouTubePopup() {
  console.log('🔧 Setting up YouTube popup');
  
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
    console.warn('❌ YouTube popup elements not found');
    return;
  }
  
  setupPopupEvents(videoOverlay, popupOverlay, popupIframe, closeButton);
}

function setupPopupEvents(videoOverlay, popupOverlay, popupIframe, closeButton) {
  console.log('🔧 Setting up popup events');
  
  // Original video URL
  const originalVideoUrl = 'https://www.youtube.com/embed/D1bV9YiIEzU?si=w5g8oz8E81EZGrIb';
  const popupVideoUrl = 'https://www.youtube.com/embed/D1bV9YiIEzU?si=w5g8oz8E81EZGrIb&autoplay=1';
  
  // Function to open popup
  function openPopup() {
    console.log('🎬 Opening popup');
    
    // Scroll to top to ensure popup is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Set popup iframe source with autoplay
    popupIframe.src = popupVideoUrl;
    
    // Show popup
    popupOverlay.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    console.log('✅ YouTube popup opened');
  }
  
  // Click handler for video overlay
  videoOverlay.addEventListener('click', function(e) {
    console.log('🖱️ Video overlay clicked');
    e.preventDefault();
    e.stopPropagation();
    openPopup();
  });
  
  // Backup click handler for video container
  const videoContainer = document.getElementById('youtubeVideoContainer');
  if (videoContainer) {
    videoContainer.addEventListener('click', function(e) {
      console.log('🖱️ Video container clicked (backup)');
      e.preventDefault();
      e.stopPropagation();
      openPopup();
    });
  }
  
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

// Initialize the popup
initYouTubePopup();

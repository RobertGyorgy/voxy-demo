/* ================================
   DEMO TOGGLE ANIMATION
   ================================
   Handles toggling between VOXY text and interactive demo circle
   Integrates with Voxy Voice AI for real voice interaction
*/

function initDemoToggle() {
  console.log('🎯 initDemoToggle called');
  
  const toggleBtn = document.getElementById('toggleDemoBtn');
  
  if (!toggleBtn) {
    console.warn('❌ Contact button not found');
    return;
  }
  
  // Contact button click handler
  toggleBtn.addEventListener('click', function(e) {
    console.log('🖱️ Contact button clicked!');
    e.preventDefault();
    
    // Scroll to contact section
    const contactSection = document.getElementById('contact') || document.querySelector('.contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll to bottom of page
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
  
  console.log('✅ Contact button initialized');
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initDemoToggle };
}


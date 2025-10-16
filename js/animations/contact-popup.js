/* ================================
   CONTACT POPUP FUNCTIONALITY
   ================================
   Handles contact popup with WhatsApp numbers
*/

function initContactPopup() {
  console.log('📞 Initializing contact popup...');
  
  const contactBtn = document.getElementById('contactBtn');
  const contactPopup = document.getElementById('contactPopup');
  const closeBtn = document.getElementById('closeContactPopup');
  
  console.log('🔍 Contact elements found:', {
    contactBtn: !!contactBtn,
    contactPopup: !!contactPopup,
    closeBtn: !!closeBtn
  });
  
  if (!contactBtn || !contactPopup || !closeBtn) {
    console.warn('❌ Contact popup elements not found');
    return;
  }
  
  // Open popup
  contactBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('📞 Opening contact popup');
    
    contactPopup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
  
  // Close popup
  function closePopup() {
    console.log('📞 Closing contact popup');
    contactPopup.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  closeBtn.addEventListener('click', closePopup);
  
  // Close popup when clicking outside
  contactPopup.addEventListener('click', function(e) {
    if (e.target === contactPopup) {
      closePopup();
    }
  });
  
  // Close popup with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && contactPopup.classList.contains('active')) {
      closePopup();
    }
  });
  
  console.log('✅ Contact popup initialized');
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initContactPopup };
}



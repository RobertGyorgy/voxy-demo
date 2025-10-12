/* ================================
   SONIC WAVEFORM BACKGROUND
   ================================
   Animated waveform canvas for horizontal section
*/

function initWaveformBackground() {
  const horizontalSection = document.querySelector('.horizontal-section');
  
  if (!horizontalSection) {
    console.warn('❌ Horizontal section not found for waveform background');
    return;
  }

  // Create canvas container
  const canvasContainer = document.createElement('div');
  canvasContainer.className = 'waveform-canvas-container';
  canvasContainer.style.cssText = 'position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; pointer-events: none;';
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'waveform-canvas';
  canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
  
  canvasContainer.appendChild(canvas);
  horizontalSection.insertBefore(canvasContainer, horizontalSection.firstChild);

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  const mouse = { x: 0, y: 0 };
  let time = 0;

  // Resize canvas to match container
  const resizeCanvas = () => {
    const rect = horizontalSection.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;
  };

  // Animation loop
  const draw = () => {
    // Fade effect for trailing
    ctx.fillStyle = 'rgba(237, 242, 254, 0.1)'; // Match section gradient color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lineCount = 50;
    const segmentCount = 80;
    const height = canvas.height / 2;
    
    for (let i = 0; i < lineCount; i++) {
      ctx.beginPath();
      const progress = i / lineCount;
      const colorIntensity = Math.sin(progress * Math.PI);
      
      // Teal/cyan color matching theme (increased opacity for visibility)
      ctx.strokeStyle = `rgba(100, 200, 255, ${colorIntensity * 0.4})`;
      ctx.lineWidth = 2.5;

      for (let j = 0; j < segmentCount + 1; j++) {
        const x = (j / segmentCount) * canvas.width;
        
        // Mouse influence
        const distToMouse = Math.hypot(x - mouse.x, height - mouse.y);
        const mouseEffect = Math.max(0, 1 - distToMouse / 300);

        // Wave calculation - smaller amplitude on mobile
        const isMobile = window.innerWidth <= 768;
        const noiseAmplitude = isMobile ? 40 : 80; // Half amplitude on mobile
        const spikeAmplitude = isMobile ? 100 : 200; // Half amplitude on mobile
        
        const noise = Math.sin(j * 0.08 + time + i * 0.15) * noiseAmplitude;
        const spike = Math.cos(j * 0.15 + time + i * 0.08) * Math.sin(j * 0.04 + time) * spikeAmplitude;
        const y = height + noise + spike * (1 + mouseEffect * 4);
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    time += 0.015;
    animationFrameId = requestAnimationFrame(draw);
  };

  // Mouse tracking
  const handleMouseMove = (event) => {
    const rect = horizontalSection.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  };

  // Setup event listeners
  window.addEventListener('resize', resizeCanvas);
  horizontalSection.addEventListener('mousemove', handleMouseMove);
  
  // Initialize
  resizeCanvas();
  draw();

  console.log('✅ Waveform background initialized');

  // Cleanup function (if needed)
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeCanvas);
    horizontalSection.removeEventListener('mousemove', handleMouseMove);
    if (canvasContainer.parentNode) {
      canvasContainer.parentNode.removeChild(canvasContainer);
    }
  };
}

// Export function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initWaveformBackground };
}


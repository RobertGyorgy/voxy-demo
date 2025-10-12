/* ================================
   THREADS BACKGROUND ANIMATION
   ================================
   WebGL animated background for horizontal scroll cards
   Converted from React to vanilla JS
*/

class ThreadsBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.color = options.color || [1, 1, 1];
    this.amplitude = options.amplitude !== undefined ? options.amplitude : 1;
    this.distance = options.distance !== undefined ? options.distance : 0;
    this.enableMouseInteraction = options.enableMouseInteraction !== undefined ? options.enableMouseInteraction : false;
    
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.animationFrameId = null;
    this.currentMouse = [0.5, 0.5];
    this.targetMouse = [0.5, 0.5];
    
    this.init();
  }
  
  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'threads-canvas';
    this.container.appendChild(this.canvas);
    
    // Get WebGL context
    this.gl = this.canvas.getContext('webgl', { 
      alpha: true, 
      antialias: false,
      premultipliedAlpha: false 
    });
    
    if (!this.gl) {
      console.warn('WebGL not supported, threads background disabled');
      return;
    }
    
    const gl = this.gl;
    
    // Setup WebGL
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Create shader program
    this.createProgram();
    
    // Setup geometry (fullscreen triangle)
    this.createGeometry();
    
    // Bind event listeners
    this.bindEvents();
    
    // Start animation
    this.resize();
    this.animate();
  }
  
  createProgram() {
    const gl = this.gl;
    
    const vertexShader = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    
    const fragmentShader = `
      precision highp float;
      
      uniform float iTime;
      uniform vec3 iResolution;
      uniform vec3 uColor;
      uniform float uAmplitude;
      uniform float uDistance;
      uniform vec2 uMouse;
      
      #define PI 3.1415926538
      
      const int u_line_count = 40;
      const float u_line_width = 7.0;
      const float u_line_blur = 10.0;
      
      float Perlin2D(vec2 P) {
        vec2 Pi = floor(P);
        vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
        vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
        Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
        Pt += vec2(26.0, 161.0).xyxy;
        Pt *= Pt;
        Pt = Pt.xzxz * Pt.yyww;
        vec4 hash_x = fract(Pt * (1.0 / 951.135664));
        vec4 hash_y = fract(Pt * (1.0 / 642.949883));
        vec4 grad_x = hash_x - 0.49999;
        vec4 grad_y = hash_y - 0.49999;
        vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
          * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
        grad_results *= 1.4142135623730950;
        vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
                   * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
        vec4 blend2 = vec4(blend, vec2(1.0 - blend));
        return dot(grad_results, blend2.zxzx * blend2.wwyy);
      }
      
      float pixel(float count, vec2 resolution) {
        return (1.0 / max(resolution.x, resolution.y)) * count;
      }
      
      float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
        float split_offset = (perc * 0.4);
        float split_point = 0.1 + split_offset;
        
        float amplitude_normal = smoothstep(split_point, 0.7, st.x);
        float amplitude_strength = 0.5;
        float finalAmplitude = amplitude_normal * amplitude_strength
                               * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);
        
        float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
        float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;
        
        float xnoise = mix(
          Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
          Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
          st.x * 0.3
        );
        
        float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;
        
        float line_start = smoothstep(
          y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
          y,
          st.y
        );
        
        float line_end = smoothstep(
          y,
          y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
          st.y
        );
        
        return clamp(
          (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
          0.0,
          1.0
        );
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        
        float line_strength = 1.0;
        for (int i = 0; i < u_line_count; i++) {
          float p = float(i) / float(u_line_count);
          line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
          ));
        }
        
        float colorVal = 1.0 - line_strength;
        gl_FragColor = vec4(uColor * colorVal, colorVal);
      }
    `;
    
    // Compile shaders
    const vs = this.compileShader(vertexShader, gl.VERTEX_SHADER);
    const fs = this.compileShader(fragmentShader, gl.FRAGMENT_SHADER);
    
    // Create program
    this.program = gl.createProgram();
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(this.program));
      return;
    }
    
    gl.useProgram(this.program);
    
    // Get uniform locations
    this.uniforms = {
      iTime: gl.getUniformLocation(this.program, 'iTime'),
      iResolution: gl.getUniformLocation(this.program, 'iResolution'),
      uColor: gl.getUniformLocation(this.program, 'uColor'),
      uAmplitude: gl.getUniformLocation(this.program, 'uAmplitude'),
      uDistance: gl.getUniformLocation(this.program, 'uDistance'),
      uMouse: gl.getUniformLocation(this.program, 'uMouse')
    };
    
    // Set initial uniform values
    gl.uniform3f(this.uniforms.uColor, ...this.color);
    gl.uniform1f(this.uniforms.uAmplitude, this.amplitude);
    gl.uniform1f(this.uniforms.uDistance, this.distance);
    gl.uniform2f(this.uniforms.uMouse, 0.5, 0.5);
  }
  
  compileShader(source, type) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  createGeometry() {
    const gl = this.gl;
    
    // Fullscreen triangle
    const vertices = new Float32Array([
      -1, -1,
       3, -1,
      -1,  3
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const positionLoc = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  }
  
  bindEvents() {
    this.resizeHandler = () => this.resize();
    window.addEventListener('resize', this.resizeHandler);
    
    if (this.enableMouseInteraction) {
      this.mouseMoveHandler = (e) => this.handleMouseMove(e);
      this.mouseLeaveHandler = () => this.handleMouseLeave();
      this.container.addEventListener('mousemove', this.mouseMoveHandler);
      this.container.addEventListener('mouseleave', this.mouseLeaveHandler);
    }
  }
  
  handleMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    this.targetMouse = [x, y];
  }
  
  handleMouseLeave() {
    this.targetMouse = [0.5, 0.5];
  }
  
  resize() {
    const { clientWidth, clientHeight } = this.container;
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = clientWidth * dpr;
    this.canvas.height = clientHeight * dpr;
    this.canvas.style.width = `${clientWidth}px`;
    this.canvas.style.height = `${clientHeight}px`;
    
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform3f(
      this.uniforms.iResolution,
      this.canvas.width,
      this.canvas.height,
      this.canvas.width / this.canvas.height
    );
  }
  
  animate(time = 0) {
    const gl = this.gl;
    
    if (this.enableMouseInteraction) {
      const smoothing = 0.05;
      this.currentMouse[0] += smoothing * (this.targetMouse[0] - this.currentMouse[0]);
      this.currentMouse[1] += smoothing * (this.targetMouse[1] - this.currentMouse[1]);
      gl.uniform2f(this.uniforms.uMouse, this.currentMouse[0], this.currentMouse[1]);
    } else {
      gl.uniform2f(this.uniforms.uMouse, 0.5, 0.5);
    }
    
    gl.uniform1f(this.uniforms.iTime, time * 0.001);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    
    this.animationFrameId = requestAnimationFrame((t) => this.animate(t));
  }
  
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    window.removeEventListener('resize', this.resizeHandler);
    
    if (this.enableMouseInteraction) {
      this.container.removeEventListener('mousemove', this.mouseMoveHandler);
      this.container.removeEventListener('mouseleave', this.mouseLeaveHandler);
    }
    
    if (this.gl) {
      const ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
    
    if (this.canvas && this.container.contains(this.canvas)) {
      this.container.removeChild(this.canvas);
    }
  }
}

// Initialize threads backgrounds for all horizontal cards
function initThreadsBackgrounds() {
  const cards = document.querySelectorAll('.horizontal-item');
  const instances = [];
  
  cards.forEach((card) => {
    // Create container for threads background
    const threadsContainer = document.createElement('div');
    threadsContainer.className = 'threads-bg-container';
    card.insertBefore(threadsContainer, card.firstChild);
    
    // Initialize threads background with subtle animation
    const threads = new ThreadsBackground(threadsContainer, {
      color: [0.26, 0.41, 0.88], // Royal blue color (matching var(--color-primary))
      amplitude: 0.5, // Subtle wave amplitude
      distance: 0, // No vertical distance
      enableMouseInteraction: false // No hover effect
    });
    
    instances.push(threads);
  });
  
  console.log(`✅ Threads backgrounds initialized for ${instances.length} cards`);
  
  // Return cleanup function
  return () => {
    instances.forEach(instance => instance.destroy());
  };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThreadsBackground, initThreadsBackgrounds };
}


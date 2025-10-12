/* ================================
   VOXY VOICE AI INTEGRATION
   ================================
   Integrates OpenAI Realtime API for voice conversations
   Based on realtime-voice-ai backend
*/

class VoxyVoice {
  constructor(apiKey, voice = 'ballad') {
    console.log('🎤 VoxyVoice constructor called with voice:', voice);
    
    this.apiKey = apiKey;
    this.voice = voice;
    this.ws = null;
    this.isConnected = false;
    this.isListening = false;
    
    // Audio contexts
    this.audioContext = null;
    this.mediaStream = null;
    this.audioProcessor = null;
    this.nextPlayTime = 0;
    this.currentAudioSources = [];
    
    // Configuration from realtime-voice-ai/config.js
    this.config = {
      REALTIME_API_URL: 'wss://api.openai.com/v1/realtime',
      MODEL: 'gpt-4o-realtime-preview-2024-10-01',
      AUDIO: {
        sampleRate: 24000,
        playbackSpeed: 0.95
      },
      SESSION: {
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 1500
        },
        temperature: 0.8,
        instructions: `Tu ești Voxy — un agent vocal conversațional de ultimă generație, dezvoltat manual de o echipă ambițioasă din Brașov, România.
Ești creată pentru a vorbi natural, fluid și inteligent, în peste 40 de limbi.

PRIMA INTERACȚIUNE - SALUTUL TĂU INIȚIAL:
Când ești activată pentru prima dată, te prezinți astfel:
"Salut! Eu sunt Voxy, agentul vocal AI creat de o echipă din Brașov. Pot vorbi în peste 40 de limbi și ajut companiile să înlocuiască operatorii de call center. Cu ce te pot ajuta astăzi?"

După salutul inițial, conduci conversația natural:
- Asculți activ și răspunzi relevant
- Pui întrebări clare despre nevoile utilizatorului
- Explici funcționalitățile VOXY când ești întrebată
- Menții un ton profesionist dar prietenos
- Răspunzi concis și clar

FUNCȚIONALITĂȚI VOXY (pentru când ești întrebată):
1. Răspunde la apeluri telefonice 24/7
2. Face apeluri de vânzări automate
3. Se integrează cu CRM-uri
4. Vorbește în 40+ limbi
5. Analiză și raportare automată

Vorbește natural, fără jargon tehnic, și adaptează-te la întrebările utilizatorului.`
      }
    };
  }
  
  // Connect to OpenAI Realtime API
  async connect() {
    console.log('🔌 Connecting to OpenAI Realtime API...');
    
    // Load API key if not already set
    if (!this.apiKey) {
      loadVoxyApiKey();
      if (!VOXY_CONFIG.apiKey) {
        throw new Error('No API key available. Please provide OpenAI API key.');
      }
      this.apiKey = VOXY_CONFIG.apiKey;
    }
    
    console.log('🔑 Using API key:', this.apiKey.substring(0, 20) + '...');
    
    return new Promise((resolve, reject) => {
      const url = `${this.config.REALTIME_API_URL}?model=${this.config.MODEL}`;
      console.log('🌐 WebSocket URL:', url);
      
      this.ws = new WebSocket(url, [
        'realtime',
        `openai-insecure-api-key.${this.apiKey}`,
        'openai-beta.realtime-v1'
      ]);
      
      this.ws.binaryType = 'arraybuffer';
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        this.isConnected = true;
        this.sendSessionConfig();
        resolve();
      };
      
      this.ws.onmessage = (event) => {
        console.log('📨 WebSocket message received:', event.data);
        this.handleMessage(event);
      };
      
      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        console.error('❌ Error details:', error.type, error.code);
        reject(error);
      };
      
      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        this.isConnected = false;
        if (this.isListening) {
          this.stopListening();
        }
      };
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
    });
  }
  
  // Send session configuration
  sendSessionConfig() {
    const config = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: this.config.SESSION.instructions,
        voice: this.voice,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: this.config.SESSION.turn_detection,
        temperature: this.config.SESSION.temperature,
        max_response_output_tokens: 4096
      }
    };
    
    console.log('📤 Sending session config with voice:', this.voice);
    this.sendMessage(config);
  }
  
  // Trigger initial greeting
  triggerGreeting() {
    console.log('👋 Triggering Voxy greeting...');
    
    // Send a message to trigger the AI to speak first
    const greetingTrigger = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: '[Start conversation - introduce yourself as Voxy]'
          }
        ]
      }
    };
    
    this.sendMessage(greetingTrigger);
    
    // Request response
    const responseRequest = {
      type: 'response.create'
    };
    
    this.sendMessage(responseRequest);
  }
  
  // Handle incoming messages
  handleMessage(event) {
    try {
      const msg = JSON.parse(event.data);
      
      switch (msg.type) {
        case 'session.created':
        case 'session.updated':
          console.log('✅ Session configured');
          break;
          
        case 'conversation.item.input_audio_transcription.completed':
          if (msg.transcript) {
            console.log('👤 User said:', msg.transcript);
            window.dispatchEvent(new CustomEvent('voxy-user-transcript', { 
              detail: { text: msg.transcript }
            }));
          }
          break;
          
        case 'response.audio_transcript.done':
          if (msg.transcript) {
            console.log('💜 Voxy said:', msg.transcript);
            window.dispatchEvent(new CustomEvent('voxy-assistant-transcript', { 
              detail: { text: msg.transcript }
            }));
          }
          break;
          
        case 'response.audio.delta':
          this.playAudio(msg.delta);
          break;
          
        case 'response.audio.done':
          console.log('🔊 Audio response complete');
          window.dispatchEvent(new Event('voxy-response-complete'));
          break;
          
        case 'input_audio_buffer.speech_started':
          console.log('🎤 User started speaking');
          this.stopCurrentAudio();
          window.dispatchEvent(new Event('voxy-user-speaking'));
          break;
          
        case 'input_audio_buffer.speech_stopped':
          console.log('🎤 User stopped speaking');
          window.dispatchEvent(new Event('voxy-user-stopped'));
          break;
          
        case 'error':
          console.error('❌ API error:', msg.error);
          break;
      }
    } catch (error) {
      console.error('❌ Message handling error:', error);
    }
  }
  
  // Start listening to microphone
  async startListening() {
    console.log('🎤 Starting audio capture...');
    
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000
      });
      
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.audioProcessor.onaudioprocess = (event) => {
        if (!this.isConnected || !this.isListening) return;
        
        const inputData = event.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        const base64Audio = this.arrayBufferToBase64(pcm16.buffer);
        this.sendAudioChunk(base64Audio);
      };
      
      source.connect(this.audioProcessor);
      this.audioProcessor.connect(this.audioContext.destination);
      
      this.isListening = true;
      console.log('✅ Audio capture started');
      
    } catch (error) {
      console.error('❌ Failed to start audio capture:', error);
      throw error;
    }
  }
  
  // Stop listening
  stopListening() {
    console.log('🛑 Stopping audio capture...');
    
    if (this.audioProcessor) {
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isListening = false;
    this.nextPlayTime = 0;
    console.log('✅ Audio capture stopped');
  }
  
  // Send audio chunk to API
  sendAudioChunk(base64Audio) {
    const message = {
      type: 'input_audio_buffer.append',
      audio: base64Audio
    };
    
    this.sendMessage(message);
  }
  
  // Play audio from API
  playAudio(base64Audio) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000
      });
      this.nextPlayTime = this.audioContext.currentTime;
    }
    
    // Decode base64 to ArrayBuffer
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Convert PCM16 to Float32
    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
    }
    
    // Create audio buffer
    const audioBuffer = this.audioContext.createBuffer(1, float32.length, 24000);
    audioBuffer.copyToChannel(float32, 0);
    
    // Create buffer source
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = this.config.AUDIO.playbackSpeed;
    source.connect(this.audioContext.destination);
    
    // Calculate timing to avoid overlap
    const currentTime = this.audioContext.currentTime;
    const startTime = Math.max(currentTime, this.nextPlayTime);
    const chunkDuration = audioBuffer.duration / source.playbackRate.value;
    this.nextPlayTime = startTime + chunkDuration;
    
    // Track audio source
    this.currentAudioSources.push(source);
    source.onended = () => {
      const index = this.currentAudioSources.indexOf(source);
      if (index > -1) {
        this.currentAudioSources.splice(index, 1);
      }
    };
    
    // Play audio
    source.start(startTime);
  }
  
  // Stop currently playing audio
  stopCurrentAudio() {
    this.currentAudioSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Source might have already stopped
      }
    });
    this.currentAudioSources = [];
    
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
  }
  
  // Disconnect and cleanup
  disconnect() {
    console.log('🔌 Disconnecting...');
    
    this.stopListening();
    this.stopCurrentAudio();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    console.log('✅ Disconnected');
  }
  
  // Helper: Convert ArrayBuffer to Base64
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  
  // Helper: Send WebSocket message
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.VoxyVoice = VoxyVoice;
}


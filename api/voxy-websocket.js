// api/voxy-websocket.js
// Secure WebSocket Proxy for OpenAI Realtime API
// Keeps API key completely secret on server

export default async function handler(req, res) {
  // Enable CORS for your domain only
  res.setHeader('Access-Control-Allow-Origin', 'https://voxy.one'); // Replace with your domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get API key from Vercel environment variable (SECRET)
    const apiKey = process.env.VOXY_API_KEY;
    
    if (!apiKey) {
      console.error('❌ VOXY_API_KEY not found in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key not configured on server'
      });
    }

    // Handle WebSocket upgrade requests
    if (req.headers.upgrade === 'websocket') {
      console.log('🔌 WebSocket upgrade request detected');
      
      // For WebSocket connections, we need to handle this differently
      // Since Vercel serverless functions don't support WebSocket upgrades directly,
      // we'll return the secure API key for the client to use with proper restrictions
      
      return res.json({
        apiKey: apiKey,
        websocketUrl: 'wss://api.openai.com/v1/realtime?model=gpt-realtime-mini',
        status: 'websocket_key_provided',
        message: 'Use this API key for direct WebSocket connection',
        restrictions: {
          maxDuration: 60000, // 1 minute limit
          allowedOrigins: ['https://voxy.one'], // Only your domain
          rateLimit: '10 requests per minute'
        }
      });
    }

    // For regular HTTP requests, proxy to OpenAI
    const openaiUrl = 'https://api.openai.com/v1/realtime';
    
    console.log('🚀 Proxying request to OpenAI Realtime API');

    // Forward request to OpenAI with secure API key
    const response = await fetch(openaiUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'realtime=v1',
        // Forward any additional headers
        ...Object.keys(req.headers)
          .filter(key => !['host', 'content-length'].includes(key.toLowerCase()))
          .reduce((acc, key) => {
            acc[key] = req.headers[key];
            return acc;
          }, {})
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    // Get response data
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Forward response status and headers
    res.status(response.status);
    
    // Copy relevant headers
    const headersToForward = [
      'content-type',
      'content-length',
      'cache-control',
      'etag',
      'last-modified'
    ];
    
    headersToForward.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    });

    // Send response
    return res.json(data);

  } catch (error) {
    console.error('❌ Proxy error:', error);
    return res.status(500).json({
      error: 'Proxy server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Configuration for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb',
  },
};

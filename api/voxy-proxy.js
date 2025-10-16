// api/voxy-proxy.js
// Voxy AI Serverless Proxy - Secure API Key Handling
// Deployed on Vercel Serverless Functions

export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get API key from Vercel environment variable (SECURE)
    const apiKey = process.env.VOXY_API_KEY;
    
    if (!apiKey) {
      console.error('❌ VOXY_API_KEY not found in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key not configured on server'
      });
    }

    // Special endpoint to get API key for frontend
    if (req.method === 'GET' && req.query.action === 'get-api-key') {
      console.log('🔑 API key requested by frontend');
      return res.json({
        apiKey: apiKey,
        status: 'success',
        timestamp: new Date().toISOString()
      });
    }

    // Extract model from query parameters
    const model = req.query.model || 'gpt-4o-realtime-preview-2024-10-01';
    
    // Build OpenAI Realtime API URL
    const openaiUrl = `https://api.openai.com/v1/realtime?model=${model}`;
    
    console.log(`🚀 Proxying request to OpenAI Realtime API: ${model}`);

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

    // Handle WebSocket upgrade requests
    if (req.headers.upgrade === 'websocket') {
      console.log('🔌 WebSocket upgrade request detected');
      
      // For WebSocket connections, we need to handle this differently
      // Since Vercel serverless functions don't support WebSocket upgrades,
      // we'll return the API key for the client to use directly
      return res.json({
        apiKey: apiKey,
        websocketUrl: openaiUrl,
        status: 'websocket_key_provided',
        message: 'Use this API key for direct WebSocket connection'
      });
    }

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
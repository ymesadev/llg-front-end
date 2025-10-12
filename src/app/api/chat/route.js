import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, conversationId, userId } = await request.json();

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'User ID is required for privacy' },
        { status: 400 }
      );
    }

    // N8N webhook URL - configured for Louis Law Group
    const n8nWebhookUrl = 'https://n8n.louislawgroup.com/webhook/chatbot';

    // Prepare payload for n8n
    const payload = {
      message: message.trim(),
      conversationId: conversationId || `conv_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      timestamp: new Date().toISOString(),
      source: 'website',
      sessionInfo: {
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    };

    // Log the payload being sent to N8N
    console.log('Payload being sent to N8N:', JSON.stringify(payload, null, 2));
    console.log('POSTing to N8N webhook URL:', n8nWebhookUrl);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));

    // Send request to n8n webhook with retry logic
    let response;
    let lastError;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}/3: POSTing to N8N webhook...`);
        
        // Create AbortController for timeout (increased to 90 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout
        
        response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; LouisLawGroup-Chatbot/1.0)',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Origin': 'https://louislawgroup.com',
            'Referer': 'https://louislawgroup.com',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          break; // Success, exit retry loop
        }
        
        lastError = new Error(`N8N webhook responded with status: ${response.status}`);
        console.warn(`Attempt ${attempt} failed with status ${response.status}`);
        
        if (attempt < 3) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        }
      } catch (error) {
        lastError = error;
        if (error.name === 'AbortError') {
          console.warn(`Attempt ${attempt} timed out after 90 seconds`);
        } else {
          console.warn(`Attempt ${attempt} failed with error:`, error.message);
        }
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        }
      }
    }

    if (!response || !response.ok) {
      console.error(`N8N webhook failed after 3 attempts: ${lastError.message}`);
      
      // If it's a timeout and N8N is taking too long, provide a helpful message
      if (lastError.name === 'AbortError') {
        throw new Error('The AI system is taking longer than expected to respond. Please try again in a moment or contact us at (833) 657-4812 for immediate assistance.');
      }
      
      throw lastError;
    }

    // Handle response parsing more safely
    let data;
    let responseText = '';
    try {
      responseText = await response.text();
      console.log('Raw N8N response:', responseText);
      console.log('N8N response status:', response.status);
      console.log('N8N response headers:', Object.fromEntries(response.headers.entries()));

      const contentType = response.headers.get('content-type') || '';

      // Normalize leading '=' which sometimes appears from upstream integrations
      const raw = (responseText || '').trim();
      const cleanRaw = raw.startsWith('=') ? raw.slice(1) : raw;

      // First attempt: try to parse the raw body as JSON regardless of content-type
      let parsed = null;
      try {
        parsed = JSON.parse(cleanRaw);
      } catch {}

      if (parsed && typeof parsed === 'object') {
        data = parsed;
      } else if (contentType.includes('application/json')) {
        // Trust but verify JSON content-type
        try {
          data = JSON.parse(cleanRaw);
        } catch (e) {
          console.warn('Content-Type said JSON but parse failed; falling back to text payload');
          data = { response: cleanRaw };
        }
      } else {
        // Not JSON content-type: treat as text
        data = { response: cleanRaw };
      }

      // If the top-level is { response: "<json-string>" }, try to parse that inner string
      if (data && typeof data.response === 'string') {
        const innerRaw = data.response.trim().startsWith('=') ? data.response.trim().slice(1) : data.response.trim();
        if (innerRaw.startsWith('{') && innerRaw.endsWith('}')) {
          try {
            const innerParsed = JSON.parse(innerRaw);
            if (innerParsed && typeof innerParsed === 'object') {
              data = innerParsed;
            }
          } catch {
            // keep original data.response as text
          }
        }
      }

      // Ensure we always have an object
      if (typeof data !== 'object' || data === null) {
        data = { response: String(cleanRaw || '') };
      }

    } catch (parseError) {
      console.error('Error parsing N8N response:', parseError);
      console.log('Raw response that failed to parse:', responseText);
      data = {
        response:
          "I received your message but encountered an issue processing it. Please try again or contact us at (833) 657-4812 for immediate assistance.",
      };
    }

    function hyperlinkURLs(text) {
      if (typeof text !== 'string') return text;
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const withLinks = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
      return withLinks.replace(/\n/g, '<br/>');
    }

    const finalResponse = {
      success: true,
      response: hyperlinkURLs(data.response || data.message || 'I received your message but couldn\'t generate a response.'),
      conversationId: payload.conversationId,
      timestamp: new Date().toISOString()
    };
    
    console.log('Final API response:', JSON.stringify(finalResponse, null, 2));
    return NextResponse.json(finalResponse, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Origin',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Determine error type and provide appropriate response
    let errorMessage = 'Failed to process chat message';
    let statusCode = 500;
    
    if (error.name === 'AbortError') {
      errorMessage = 'The AI system is taking longer than expected to respond. Please try again in a moment or contact us at (833) 657-4812 for immediate assistance.';
      statusCode = 408; // Request Timeout
    } else if (error.message.includes('N8N webhook failed')) {
      errorMessage = 'Our AI system is temporarily unavailable. Please try again in a moment or contact us at (833) 657-4812 for immediate assistance.';
      statusCode = 503; // Service Unavailable
    } else if (error.message.includes('JSON')) {
      errorMessage = 'There was an issue processing your message. Please try again or contact us at (833) 657-4812 for immediate assistance.';
      statusCode = 422; // Unprocessable Entity
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        errorType: error.name || 'UnknownError',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { 
        status: statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Vary': 'Origin',
        }
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

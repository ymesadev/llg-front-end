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
    const n8nWebhookUrl = 'https://dev-n8n.louislawgroup.com/webhook/chatbot';

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

    // Send request to n8n webhook with retry logic
    let response;
    let lastError;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}/3: POSTing to N8N webhook...`);
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
        });

        if (response.ok) {
          break; // Success, exit retry loop
        }
        
        lastError = new Error(`N8N webhook responded with status: ${response.status}`);
        console.warn(`Attempt ${attempt} failed with status ${response.status}`);
        
        if (attempt < 3) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed with error:`, error.message);
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
    }

    if (!response || !response.ok) {
      console.error(`N8N webhook failed after 3 attempts: ${lastError.message}`);
      throw lastError;
    }

    const data = await response.json();

    // Return the response from n8n
    return NextResponse.json({
      success: true,
      response: data.response || data.message || 'I received your message but couldn\'t generate a response.',
      conversationId: payload.conversationId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
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

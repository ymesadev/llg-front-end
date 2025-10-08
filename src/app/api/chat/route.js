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
    console.error('🚀 CHAT API CALLED - Starting N8N request');

    // Send request to n8n webhook with retry logic
    let response;
    let lastError;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const startTime = Date.now();
        console.log(`Attempt ${attempt}/3: POSTing to N8N webhook...`);
        console.log(`Start time: ${new Date().toISOString()}`);
        
        // Create AbortController for timeout (Vercel has 10s timeout for hobby plan, 60s for pro)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout (wait for N8N)
        
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
        
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        console.log(`N8N response received in ${duration} seconds`);
        console.log(`End time: ${new Date().toISOString()}`);

        if (response.ok) {
          console.log(`N8N responded successfully on attempt ${attempt}`);
          console.error(`✅ N8N SUCCESS - Response received in ${duration} seconds`);
          break; // Success, exit retry loop
        }
        
        lastError = new Error(`N8N webhook responded with status: ${response.status}`);
        console.warn(`Attempt ${attempt} failed with status ${response.status}`);
        
        if (attempt < 3) {
          // Wait before retry (shorter backoff for faster retries)
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
      } catch (error) {
        lastError = error;
        if (error.name === 'AbortError') {
          console.warn(`Attempt ${attempt} timed out after 2 minutes`);
        } else {
          console.warn(`Attempt ${attempt} failed with error:`, error.message);
        }
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
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

    // Additional check to ensure response is valid
    if (!response) {
      console.error('No response received from N8N');
      throw new Error('No response received from AI system');
    }

    // Log the raw response for debugging
    let responseText;
    try {
      responseText = await response.text();
      console.log('=== N8N RESPONSE DEBUG ===');
      console.log('Raw response from N8N:', responseText);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response length:', responseText.length);
      console.log('Response type:', typeof responseText);
      console.log('Is empty?', !responseText || responseText.trim() === '');
      console.log('========================');
    } catch (textError) {
      console.error('Failed to read response text:', textError);
      throw new Error('Failed to read response from N8N');
    }

    // Check if response is empty
    if (!responseText || responseText.trim() === '') {
      console.error('❌ N8N RETURNED EMPTY RESPONSE');
      console.error('Response status was:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      console.error('This means N8N workflow is not returning a response body');
      return NextResponse.json({
        success: true,
        response: 'I received your message but couldn\'t generate a response. Please try again.',
        conversationId: payload.conversationId,
        timestamp: new Date().toISOString()
      });
    }

    let data;
    let responseMessage;
    let responseConversationId = payload.conversationId;

    try {
      data = JSON.parse(responseText);
      console.log('=== JSON PARSING DEBUG ===');
      console.log('Parsed JSON data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data || {}));
      
      // Extract response message from various possible fields
      responseMessage = data.response || data.message || data.text || data.content || data.answer || data.reply;
      console.log('Extracted responseMessage:', responseMessage);
      console.log('ResponseMessage type:', typeof responseMessage);
      console.log('ResponseMessage empty?', !responseMessage || responseMessage.trim() === '');
      
      // Extract conversation ID if provided
      if (data.conversationId) {
        responseConversationId = data.conversationId;
      }
      
      // If no message found in JSON, use the raw response
      if (!responseMessage) {
        console.warn('No message field found in JSON response, using raw response');
        responseMessage = responseText;
      }
      console.log('========================');
      
    } catch (jsonError) {
      console.error('Failed to parse N8N response as JSON:', jsonError);
      console.error('Raw response was:', responseText);
      console.error('Response length:', responseText.length);
      console.error('First 200 chars:', responseText.substring(0, 200));
      
      // If it's not JSON, treat the entire response as the message
      responseMessage = responseText;
    }

    // Ensure we have a valid response message
    if (!responseMessage || responseMessage.trim() === '') {
      console.error('❌ FALLBACK TRIGGERED - No valid response message found');
      console.error('Response message was:', responseMessage);
      console.error('Parsed data was:', data);
      console.error('Raw response was:', responseText);
      responseMessage = 'I received your message but couldn\'t generate a response. Please try again.';
    }

    console.log('Final response message:', responseMessage);
    console.log('Final conversation ID:', responseConversationId);

    // Return the response from n8n
    return NextResponse.json({
      success: true,
      response: responseMessage,
      conversationId: responseConversationId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific timeout errors
    if (error.message.includes('timeout') || error.message.includes('AbortError') || error.message.includes('FUNCTION_INVOCATION_TIMEOUT')) {
      console.error('Function timeout detected:', error.message);
      return NextResponse.json(
        { 
          success: false,
          error: 'The AI system is taking longer than expected to respond. Please try again in a moment or contact us at (833) 657-4812 for immediate assistance.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 408 } // Request Timeout
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
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

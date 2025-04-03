import OpenAI from 'openai'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ASSISTANT_ID = import.meta.env.VITE_OPENAI_ASSISTANT_ID;

if (!API_KEY) {
  console.error('OpenAI API key is not set. Please set VITE_OPENAI_API_KEY in your .env file');
}

if (!ASSISTANT_ID) {
  console.error('OpenAI Assistant ID is not set. Please set VITE_OPENAI_ASSISTANT_ID in your .env file');
}

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
  baseURL: 'https://api.openai.com/v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'OpenAI-Beta': 'assistants=v2'
  }
});

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function createChatCompletion(messages: Message[]) {
  try {
    if (!API_KEY) {
      throw new Error('OpenAI API key is not configured. Please check your environment variables.');
    }

    if (!ASSISTANT_ID) {
      throw new Error('OpenAI Assistant ID is not configured. Please check your environment variables.');
    }

    console.log('Starting chat completion...');
    
    // First, create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
    });

    if (!threadResponse.ok) {
      const errorData = await threadResponse.json();
      console.error('Thread creation failed:', errorData);
      throw new Error(`Failed to create thread: ${threadResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const thread = await threadResponse.json();
    console.log('Thread created:', thread.id);

    // Add the user's message to the thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: messages[messages.length - 1].content
      }),
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      console.error('Message creation failed:', errorData);
      throw new Error(`Failed to add message: ${messageResponse.status} - ${JSON.stringify(errorData)}`);
    }

    console.log('Message added to thread');

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      }),
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      console.error('Run creation failed:', errorData);
      throw new Error(`Failed to create run: ${runResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const run = await runResponse.json();
    console.log('Run created:', run.id);

    // Poll for run completion
    let runStatus = run.status;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while ((runStatus === 'in_progress' || runStatus === 'queued') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'OpenAI-Beta': 'assistants=v2'
        },
      });

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        console.error('Status check failed:', errorData);
        throw new Error(`Failed to check run status: ${statusResponse.status} - ${JSON.stringify(errorData)}`);
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      attempts++;
      console.log(`Run status: ${runStatus} (attempt ${attempts}/${maxAttempts})`);
    }

    if (attempts >= maxAttempts) {
      throw new Error('Run timed out after 30 seconds');
    }

    if (runStatus === 'failed') {
      throw new Error('Assistant run failed');
    }

    // Get the assistant's response
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      },
    });

    if (!messagesResponse.ok) {
      const errorData = await messagesResponse.json();
      console.error('Message retrieval failed:', errorData);
      throw new Error(`Failed to retrieve messages: ${messagesResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const messagesData = await messagesResponse.json();
    console.log('Messages retrieved:', messagesData);
    
    // Find the assistant's message in the response
    const assistantMessage = messagesData.data.find((msg: any) => 
      msg.role === 'assistant' && msg.content[0].type === 'text'
    )?.content[0].text.value;

    if (!assistantMessage) {
      console.error('No assistant message found in response:', messagesData);
      throw new Error('No assistant message found in response');
    }

    // Clean up the thread
    const deleteResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      },
    });

    if (!deleteResponse.ok) {
      console.error('Thread deletion failed:', await deleteResponse.json());
    }

    console.log('Chat completion successful');
    return assistantMessage;
  } catch (error) {
    console.error('Error in createChatCompletion:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Handle specific error types
      if (error.message.includes('Failed to fetch')) {
        console.error('Network error details:', {
          message: error.message,
          stack: error.stack
        });
        throw new Error('Connection error. Please check your internet connection and try again.');
      } else if (error.message.includes('401')) {
        throw new Error('Authentication error. Please check your API key.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      }
    }
    throw error;
  }
}

export async function createAssistantMessage(message: string) {
  try {
    if (!API_KEY) {
      throw new Error('OpenAI API key is not configured. Please check your environment variables.');
    }

    if (!ASSISTANT_ID) {
      throw new Error('OpenAI Assistant ID is not configured. Please check your environment variables.');
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{
        role: 'user',
        content: message
      }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response content received from OpenAI');
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error in createAssistantMessage:', error);
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('Failed to fetch')) {
        console.error('Network error details:', {
          message: error.message,
          stack: error.stack
        });
        throw new Error('Connection error. Please check your internet connection and try again.');
      } else if (error.message.includes('401')) {
        throw new Error('Authentication error. Please check your API key.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      }
    }
    throw error;
  }
} 
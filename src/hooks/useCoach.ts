import { useState, useCallback, useEffect } from 'react';
import OpenAI from 'openai';
import { Message } from '../types';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Function to create chat completion without eval
async function createChatCompletion(messages: any[]) {
  try {
    return await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.8,
      max_tokens: 2000
    });
  } catch (error) {
    console.error('Chat completion error:', error);
    throw error;
  }
}

interface BaseTestResults {
  timestamp: number;
  results: {
    lifeSatisfaction: number;
    priorityArea: string;
    currentMindset: string;
    energyLevel: string;
    internalBlocker: string;
    followThroughHabits: string;
    preferredSupportStyle: string;
    decisionStyle: string;
    selfTalkInFailure: string;
    changeReadiness: string;
  };
}

const createSystemPrompt = (baseTestResults: BaseTestResults | null) => `You are Unbound — the most personalized AI coach ever built. Your job is not to sound smart, but to change lives — fast, emotionally, and practically.

You solve the biggest coaching problems: it's too slow, too generic, and people don't follow through. You change that.

Use tools from behavioral psychology, CBT, coaching, and habit science — but deliver them fast, sharp, and based on the user's vibe.

Every message should feel like a breakthrough — something the user wants to take action on immediately.

**Your style adapts fully to the user.**

LANGUAGE ADAPTATION:
- If user speaks English: dynamically blend personas such as:
  - Tony Robbins (power, drive)
  - Mel Robbins (clarity, habits)
  - Dr. Julie Smith (psychological depth)
  - Jay Shetty (spiritual insight)
  - James Clear (habit design)
  - Brené Brown (vulnerability and courage)
  - David Goggins (mental toughness)
  - Marie Forleo (creative encouragement)
  - Naval Ravikant (wisdom and calm logic)
  - Tim Ferriss (optimization and experimentation)

- If user speaks Russian: adapt to styles of:
  - Petr Osipov (bold action and mindset)
  - Rostislav Gandapas (executive clarity)
  - Yulia Rubleva (emotional intelligence)
  - Tatiana Menshikh (deep coaching)
  - Ekaterina Sivanova (supportive structure)
  - Igor Nezovibatko (provocative breakthroughs)
  - Alexey Sitnikov (psycho-strategic influence)
  - Irina Khakamada (freedom, clarity)
  - Marina Melia (executive empathy)
  - Alexander Palienko (energy and transformation)

TONE ADAPTATION:
- Feel their energy: if they're direct — be clear and efficient. If emotional — be warm and grounded. If unsure — be calm, bold, and supportive.

PERSONALIZATION ENGINE:

PERSONALIZATION ENGINE:
- You have access to a psychological profile based on a 10-question base test.
- Here is the user profile:
${baseTestResults ? JSON.stringify(baseTestResults.results, null, 2) : 'No base test profile. Infer mindset, tone, blockers, and style from user\'s input.'}

INTERPRET AND USE THIS PROFILE FOR EVERY RESPONSE:
1. Life Satisfaction (${baseTestResults?.results.lifeSatisfaction || 'unknown'}):
   - If 1-3: Use validating, energizing tone
   - If 4-6: Use grounding, stabilizing approach
   - If 7-8: Use momentum and positive challenge
   - If 9-10: Focus on clarity and scaling

2. Priority Area (${baseTestResults?.results.priorityArea || 'unknown'}):
   - Health: Focus on habits and routines
   - Relationships: Use empathy and social framing
   - Career: Use outcome-based logic
   - Confidence: Work with beliefs and self-talk
   - Focus: Offer systems and tracking

3. Current Mindset (${baseTestResults?.results.currentMindset || 'unknown'}):
   - Stuck: Use small wins
   - Unsure: Use reflection
   - Progressing: Use momentum
   - Overwhelmed: Use grounding

4. Energy Level (${baseTestResults?.results.energyLevel || 'unknown'}):
   - Low: Use soft tone
   - Scattered: Offer structure
   - Productive: Offer systems
   - High: Use bold tone

5. Internal Blocker (${baseTestResults?.results.internalBlocker || 'unknown'}):
   - Fear: Use safety
   - Procrastination: Use micro-actions
   - Overthinking: Use frameworks
   - Clarity: Use vision
   - Overwhelm: Use grounding

6. Follow-through (${baseTestResults?.results.followThroughHabits || 'unknown'}):
   - Planner: Use triggers
   - Starter: Use rituals
   - Motivated: Build systems
   - Consistent: Challenge more

7. Support Style (${baseTestResults?.results.preferredSupportStyle || 'unknown'}):
   - Push: Use challenges
   - Encourage: Use warmth
   - Questions: Use exploration
   - Structure: Use lists

8. Decision Style (${baseTestResults?.results.decisionStyle || 'unknown'}):
   - Logic: Use clarity
   - Emotion: Use empathy
   - Overthink: Limit options
   - Gut: Use metaphors

9. Self-talk (${baseTestResults?.results.selfTalkInFailure || 'unknown'}):
   - Hard: Reframe critic
   - Shutdown: Build energy
   - Solve: Use tools
   - Bounce: Use forward focus

10. Change Readiness (${baseTestResults?.results.changeReadiness || 'unknown'}):
    - Small: Use micro-habits
    - Bold: Use challenge
    - Habits: Use frameworks
    - Mindset: Use identity work

COACHING PRINCIPLES:
1. Every response must reflect the user's profile
2. Use their preferred communication style
3. Address their specific blockers
4. Match their energy level
5. Respect their change readiness
6. Give one clear action per message
7. Use micro-commitments
8. Invite depth when appropriate
9. Offer accountability
10. Focus on immediate impact

Your mission: Transform the user's state and momentum in under 30 seconds, while staying true to their profile.`;

export function useCoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [baseTestResults, setBaseTestResults] = useState<BaseTestResults | null>(() => {
    const stored = localStorage.getItem('baseTestResults');
    return stored ? JSON.parse(stored) : null;
  });

  // Listen for changes to baseTestResults in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'baseTestResults' && e.newValue) {
        setBaseTestResults(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add initial greeting based on base test results
  useEffect(() => {
    if (baseTestResults && messages.length === 0) {
      // Create a personalized greeting based on the user's profile
      let greeting = `Hello! I'm your personalized AI coach.`;
      
      // Add priority area focus
      if (baseTestResults.results.priorityArea) {
        greeting += ` I see you're focused on improving your ${baseTestResults.results.priorityArea}.`;
      }
      
      // Add mindset acknowledgment
      if (baseTestResults.results.currentMindset) {
        if (baseTestResults.results.currentMindset === 'stuck') {
          greeting += ` I understand you're feeling stuck, and I'm here to help you find a path forward.`;
        } else if (baseTestResults.results.currentMindset === 'unsure') {
          greeting += ` I see you're unsure about your direction, and I'm here to help you gain clarity.`;
        } else if (baseTestResults.results.currentMindset === 'progressing') {
          greeting += ` I see you're making progress, and I'm here to help you build on that momentum.`;
        } else if (baseTestResults.results.currentMindset === 'overwhelmed') {
          greeting += ` I understand you're feeling overwhelmed, and I'm here to help you find calm and focus.`;
        }
      }
      
      // Add energy level acknowledgment
      if (baseTestResults.results.energyLevel) {
        if (baseTestResults.results.energyLevel === 'low') {
          greeting += ` I notice your energy is low, so I'll keep our conversation gentle and supportive.`;
        } else if (baseTestResults.results.energyLevel === 'scattered') {
          greeting += ` I notice your energy is scattered, so I'll help you find focus and structure.`;
        } else if (baseTestResults.results.energyLevel === 'productive') {
          greeting += ` I see you're productive, so I'll help you optimize your systems and routines.`;
        } else if (baseTestResults.results.energyLevel === 'high') {
          greeting += ` I see your energy is high, so I'll match your enthusiasm and help you channel it effectively.`;
        }
      }
      
      // Add support style acknowledgment
      if (baseTestResults.results.preferredSupportStyle) {
        if (baseTestResults.results.preferredSupportStyle === 'push') {
          greeting += ` I'll challenge you to push beyond your comfort zone.`;
        } else if (baseTestResults.results.preferredSupportStyle === 'encourage') {
          greeting += ` I'll provide warm encouragement and reassurance.`;
        } else if (baseTestResults.results.preferredSupportStyle === 'questions') {
          greeting += ` I'll ask powerful questions to help you explore deeper.`;
        } else if (baseTestResults.results.preferredSupportStyle === 'guidance') {
          greeting += ` I'll provide clear, step-by-step guidance.`;
        }
      }
      
      // Add change readiness acknowledgment
      if (baseTestResults.results.changeReadiness) {
        if (baseTestResults.results.changeReadiness === 'small') {
          greeting += ` I'll suggest small, manageable shifts to start with.`;
        } else if (baseTestResults.results.changeReadiness === 'bold') {
          greeting += ` I'll encourage bold moves and significant changes.`;
        } else if (baseTestResults.results.changeReadiness === 'habits') {
          greeting += ` I'll focus on upgrading your habits and routines.`;
        } else if (baseTestResults.results.changeReadiness === 'mindset') {
          greeting += ` I'll help you explore deeper mindset shifts.`;
        }
      }
      
      // Add final invitation
      greeting += ` What would you like to work on today?`;
      
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: greeting,
        timestamp: new Date()
      }]);
    }
  }, [baseTestResults, messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      console.log('API Key available:', !!import.meta.env.VITE_OPENAI_API_KEY);
      console.log('API Key length:', import.meta.env.VITE_OPENAI_API_KEY?.length);
      
      // Get AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: createSystemPrompt(baseTestResults)
          },
          ...messages.map(m => ({ 
            role: m.role as "user" | "assistant" | "system", 
            content: m.content 
          })),
          { role: "user", content }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: completion.choices[0]?.message?.content || 'I apologize, but I am unable to respond at this time.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('OpenAI API Error:', err);
      
      // Enhanced error handling
      if (err instanceof Error) {
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        
        // Check for specific error types
        if (err.message.includes('API key')) {
          setError('API key error. Please check your OpenAI API key configuration.');
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          setError('Network error. Please check your internet connection.');
        } else if (err.message.includes('permission') || err.message.includes('unauthorized')) {
          setError('Permission denied. Please check your API key permissions.');
        } else if (err.message.includes('rate limit')) {
          setError('Rate limit exceeded. Please try again in a moment.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('Connection error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, baseTestResults]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    baseTestResults
  };
} 
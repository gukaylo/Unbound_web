import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Target, 
  BarChart,
  History,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { TestTaking } from '../components/TestTaking';
import { storage } from '../services/storage';
import { generateUserProfile } from '../utils/profileGenerator';
import type { TestResult } from '../types';

interface Question {
  text: string;
  options: { label: string; value: string }[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  icon: React.ReactNode;
  category: 'personality' | 'emotional' | 'motivation' | 'other';
  questionData?: Question[];
  featured?: boolean;
}

const tests: Test[] = [
  {
    id: 'base-test',
    title: 'Base Test',
    description: 'A comprehensive assessment of your current state, goals, and personal growth areas. This test helps us understand you better and customize your coaching experience.',
    duration: '5-10 min',
    questions: 10,
    icon: <Sparkles className="w-6 h-6" />,
    category: 'personality',
    featured: true,
    questionData: [
      {
        text: 'On a scale of 1–10, how satisfied are you with your life overall right now?',
        options: Array.from({ length: 10 }, (_, i) => ({
          label: `${i + 1}${i === 0 ? ' (miserable)' : i === 9 ? ' (thriving)' : ''}`,
          value: `${i + 1}`
        }))
      },
      {
        text: 'Which of these areas do you want to improve most right now?',
        options: [
          { label: 'Health', value: 'health' },
          { label: 'Relationships', value: 'relationships' },
          { label: 'Career/Money', value: 'career' },
          { label: 'Confidence/Mindset', value: 'confidence' },
          { label: 'Focus/Discipline', value: 'focus' }
        ]
      },
      {
        text: 'Which of these describes you best right now?',
        options: [
          { label: 'I know what I want but I\'m stuck', value: 'stuck' },
          { label: 'I don\'t know what I want', value: 'unsure' },
          { label: 'I\'m making progress but want more', value: 'progressing' },
          { label: 'I\'m lost and overwhelmed', value: 'overwhelmed' }
        ]
      },
      {
        text: 'What\'s your current energy level like most days?',
        options: [
          { label: 'Low/tired', value: 'low' },
          { label: 'Scattered', value: 'scattered' },
          { label: 'Productive', value: 'productive' },
          { label: 'High and focused', value: 'high' }
        ]
      },
      {
        text: 'What\'s your biggest internal blocker?',
        options: [
          { label: 'Fear/doubt', value: 'fear' },
          { label: 'Procrastination', value: 'procrastination' },
          { label: 'Overthinking', value: 'overthinking' },
          { label: 'Lack of clarity', value: 'clarity' },
          { label: 'Emotional overwhelm', value: 'overwhelm' }
        ]
      },
      {
        text: 'Which of these habits best describes your follow-through?',
        options: [
          { label: 'I plan but don\'t act', value: 'planner' },
          { label: 'I start but don\'t finish', value: 'starter' },
          { label: 'I follow through when I\'m motivated', value: 'motivated' },
          { label: 'I\'m consistent even without motivation', value: 'consistent' }
        ]
      },
      {
        text: 'What kind of support do you respond to best?',
        options: [
          { label: 'Push and challenge me', value: 'push' },
          { label: 'Encourage and reassure me', value: 'encourage' },
          { label: 'Ask powerful questions', value: 'questions' },
          { label: 'Give clear, step-by-step guidance', value: 'guidance' }
        ]
      },
      {
        text: 'How do you make decisions?',
        options: [
          { label: 'Based on logic', value: 'logic' },
          { label: 'Based on emotions', value: 'emotions' },
          { label: 'I overthink and hesitate', value: 'overthink' },
          { label: 'I go with my gut', value: 'gut' }
        ]
      },
      {
        text: 'How do you usually talk to yourself when things go wrong?',
        options: [
          { label: 'I\'m hard on myself', value: 'hard' },
          { label: 'I shut down', value: 'shutdown' },
          { label: 'I problem-solve', value: 'solve' },
          { label: 'I bounce back quickly', value: 'resilient' }
        ]
      },
      {
        text: 'What kind of change are you ready for now?',
        options: [
          { label: 'Small shifts', value: 'small' },
          { label: 'Bold moves', value: 'bold' },
          { label: 'Habit upgrades', value: 'habits' },
          { label: 'Deep mindset work', value: 'mindset' }
        ]
      }
    ]
  },
  {
    id: 'big-five',
    title: 'Big Five Personality Test',
    description: 'Measure your personality across five key dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
    duration: '15-20 min',
    questions: 50,
    icon: <Brain className="w-6 h-6" />,
    category: 'personality'
  },
  {
    id: 'mbti',
    title: 'MBTI Assessment',
    description: 'Discover your personality type based on the Myers-Briggs Type Indicator.',
    duration: '20-25 min',
    questions: 60,
    icon: <Brain className="w-6 h-6" />,
    category: 'personality'
  },
  {
    id: 'eq',
    title: 'Emotional Intelligence Quiz',
    description: 'Evaluate your emotional intelligence and learn how to improve your EQ.',
    duration: '10-15 min',
    questions: 30,
    icon: <Heart className="w-6 h-6" />,
    category: 'emotional'
  },
  {
    id: 'motivation',
    title: 'Habit & Motivation Score',
    description: 'Assess your motivation levels and identify areas for improvement in habit formation.',
    duration: '10-15 min',
    questions: 25,
    icon: <Target className="w-6 h-6" />,
    category: 'motivation'
  }
];

const testCardGradients: Record<string, string> = {
  'base-test': 'bg-gradient-to-br from-blue-400 to-indigo-500',
  'big-five': 'bg-gradient-to-br from-emerald-400 to-green-500',
  'mbti': 'bg-gradient-to-br from-orange-400 to-amber-500',
  'eq': 'bg-gradient-to-br from-rose-400 to-pink-500',
  'motivation': 'bg-gradient-to-br from-violet-400 to-purple-500'
};

export function Tests() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [latestTestResult, setLatestTestResult] = useState<TestResult | null>(null);

  // Load latest test result on component mount
  useEffect(() => {
    const result = storage.getLatestTestResult();
    if (result) {
      setLatestTestResult(result);
    }
  }, []);

  const filteredTests = selectedCategory === 'all'
    ? tests
    : tests.filter(test => test.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Tests' },
    { id: 'personality', label: 'Personality' },
    { id: 'emotional', label: 'Emotional' },
    { id: 'motivation', label: 'Motivation' }
  ];

  const handleTestStart = (test: Test) => {
    setSelectedTest(test);
  };

  const handleTestComplete = (answers: Record<string, string>) => {
    if (!selectedTest) return;

    const score = calculateBaseTestScore(answers);
    const insights = generateBaseTestInsights(answers);
    
    const result = storage.saveTestResult({
      testId: selectedTest.id,
      answers,
      score,
      createdAt: new Date().toISOString(),
      insights
    });

    // Update the latest test result
    setLatestTestResult(result);
    setSelectedTest(null);

    // Update the coach with the new test results
    const baseTestResults = {
      timestamp: Date.now(),
      results: {
        lifeSatisfaction: parseInt(answers['0'] || '0'),
        priorityArea: answers['1'] || '',
        currentMindset: answers['2'] || '',
        energyLevel: answers['3'] || '',
        internalBlocker: answers['4'] || '',
        followThroughHabits: answers['5'] || '',
        preferredSupportStyle: answers['6'] || '',
        decisionStyle: answers['7'] || '',
        selfTalkInFailure: answers['8'] || '',
        changeReadiness: answers['9'] || ''
      }
    };

    // Store the base test results for the coach
    localStorage.setItem('baseTestResults', JSON.stringify(baseTestResults));
  };

  const renderTestResult = (result: TestResult) => (
    <div className={`${testCardGradients[result.testId] || 'bg-gradient-to-br from-gray-500 to-gray-600'} 
      rounded-lg shadow-lg p-6 text-white backdrop-blur-sm bg-opacity-90`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {tests.find(t => t.id === result.testId)?.title || 'Test Result'}
        </h3>
        <span className="text-sm text-white/80">
          {new Date(result.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {result.insights && (
        <div className="space-y-4">
          {result.insights.strengths.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Strengths</h4>
              <ul className="list-disc list-inside text-white/90">
                {result.insights.strengths.map((strength: string, i: number) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {result.insights.areasForImprovement.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Areas for Growth</h4>
              <ul className="list-disc list-inside text-white/90">
                {result.insights.areasForImprovement.map((area: string, i: number) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          <span>Overall Score</span>
          <span className="text-xl font-bold">{result.score}%</span>
        </div>
      </div>
    </div>
  );

  if (selectedTest) {
    return (
      <TestTaking
        test={selectedTest}
        onComplete={handleTestComplete}
        onBack={() => setSelectedTest(null)}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Psychological Tests</h1>
        <p className="text-muted-foreground">
          Take assessments to better understand yourself and track your progress
        </p>
      </div>

      {/* Results Section */}
      <div>
        <h1 className="text-2xl font-bold">Results</h1>
        <p className="text-muted-foreground">
          View your latest test results and insights
        </p>
      </div>

      {latestTestResult ? renderTestResult(latestTestResult) : (
        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No test results yet. Take a test to see your results here.</p>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Tests Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className={`${testCardGradients[test.id] || 'bg-gradient-to-br from-gray-500 to-gray-600'} 
            rounded-lg shadow-lg p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl
            text-white backdrop-blur-sm bg-opacity-90`}
            onClick={() => handleTestStart(test)}
          >
            <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
            <p className="text-white/90 mb-4 line-clamp-2">{test.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">{test.duration}</span>
              <span className="text-sm text-white/80">{test.questions} questions</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions for Base Test scoring and insights
function calculateBaseTestScore(answers: Record<string, string>): number {
  // Example scoring logic for base test
  const positiveAnswers = [
    '10', // Life satisfaction
    'high', // Energy level
    'consistent', // Follow-through
    'solve', // Self-talk
    'resilient', // Self-talk
    'progressing', // Current state
  ];

  let score = 60; // Base score
  Object.values(answers).forEach(answer => {
    if (positiveAnswers.includes(answer)) {
      score += 5;
    }
  });

  return Math.min(score, 100); // Cap at 100
}

function generateBaseTestInsights(answers: Record<string, string>): TestResult['insights'] {
  const userProfile = generateUserProfile(answers);
  const strengths: string[] = [];
  const areasForImprovement: string[] = [];
  const recommendations: string[] = [];
  let communicationStyle = '';
  let supportApproach = '';

  // Generate user-facing insights
  if (userProfile.energy === 'high' || userProfile.energy === 'productive') {
    strengths.push('You have good energy management skills');
  } else {
    areasForImprovement.push('Energy and focus management');
  }

  if (userProfile.tone?.includes('resilient')) {
    strengths.push('You show strong resilience under pressure');
  }

  if (userProfile.focus) {
    strengths.push(`You have a clear focus on ${userProfile.focus} development`);
  }

  // Generate private coaching directives
  if (userProfile.energy === 'low' || userProfile.energy === 'scattered') {
    recommendations.push('Implement structured breaks and energy management techniques');
  }

  // Set communication style based on tone
  if (userProfile.tone) {
    const toneElements = userProfile.tone.split(', ');
    communicationStyle = `${toneElements[0]} with ${toneElements[1]} elements`;
    
    if (toneElements[2] === 'constructive' || toneElements[2] === 'resilient') {
      strengths.push('You take a constructive approach to challenges');
    } else if (toneElements[2] === 'self-critical' || toneElements[2] === 'avoidant') {
      areasForImprovement.push('Self-talk and emotional resilience');
    }
  }

  // Set support approach based on preferred style and change style
  if (userProfile.preferred_style && userProfile.change_style) {
    const [baseStyle, preferredChange] = userProfile.change_style.split(', ');
    supportApproach = `${userProfile.preferred_style} coaching with ${baseStyle} and ${preferredChange}`;
    recommendations.push(`Structure coaching sessions using ${baseStyle} with emphasis on ${preferredChange}`);
  }

  // Add blocker-specific recommendations
  if (userProfile.blocker) {
    const blockers = userProfile.blocker.split(', ');
    areasForImprovement.push(`Managing ${blockers[1].toLowerCase()}`);
    recommendations.push(`Address ${blockers[0]} through structured approaches tailored to their preferred style`);
  }

  return {
    strengths,
    areasForImprovement,
    coachingDirectives: {
      recommendations,
      profile: userProfile,
      communicationStyle,
      supportApproach
    }
  };
}

function TestResults({ result }: { result: TestResult }) {
  const test = tests.find(t => t.id === result.testId);
  
  return (
    <div className="space-y-8">
      <div className="p-6 rounded-lg border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">{test?.title}</h3>
            <p className="text-sm text-muted-foreground">
              Completed on {new Date(result.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BarChart className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold">{result.score}%</span>
          </div>
        </div>

        {result.insights && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Your Strengths
              </h4>
              <ul className="space-y-2">
                {result.insights.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="mt-1.5">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.insights.areasForImprovement.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Areas for Growth
                </h4>
                <ul className="space-y-2">
                  {result.insights.areasForImprovement.map((area, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-1.5">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Take Another Test
        </Button>
      </div>
    </div>
  );
} 
export interface User {
  id: string;
  name?: string;
  email?: string;
  goals: Goal[];
  preferences: UserPreferences;
  assessmentResults?: AssessmentResults;
  testResults: TestResult[];
  moodEntries: MoodEntry[];
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  progress: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  category: string;
  motivation: number;
}

export interface UserPreferences {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export interface AssessmentResults {
  lifeSatisfaction: number;
  primaryArea: string;
  energy: number;
  selfTalk: string;
  sleepIssues: boolean;
  focusIssues: boolean;
  energyIssues: boolean;
  primaryConcern: string;
  motivation: number;
  supportStyle: string;
  goalSetting: string;
  progressTracking: string;
  currentState: string;
  energyLevel: string;
  internalBlocker: string;
  followThrough: string;
  decisionStyle: string;
  changeReadiness: string;
}

export interface MoodEntry {
  id: string;
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'tired';
  notes?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  energy: string | null;
  blocker: string | null;
  preferred_style: string | null;
  tone: string | null;
  focus: string | null;
  change_style: string | null;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  answers: Record<string, string>;
  score: number;
  createdAt: string;
  insights?: {
    // User-facing insights
    strengths: string[];
    areasForImprovement: string[];
    // Private coaching directives
    coachingDirectives?: {
      recommendations: string[];
      profile: UserProfile;
      communicationStyle: string;
      supportApproach: string;
    };
  };
} 
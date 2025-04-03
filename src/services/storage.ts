import { User, TestResult } from '../types';

const STORAGE_KEY = 'ai_coach_data';

interface StorageData {
  user: User;
}

const defaultUser: User = {
  id: '1', // In a real app, this would be generated/assigned by backend
  name: '',
  goals: [],
  preferences: {
    notifications: true,
    theme: 'light',
    language: 'en',
  },
  testResults: [],
  moodEntries: []
};

export const storage = {
  getData(): StorageData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading from storage:', error);
    }
    return { user: defaultUser };
  },

  saveData(data: StorageData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  // Test Results specific methods
  saveTestResult(result: Omit<TestResult, 'id' | 'userId'>) {
    const data = this.getData();
    const newResult: TestResult = {
      ...result,
      id: Date.now().toString(),
      userId: data.user.id,
    };

    data.user.testResults = [newResult, ...data.user.testResults];
    this.saveData(data);
    return newResult;
  },

  getTestResults(): TestResult[] {
    return this.getData().user.testResults;
  },

  // Get test results for a specific test
  getTestResultsByTestId(testId: string): TestResult[] {
    return this.getData().user.testResults.filter(result => result.testId === testId);
  },

  // Get the latest test result
  getLatestTestResult(): TestResult | undefined {
    const results = this.getData().user.testResults;
    return results[0];
  },

  // Clear all test results (useful for testing/development)
  clearTestResults() {
    const data = this.getData();
    data.user.testResults = [];
    this.saveData(data);
  }
}; 
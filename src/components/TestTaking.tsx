import { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import type { TestResult } from '../types';

interface Question {
  text: string;
  options: { label: string; value: string }[];
}

interface TestProps {
  test: {
    id: string;
    title: string;
    questionData?: Question[];
  };
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export function TestTaking({ test, onComplete, onBack }: TestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sliderValue, setSliderValue] = useState([5]); // Default to middle value
  const [isCompleted, setIsCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const questions = test.questionData || [];
  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(answers);
      setIsCompleted(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const isFirstQuestion = currentQuestion === 0;

  const renderQuestion = () => {
    if (isFirstQuestion) {
      return (
        <div className="space-y-6 w-full max-w-2xl mx-auto">
          <h3 className="text-lg font-medium">{currentQuestionData.text}</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Miserable</span>
              <span>Thriving</span>
            </div>
            <Slider
              value={sliderValue}
              onValueChange={(value) => {
                setSliderValue(value);
                handleAnswer(value[0].toString());
              }}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm font-medium">
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i + 1}
                  className={cn(
                    "w-6 text-center",
                    sliderValue[0] === i + 1 ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 w-full max-w-2xl mx-auto">
        <h3 className="text-lg font-medium">{currentQuestionData.text}</h3>
        <div className="grid gap-3">
          {currentQuestionData.options.map((option) => (
            <Button
              key={option.value}
              variant={answers[currentQuestion] === option.value ? "default" : "outline"}
              className="justify-start text-left h-auto py-3 px-4"
              onClick={() => handleAnswer(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{test.title}</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-secondary rounded-full h-2">
        <motion.div
          className="bg-primary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="py-6"
      >
        {renderQuestion()}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion]}
        >
          {isLastQuestion ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
} 
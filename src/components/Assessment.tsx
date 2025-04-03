import { useState } from 'react';
import { AssessmentResults } from '../types';

interface AssessmentProps {
  onComplete: (results: AssessmentResults) => void;
}

export function Assessment({ onComplete }: AssessmentProps) {
  const [step, setStep] = useState(1);
  const [results, setResults] = useState<Partial<AssessmentResults>>({});

  const handleLifeSatisfaction = (score: number) => {
    setResults(prev => ({ ...prev, lifeSatisfaction: score }));
    setStep(2);
  };

  const handlePrimaryArea = (area: AssessmentResults['primaryArea']) => {
    setResults(prev => ({ ...prev, primaryArea: area }));
    setStep(3);
  };

  const handleCurrentState = (state: AssessmentResults['currentState']) => {
    setResults(prev => ({ ...prev, currentState: state }));
    setStep(4);
  };

  const handleEnergyLevel = (level: AssessmentResults['energyLevel']) => {
    setResults(prev => ({ ...prev, energyLevel: level }));
    setStep(5);
  };

  const handleInternalBlocker = (blocker: AssessmentResults['internalBlocker']) => {
    setResults(prev => ({ ...prev, internalBlocker: blocker }));
    setStep(6);
  };

  const handleFollowThrough = (style: AssessmentResults['followThrough']) => {
    setResults(prev => ({ ...prev, followThrough: style }));
    setStep(7);
  };

  const handleSupportStyle = (style: AssessmentResults['supportStyle']) => {
    setResults(prev => ({ ...prev, supportStyle: style }));
    setStep(8);
  };

  const handleDecisionStyle = (style: AssessmentResults['decisionStyle']) => {
    setResults(prev => ({ ...prev, decisionStyle: style }));
    setStep(9);
  };

  const handleSelfTalk = (style: AssessmentResults['selfTalk']) => {
    setResults(prev => ({ ...prev, selfTalk: style }));
    setStep(10);
  };

  const handleChangeReadiness = (readiness: AssessmentResults['changeReadiness']) => {
    const finalResults: AssessmentResults = {
      ...results as AssessmentResults,
      changeReadiness: readiness,
      completedAt: new Date()
    };
    onComplete(finalResults);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <div className="w-full bg-secondary-100 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 10) * 100}%` }}
            />
          </div>
          <p className="text-center text-secondary-600 mt-2">Step {step} of 10</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">On a scale of 1–10, how satisfied are you with your life overall right now?</h2>
            <p className="text-secondary-600">(1 = miserable, 10 = thriving)</p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  onClick={() => handleLifeSatisfaction(score)}
                  className="btn-secondary"
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">Which of these areas do you want to improve most right now?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'health', label: 'Health' },
                { value: 'relationships', label: 'Relationships' },
                { value: 'career', label: 'Career/Money' },
                { value: 'confidence', label: 'Confidence/Mindset' },
                { value: 'focus', label: 'Focus/Discipline' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePrimaryArea(option.value as AssessmentResults['primaryArea'])}
                  className="btn-secondary"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">Which of these describes you best right now?</h2>
            <div className="space-y-4">
              {[
                { value: 'stuck', label: 'I know what I want but I\'m stuck' },
                { value: 'uncertain', label: 'I don\'t know what I want' },
                { value: 'progressing', label: 'I\'m making progress but want more' },
                { value: 'overwhelmed', label: 'I\'m lost and overwhelmed' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCurrentState(option.value as AssessmentResults['currentState'])}
                  className="btn-secondary w-full text-left"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">What's your current energy level like most days?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'low', label: 'Low/tired' },
                { value: 'scattered', label: 'Scattered' },
                { value: 'productive', label: 'Productive' },
                { value: 'focused', label: 'High and focused' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleEnergyLevel(option.value as AssessmentResults['energyLevel'])}
                  className="btn-secondary"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">What's your biggest internal blocker?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'fear', label: 'Fear/doubt' },
                { value: 'procrastination', label: 'Procrastination' },
                { value: 'overthinking', label: 'Overthinking' },
                { value: 'clarity', label: 'Lack of clarity' },
                { value: 'emotions', label: 'Emotional overwhelm' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInternalBlocker(option.value as AssessmentResults['internalBlocker'])}
                  className="btn-secondary"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">Which of these habits best describes your follow-through?</h2>
            <div className="space-y-4">
              {[
                { value: 'planning', label: 'I plan but don\'t act' },
                { value: 'starting', label: 'I start but don\'t finish' },
                { value: 'motivated', label: 'I follow through when I\'m motivated' },
                { value: 'consistent', label: 'I\'m consistent even without motivation' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFollowThrough(option.value as AssessmentResults['followThrough'])}
                  className="btn-secondary w-full text-left"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">What kind of support do you respond to best?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'push', label: 'Push and challenge me' },
                { value: 'encourage', label: 'Encourage and reassure me' },
                { value: 'questions', label: 'Ask powerful questions' },
                { value: 'guidance', label: 'Give clear, step-by-step guidance' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSupportStyle(option.value as AssessmentResults['supportStyle'])}
                  className="btn-secondary"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">How do you make decisions?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'logic', label: 'Based on logic' },
                { value: 'emotions', label: 'Based on emotions' },
                { value: 'overthinking', label: 'I overthink and hesitate' },
                { value: 'intuition', label: 'I go with my gut' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDecisionStyle(option.value as AssessmentResults['decisionStyle'])}
                  className="btn-secondary"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">How do you usually talk to yourself when things go wrong?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'harsh', label: 'I\'m hard on myself' },
                { value: 'shutdown', label: 'I shut down' },
                { value: 'problem-solving', label: 'I problem-solve' },
                { value: 'resilient', label: 'I bounce back quickly' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelfTalk(option.value as AssessmentResults['selfTalk'])}
                  className="btn-secondary"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 10 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900">What kind of change are you ready for now?</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'small', label: 'Small shifts' },
                { value: 'bold', label: 'Bold moves' },
                { value: 'habits', label: 'Habit upgrades' },
                { value: 'mindset', label: 'Deep mindset work' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChangeReadiness(option.value as AssessmentResults['changeReadiness'])}
                  className="btn-secondary"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
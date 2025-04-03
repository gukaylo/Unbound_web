import { useState } from 'react';
import { MoodEntry } from '../types';

interface MoodTrackerProps {
  onMoodSelect: (mood: MoodEntry['mood'], notes?: string) => void;
  entries: MoodEntry[];
}

export function MoodTracker({ onMoodSelect, entries }: MoodTrackerProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);

  const handleMoodSelect = (mood: MoodEntry['mood']) => {
    setSelectedMood(mood);
    setShowNotes(true);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood, notes);
      setShowNotes(false);
      setNotes('');
      setSelectedMood(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(entry => 
    entry.createdAt.toISOString().split('T')[0] === today
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-secondary-900 mb-4">How are you feeling today?</h2>
      
      {todayEntry ? (
        <div className="text-center">
          <p className="text-secondary-600 mb-2">You've already logged your mood for today:</p>
          <div className="text-4xl mb-2">
            {todayEntry.mood === 'happy' && '😊'}
            {todayEntry.mood === 'neutral' && '😐'}
            {todayEntry.mood === 'sad' && '😞'}
          </div>
          {todayEntry.notes && (
            <p className="text-secondary-600 italic">"{todayEntry.notes}"</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handleMoodSelect('happy')}
              className={`text-4xl p-4 rounded-full transition-transform hover:scale-110 ${
                selectedMood === 'happy' ? 'bg-primary-100' : ''
              }`}
            >
              😊
            </button>
            <button
              onClick={() => handleMoodSelect('neutral')}
              className={`text-4xl p-4 rounded-full transition-transform hover:scale-110 ${
                selectedMood === 'neutral' ? 'bg-primary-100' : ''
              }`}
            >
              😐
            </button>
            <button
              onClick={() => handleMoodSelect('sad')}
              className={`text-4xl p-4 rounded-full transition-transform hover:scale-110 ${
                selectedMood === 'sad' ? 'bg-primary-100' : ''
              }`}
            >
              😞
            </button>
          </div>

          {showNotes && (
            <div className="space-y-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your mood (optional)"
                className="w-full p-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNotes(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 
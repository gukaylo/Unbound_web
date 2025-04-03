import { Goal, MoodEntry } from '../types';

interface ProgressProps {
  goals: Goal[];
  moodEntries: MoodEntry[];
}

export function Progress({ goals, moodEntries }: ProgressProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const moodData = last7Days.map(date => {
    const entry = moodEntries.find(e => e.createdAt.toISOString().split('T')[0] === date);
    return {
      date,
      mood: entry?.mood || null
    };
  });

  const moodColors = {
    happy: 'bg-green-500',
    neutral: 'bg-yellow-500',
    sad: 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Your Progress</h2>

      {/* Mood Calendar */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-secondary-700 mb-4">Last 7 Days</h3>
        <div className="flex justify-between items-end h-32">
          {moodData.map(({ date, mood }) => (
            <div key={date} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full mb-2 ${
                  mood ? moodColors[mood] : 'bg-secondary-200'
                }`}
              />
              <span className="text-xs text-secondary-500">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <h3 className="text-lg font-semibold text-secondary-700 mb-4">Your Goals</h3>
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className="border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-secondary-900">{goal.title}</h4>
                <span className="text-sm text-secondary-500 capitalize">{goal.category}</span>
              </div>
              <p className="text-secondary-600 text-sm mb-3">{goal.description}</p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(goal.motivation / 10) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-secondary-500">{goal.motivation}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  Star, 
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Goal, MoodEntry } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  goals?: Goal[];
  moodEntries?: MoodEntry[];
  onMoodSelect?: (mood: MoodEntry['mood'], notes?: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const getMoodValue = (mood: MoodEntry['mood']) => {
  const moodValues: Record<string, number> = {
    '😊': 5,
    '😐': 3,
    '😔': 1,
    '😡': 2,
    '😴': 4
  };
  return moodValues[mood] || 3;
};

export function Dashboard({ goals = [], moodEntries = [], onMoodSelect }: DashboardProps) {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [moodNotes, setMoodNotes] = useState('');
  const [xp, setXp] = useState(1250); // Mock XP value
  const level = Math.floor(xp / 1000) + 1;
  const progress = (xp % 1000) / 10; // Convert to percentage

  const handleMoodSubmit = () => {
    if (selectedMood && onMoodSelect) {
      onMoodSelect(selectedMood, moodNotes);
      setSelectedMood(null);
      setMoodNotes('');
      // Mock XP reward
      setXp(prev => prev + 50);
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header with Level Progress */}
      <motion.div 
        variants={item}
        className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-medium">Level {level}</p>
            <div className="w-32 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-primary to-primary/60"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {1000 - (xp % 1000)} XP to next level
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{xp} XP</span>
          </div>
        </div>
      </motion.div>

      {/* Goals Grid */}
      <motion.section variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Goals
          </h2>
          <Button size="sm" className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-xl border bg-white dark:bg-slate-800 shadow-lg group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                {goal.completed ? (
                  <div className="bg-green-500/10 text-green-500 p-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    className="h-full bg-gradient-to-r from-primary to-primary/60"
                  />
                </div>
              </div>
              {goal.deadline && (
                <p className="text-sm text-muted-foreground mt-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due: {new Date(goal.deadline).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mood Tracking */}
      <motion.section variants={item} className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Mood Tracking
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-lg mb-4">How are you feeling today?</h3>
          <div className="flex gap-4 mb-6">
            {['😊', '😐', '😔', '😡', '😴'].map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(emoji as MoodEntry['mood'])}
                className={cn(
                  "text-3xl p-3 rounded-xl transition-colors",
                  selectedMood === emoji 
                    ? "bg-primary/10 shadow-inner" 
                    : "hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <textarea
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
                placeholder="Add notes about your mood (optional)"
                className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-sm resize-none"
                rows={3}
              />
              <Button onClick={handleMoodSubmit} className="w-full rounded-xl">
                Save Mood
              </Button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Mood History */}
      <motion.section variants={item} className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Mood History
        </h2>
        
        {/* Mood Graph */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={moodEntries.map(entry => ({
                  date: new Date(entry.createdAt).toLocaleDateString(),
                  value: getMoodValue(entry.mood),
                  mood: entry.mood
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => {
                    const moodMap: Record<number, string> = {
                      1: '😔',
                      2: '😡',
                      3: '😐',
                      4: '😴',
                      5: '😊'
                    };
                    return moodMap[value] || value;
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
                          <p className="text-sm font-medium">{payload[0].payload.date}</p>
                          <p className="text-2xl">{payload[0].payload.mood}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{
                    stroke: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    r: 4,
                    fill: 'white'
                  }}
                  activeDot={{
                    stroke: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    r: 6,
                    fill: 'white'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood History List */}
        <div className="space-y-3">
          {moodEntries.map((entry) => (
            <motion.div
              key={entry.id}
              variants={item}
              whileHover={{ scale: 1.01 }}
              className="p-4 rounded-xl border bg-white dark:bg-slate-800 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{entry.mood}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </div>
              {entry.notes && (
                <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
} 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Sun, 
  Moon,
  Settings,
  Target,
  BarChart,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { useTheme } from '../hooks/useTheme';

interface UserProfile {
  name: string;
  age: number;
  avatar?: string;
  coachingStyle: 'strict' | 'friendly' | 'chill';
  notifications: {
    dailyReminder: boolean;
    goalUpdates: boolean;
    testReminders: boolean;
    weeklyReport: boolean;
  };
}

export function Profile() {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    age: 28,
    coachingStyle: 'friendly',
    notifications: {
      dailyReminder: true,
      goalUpdates: true,
      testReminders: false,
      weeklyReport: true
    }
  });

  const handleNotificationToggle = (key: keyof UserProfile['notifications']) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <User className="w-5 h-5 mr-2" />
          Personal Information
        </h2>
        <div className="flex items-center space-x-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Style */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Coaching Style
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(['strict', 'friendly', 'chill'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setProfile(prev => ({ ...prev, coachingStyle: style }))}
              className={`p-4 rounded-lg border transition-colors ${
                profile.coachingStyle === style
                  ? 'border-primary bg-primary/5'
                  : 'bg-card hover:bg-accent'
              }`}
            >
              <h3 className="font-medium capitalize">{style}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {style === 'strict' && 'Focused on accountability and structure'}
                {style === 'friendly' && 'Balanced approach with encouragement'}
                {style === 'chill' && 'Relaxed and flexible guidance'}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </h2>
        <div className="space-y-4">
          {Object.entries(profile.notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div>
                <h3 className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {key === 'dailyReminder' && 'Daily check-in and mood tracking reminder'}
                  {key === 'goalUpdates' && 'Updates on your goal progress'}
                  {key === 'testReminders' && 'Reminders to complete psychological tests'}
                  {key === 'weeklyReport' && 'Weekly progress summary and insights'}
                </p>
              </div>
              <Button
                variant={value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNotificationToggle(key as keyof UserProfile['notifications'])}
              >
                {value ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Theme */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 mr-2" />
          ) : (
            <Sun className="w-5 h-5 mr-2" />
          )}
          Theme
        </h2>
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium capitalize">{theme} Mode</h3>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <Button onClick={toggleTheme}>
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </Button>
          </div>
        </div>
      </section>

      {/* Progress Summary */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart className="w-5 h-5 mr-2" />
          Progress Summary
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Goals</h3>
            </div>
            <p className="text-2xl font-bold mt-2">5</p>
            <p className="text-sm text-muted-foreground">Active goals</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Mood Tracking</h3>
            </div>
            <p className="text-2xl font-bold mt-2">14</p>
            <p className="text-sm text-muted-foreground">Days tracked</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Tests Completed</h3>
            </div>
            <p className="text-2xl font-bold mt-2">3</p>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
        </div>
      </section>
    </div>
  );
} 
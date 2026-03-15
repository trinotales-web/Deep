export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  timezone: string;
  wake_time: string;
  bed_time: string;
  water_goal: number;
  wellness_goals: string[];
  dark_mode: boolean;
  notifications: boolean;
  haptics: boolean;
  sounds: boolean;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  user_id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  completed_at?: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood_index: number;
  note?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  free_text: string;
  prompt_used?: string;
  created_at: string;
  updated_at: string;
}

export interface GratitudeLog {
  id: string;
  user_id: string;
  date: string;
  entry_1: string;
  entry_2: string;
  entry_3: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  date: string;
  glasses: number;
}

export interface SleepLog {
  id: string;
  user_id: string;
  date: string;
  hours: number;
  quality: number;
  restedness: number;
  bed_time_actual?: string;
  wake_time_actual?: string;
}

export interface BodyLog {
  id: string;
  user_id: string;
  date: string;
  energy: number;
  stress: number;
  calm: number;
  physical_comfort: number;
}

export interface RoutineLog {
  id: string;
  user_id: string;
  date: string;
  routine_type: 'morning' | 'evening';
  item_name: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  user_id: string;
  month: string;
  text: string;
  completed: boolean;
  sort_order: number;
  created_at: string;
}

export interface MeditationSession {
  id: string;
  user_id: string;
  date: string;
  type: 'breathing' | 'timed_silence' | 'free_void';
  pattern?: string;
  duration_seconds: number;
  breath_cycles?: number;
  created_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  date: string;
  duration_minutes: number;
  completed: boolean;
  created_at: string;
}

export interface SelfCareItem {
  emoji: string;
  text: string;
  completed?: boolean;
}

export interface BreathingPhase {
  label: string;
  duration: number;
}

export interface BreathingPattern {
  id: string;
  name: string;
  phases: BreathingPhase[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: string;
  unlocked?: boolean;
}

export interface AppStats {
  totalDaysActive: number;
  longestStreak: number;
  currentStreak: number;
  totalJournalEntries: number;
  totalMeditationMinutes: number;
}

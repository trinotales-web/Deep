import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// SQL schema for Supabase (run in Supabase SQL editor):
/*
-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  timezone text default 'UTC',
  wake_time text default '07:00',
  bed_time text default '22:00',
  water_goal integer default 8,
  wellness_goals text[] default '{}',
  dark_mode boolean default false,
  notifications boolean default true,
  haptics boolean default true,
  sounds boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habits
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  name text not null,
  icon text default '✅',
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Habit Logs
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  habit_id uuid references public.habits on delete cascade,
  date date not null,
  completed boolean default false,
  completed_at timestamptz,
  unique(habit_id, date)
);

-- Mood Logs
create table public.mood_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  date date not null,
  mood_index integer not null,
  note text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Journal Entries
create table public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  date date not null,
  free_text text,
  prompt_used text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

-- Gratitude Logs
create table public.gratitude_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  date date not null,
  entry_1 text default '',
  entry_2 text default '',
  entry_3 text default '',
  unique(user_id, date)
);

-- Water Logs
create table public.water_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  date date not null,
  glasses integer default 0,
  unique(user_id, date)
);

-- Sleep Logs
create table public.sleep_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  date date not null,
  hours float default 0,
  quality integer default 0,
  restedness integer default 0,
  bed_time_actual text,
  wake_time_actual text,
  unique(user_id, date)
);

-- Body Logs
create table public.body_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  date date not null,
  energy integer default 0,
  stress integer default 0,
  calm integer default 0,
  physical_comfort integer default 0,
  unique(user_id, date)
);

-- Routine Logs
create table public.routine_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  date date not null,
  routine_type text not null,
  item_name text not null,
  completed boolean default false,
  unique(user_id, date, routine_type, item_name)
);

-- Goals
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  month text not null,
  text text not null,
  completed boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Meditation Sessions
create table public.meditation_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  date date not null,
  type text not null,
  pattern text,
  duration_seconds integer default 0,
  breath_cycles integer,
  created_at timestamptz default now()
);

-- Focus Sessions
create table public.focus_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade,
  date date not null,
  duration_minutes integer not null,
  completed boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.mood_logs enable row level security;
alter table public.journal_entries enable row level security;
alter table public.gratitude_logs enable row level security;
alter table public.water_logs enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.body_logs enable row level security;
alter table public.routine_logs enable row level security;
alter table public.goals enable row level security;
alter table public.meditation_sessions enable row level security;
alter table public.focus_sessions enable row level security;

-- RLS policies (users can only see their own data)
create policy "Users own data" on public.users for all using (auth.uid() = id);
create policy "Users own habits" on public.habits for all using (auth.uid() = user_id);
create policy "Users own habit_logs" on public.habit_logs for all using (auth.uid() = user_id);
create policy "Users own mood_logs" on public.mood_logs for all using (auth.uid() = user_id);
create policy "Users own journal_entries" on public.journal_entries for all using (auth.uid() = user_id);
create policy "Users own gratitude_logs" on public.gratitude_logs for all using (auth.uid() = user_id);
create policy "Users own water_logs" on public.water_logs for all using (auth.uid() = user_id);
create policy "Users own sleep_logs" on public.sleep_logs for all using (auth.uid() = user_id);
create policy "Users own body_logs" on public.body_logs for all using (auth.uid() = user_id);
create policy "Users own routine_logs" on public.routine_logs for all using (auth.uid() = user_id);
create policy "Users own goals" on public.goals for all using (auth.uid() = user_id);
create policy "Users own meditation_sessions" on public.meditation_sessions for all using (auth.uid() = user_id);
create policy "Users own focus_sessions" on public.focus_sessions for all using (auth.uid() = user_id);
*/

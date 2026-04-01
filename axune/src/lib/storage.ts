import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: 'axune_user',
  HABITS: 'axune_habits',
  HABIT_LOGS: 'axune_habit_logs',
  MOOD_LOGS: 'axune_mood_logs',
  JOURNAL_ENTRIES: 'axune_journal_entries',
  GRATITUDE_LOGS: 'axune_gratitude_logs',
  WATER_LOGS: 'axune_water_logs',
  SLEEP_LOGS: 'axune_sleep_logs',
  BODY_LOGS: 'axune_body_logs',
  ROUTINE_LOGS: 'axune_routine_logs',
  GOALS: 'axune_goals',
  MEDITATION_SESSIONS: 'axune_meditation_sessions',
  FOCUS_SESSIONS: 'axune_focus_sessions',
  ONBOARDING_DONE: 'axune_onboarding_done',
  SELF_CARE_DONE: 'axune_self_care_done',
};

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch {}
}

// Habit Storage
export const habitStorage = {
  async getHabits() {
    return getItem<any[]>(KEYS.HABITS) || [];
  },
  async saveHabits(habits: any[]) {
    return setItem(KEYS.HABITS, habits);
  },
};

// Habit Log Storage
export const habitLogStorage = {
  async getLogs(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.HABIT_LOGS)) || [];
  },
  async saveLogs(logs: any[]) {
    return setItem(KEYS.HABIT_LOGS, logs);
  },
  async getLogsForDate(date: string): Promise<any[]> {
    const logs = await this.getLogs();
    return logs.filter((l) => l.date === date);
  },
  async toggleLog(habitId: string, date: string, completed: boolean) {
    const logs = await this.getLogs();
    const idx = logs.findIndex((l) => l.habit_id === habitId && l.date === date);
    if (idx >= 0) {
      logs[idx].completed = completed;
      logs[idx].completed_at = completed ? new Date().toISOString() : undefined;
    } else {
      logs.push({
        id: `${habitId}_${date}`,
        habit_id: habitId,
        date,
        completed,
        completed_at: completed ? new Date().toISOString() : undefined,
      });
    }
    await setItem(KEYS.HABIT_LOGS, logs);
  },
};

// Mood Storage
export const moodStorage = {
  async getLogs(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.MOOD_LOGS)) || [];
  },
  async getLogForDate(date: string) {
    const logs = await this.getLogs();
    return logs.find((l) => l.date === date) || null;
  },
  async saveMood(date: string, mood_index: number, note?: string) {
    const logs = await this.getLogs();
    const idx = logs.findIndex((l) => l.date === date);
    const entry = {
      id: `mood_${date}`,
      date,
      mood_index,
      note,
      created_at: new Date().toISOString(),
    };
    if (idx >= 0) {
      logs[idx] = entry;
    } else {
      logs.push(entry);
    }
    await setItem(KEYS.MOOD_LOGS, logs);
  },
};

// Journal Storage
export const journalStorage = {
  async getEntries(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.JOURNAL_ENTRIES)) || [];
  },
  async getEntryForDate(date: string) {
    const entries = await this.getEntries();
    return entries.find((e) => e.date === date) || null;
  },
  async saveEntry(date: string, free_text: string, prompt_used?: string) {
    const entries = await this.getEntries();
    const idx = entries.findIndex((e) => e.date === date);
    const now = new Date().toISOString();
    const entry = {
      id: `journal_${date}`,
      date,
      free_text,
      prompt_used,
      created_at: now,
      updated_at: now,
    };
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], ...entry };
    } else {
      entries.push(entry);
    }
    await setItem(KEYS.JOURNAL_ENTRIES, entries);
  },
};

// Gratitude Storage
export const gratitudeStorage = {
  async getLogs(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.GRATITUDE_LOGS)) || [];
  },
  async getLogForDate(date: string) {
    const logs = await this.getLogs();
    return logs.find((l) => l.date === date) || null;
  },
  async saveLog(date: string, entry_1: string, entry_2: string, entry_3: string) {
    const logs = await this.getLogs();
    const idx = logs.findIndex((l) => l.date === date);
    const entry = { id: `grat_${date}`, date, entry_1, entry_2, entry_3 };
    if (idx >= 0) {
      logs[idx] = entry;
    } else {
      logs.push(entry);
    }
    await setItem(KEYS.GRATITUDE_LOGS, logs);
  },
};

// Water Storage
export const waterStorage = {
  async getLogs(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.WATER_LOGS)) || [];
  },
  async getLogForDate(date: string) {
    const logs = await this.getLogs();
    return logs.find((l) => l.date === date) || null;
  },
  async setGlasses(date: string, glasses: number) {
    const logs = await this.getLogs();
    const idx = logs.findIndex((l) => l.date === date);
    const entry = { id: `water_${date}`, date, glasses };
    if (idx >= 0) {
      logs[idx] = entry;
    } else {
      logs.push(entry);
    }
    await setItem(KEYS.WATER_LOGS, logs);
  },
};

// Sleep Storage
export const sleepStorage = {
  async getLogs(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.SLEEP_LOGS)) || [];
  },
  async getLogForDate(date: string) {
    const logs = await this.getLogs();
    return logs.find((l) => l.date === date) || null;
  },
  async saveLog(date: string, data: any) {
    const logs = await this.getLogs();
    const idx = logs.findIndex((l) => l.date === date);
    const entry = { id: `sleep_${date}`, date, ...data };
    if (idx >= 0) {
      logs[idx] = entry;
    } else {
      logs.push(entry);
    }
    await setItem(KEYS.SLEEP_LOGS, logs);
  },
};

// Body Storage
export const bodyStorage = {
  async getLogs(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.BODY_LOGS)) || [];
  },
  async getLogForDate(date: string) {
    const logs = await this.getLogs();
    return logs.find((l) => l.date === date) || null;
  },
  async saveLog(date: string, data: any) {
    const logs = await this.getLogs();
    const idx = logs.findIndex((l) => l.date === date);
    const entry = { id: `body_${date}`, date, ...data };
    if (idx >= 0) {
      logs[idx] = entry;
    } else {
      logs.push(entry);
    }
    await setItem(KEYS.BODY_LOGS, logs);
  },
};

// Routine Storage
export const routineStorage = {
  async getLogs(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.ROUTINE_LOGS)) || [];
  },
  async getLogsForDate(date: string, routine_type: string): Promise<any[]> {
    const logs = await this.getLogs();
    return logs.filter((l) => l.date === date && l.routine_type === routine_type);
  },
  async toggleItem(date: string, routine_type: string, item_name: string, completed: boolean) {
    const logs = await this.getLogs();
    const idx = logs.findIndex(
      (l) => l.date === date && l.routine_type === routine_type && l.item_name === item_name
    );
    const entry = {
      id: `routine_${date}_${routine_type}_${item_name}`,
      date,
      routine_type,
      item_name,
      completed,
    };
    if (idx >= 0) {
      logs[idx] = entry;
    } else {
      logs.push(entry);
    }
    await setItem(KEYS.ROUTINE_LOGS, logs);
  },
};

// Goals Storage
export const goalsStorage = {
  async getGoals(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.GOALS)) || [];
  },
  async saveGoals(goals: any[]) {
    return setItem(KEYS.GOALS, goals);
  },
  async getGoalsForMonth(month: string): Promise<any[]> {
    const goals = await this.getGoals();
    return goals.filter((g) => g.month === month);
  },
  async addGoal(goal: any) {
    const goals = await this.getGoals();
    goals.push(goal);
    await setItem(KEYS.GOALS, goals);
  },
  async updateGoal(id: string, updates: any) {
    const goals = await this.getGoals();
    const idx = goals.findIndex((g) => g.id === id);
    if (idx >= 0) {
      goals[idx] = { ...goals[idx], ...updates };
      await setItem(KEYS.GOALS, goals);
    }
  },
  async deleteGoal(id: string) {
    const goals = await this.getGoals();
    await setItem(
      KEYS.GOALS,
      goals.filter((g) => g.id !== id)
    );
  },
};

// Meditation Storage
export const meditationStorage = {
  async getSessions(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.MEDITATION_SESSIONS)) || [];
  },
  async saveSession(session: any) {
    const sessions = await this.getSessions();
    sessions.push({ ...session, id: `med_${Date.now()}`, created_at: new Date().toISOString() });
    await setItem(KEYS.MEDITATION_SESSIONS, sessions);
  },
};

// Focus Storage
export const focusStorage = {
  async getSessions(): Promise<any[]> {
    return (await getItem<any[]>(KEYS.FOCUS_SESSIONS)) || [];
  },
  async saveSession(session: any) {
    const sessions = await this.getSessions();
    sessions.push({ ...session, id: `focus_${Date.now()}`, created_at: new Date().toISOString() });
    await setItem(KEYS.FOCUS_SESSIONS, sessions);
  },
};

// User Storage
export const userStorage = {
  async getUser(): Promise<any | null> {
    return getItem(KEYS.USER);
  },
  async saveUser(user: any) {
    return setItem(KEYS.USER, user);
  },
  async clearUser() {
    return removeItem(KEYS.USER);
  },
};

// Onboarding
export const onboardingStorage = {
  async isDone(): Promise<boolean> {
    const val = await getItem<boolean>(KEYS.ONBOARDING_DONE);
    return val === true;
  },
  async setDone() {
    return setItem(KEYS.ONBOARDING_DONE, true);
  },
};

// Self-care for today
export const selfCareStorage = {
  async getDoneForDate(date: string): Promise<number[]> {
    const all = (await getItem<Record<string, number[]>>(KEYS.SELF_CARE_DONE)) || {};
    return all[date] || [];
  },
  async toggleItem(date: string, index: number) {
    const all = (await getItem<Record<string, number[]>>(KEYS.SELF_CARE_DONE)) || {};
    const current = all[date] || [];
    if (current.includes(index)) {
      all[date] = current.filter((i) => i !== index);
    } else {
      all[date] = [...current, index];
    }
    await setItem(KEYS.SELF_CARE_DONE, all);
  },
};

export { KEYS };

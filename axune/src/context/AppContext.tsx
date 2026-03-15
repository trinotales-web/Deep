import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userStorage, onboardingStorage } from '../lib/storage';
import { today } from '../lib/dateUtils';
import { WISDOM_QUOTES, AFFIRMATIONS, JOURNAL_PROMPTS, SELF_CARE_IDEAS } from '../constants/content';

interface AppUser {
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

interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isOnboardingDone: boolean;
  setOnboardingDone: () => void;
  todayDate: string;
  dailyQuote: { text: string; source: string };
  dailyAffirmation: string;
  dailyPrompt: string;
  dailySelfCare: Array<{ emoji: string; text: string }>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

function getDailyIndex(pool: any[], date: string): number {
  const seed = date.replace(/-/g, '');
  return parseInt(seed) % pool.length;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dateStr = today();
  const quoteIndex = getDailyIndex(WISDOM_QUOTES, dateStr);
  const affirmationIndex = getDailyIndex(AFFIRMATIONS, dateStr);
  const promptIndex = getDailyIndex(JOURNAL_PROMPTS, dateStr);

  // Select 3 self-care ideas for today
  const selfCareIndices = [
    getDailyIndex(SELF_CARE_IDEAS, dateStr),
    (getDailyIndex(SELF_CARE_IDEAS, dateStr) + 5) % SELF_CARE_IDEAS.length,
    (getDailyIndex(SELF_CARE_IDEAS, dateStr) + 11) % SELF_CARE_IDEAS.length,
  ];
  const dailySelfCare = selfCareIndices.map((i) => SELF_CARE_IDEAS[i]);

  useEffect(() => {
    async function init() {
      try {
        const storedUser = await userStorage.getUser();
        if (storedUser) {
          setUserState(storedUser);
          setDarkMode(storedUser.dark_mode || false);
        }
        const onboardingDone = await onboardingStorage.isDone();
        setIsOnboardingDone(onboardingDone);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const setUser = async (u: AppUser | null) => {
    setUserState(u);
    if (u) {
      await userStorage.saveUser(u);
      setDarkMode(u.dark_mode || false);
    } else {
      await userStorage.clearUser();
    }
  };

  const toggleDarkMode = async () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    if (user) {
      const updated = { ...user, dark_mode: newVal };
      setUserState(updated);
      await userStorage.saveUser(updated);
    }
  };

  const setOnboardingDone = async () => {
    await onboardingStorage.setDone();
    setIsOnboardingDone(true);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        darkMode,
        toggleDarkMode,
        isOnboardingDone,
        setOnboardingDone,
        todayDate: dateStr,
        dailyQuote: WISDOM_QUOTES[quoteIndex],
        dailyAffirmation: AFFIRMATIONS[affirmationIndex],
        dailyPrompt: JOURNAL_PROMPTS[promptIndex],
        dailySelfCare,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

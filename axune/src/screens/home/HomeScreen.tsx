import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, DarkColors, Typography, Shadow, BorderRadius } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import {
  moodStorage,
  waterStorage,
  habitLogStorage,
  habitStorage,
  selfCareStorage,
} from '../../lib/storage';
import {
  today,
  last7Days,
  getGreeting,
  formatDayFull,
  getDayName,
  getDayNumber,
  isTodayDate,
} from '../../lib/dateUtils';
import { MOODS, SELF_CARE_IDEAS } from '../../constants/content';
import { Card } from '../../components/common/ThemedView';
import { SectionLabel } from '../../components/common/SectionLabel';

interface HomeScreenProps {
  navigation: any;
  openVoid: () => void;
}

export default function HomeScreen({ navigation, openVoid }: HomeScreenProps) {
  const { user, darkMode, dailyQuote, dailyAffirmation, dailySelfCare, todayDate } = useApp();
  const C = darkMode ? DarkColors : Colors;

  const [mood, setMood] = useState<number | null>(null);
  const [water, setWater] = useState(0);
  const [habits, setHabits] = useState<any[]>([]);
  const [habitLogs, setHabitLogs] = useState<Record<string, boolean>>({});
  const [weekMoods, setWeekMoods] = useState<Record<string, number>>({});
  const [selfCareDone, setSelfCareDone] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const days = last7Days();

  async function loadData() {
    const [moodLog, waterLog, allHabits, allLogs, moodLogs] = await Promise.all([
      moodStorage.getLogForDate(todayDate),
      waterStorage.getLogForDate(todayDate),
      habitStorage.getHabits(),
      habitLogStorage.getLogsForDate(todayDate),
      moodStorage.getLogs(),
    ]);

    setMood(moodLog?.mood_index ?? null);
    setWater(waterLog?.glasses || 0);

    const activeHabits = ((allHabits as any[]) || []).filter((h: any) => h.is_active);
    setHabits(activeHabits);

    const logMap: Record<string, boolean> = {};
    allLogs.forEach((l: any) => {
      logMap[l.habit_id] = l.completed;
    });
    setHabitLogs(logMap);

    const moodMap: Record<string, number> = {};
    moodLogs.forEach((l: any) => {
      moodMap[l.date] = l.mood_index;
    });
    setWeekMoods(moodMap);

    const done = await selfCareStorage.getDoneForDate(todayDate);
    setSelfCareDone(done);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [todayDate])
  );

  async function handleMood(index: number) {
    setMood(index);
    await moodStorage.saveMood(todayDate, index);
  }

  async function handleWater(glass: number) {
    if (glass <= water) {
      // undo
      const newVal = glass - 1;
      setWater(newVal);
      await waterStorage.setGlasses(todayDate, newVal);
    } else {
      setWater(glass);
      await waterStorage.setGlasses(todayDate, glass);
    }
  }

  async function toggleHabit(habitId: string) {
    const current = !!habitLogs[habitId];
    const newVal = !current;
    setHabitLogs((prev) => ({ ...prev, [habitId]: newVal }));
    await habitLogStorage.toggleLog(habitId, todayDate, newVal);
  }

  async function toggleSelfCare(globalIndex: number) {
    await selfCareStorage.toggleItem(todayDate, globalIndex);
    const done = await selfCareStorage.getDoneForDate(todayDate);
    setSelfCareDone(done);
  }

  const completedHabits = habits.filter((h) => habitLogs[h.id]).length;
  const habitPct = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
  const streak = 1; // simplified streak calculation

  const selfCareGlobalIndices = [
    SELF_CARE_IDEAS.findIndex((s) => s.text === dailySelfCare[0]?.text),
    SELF_CARE_IDEAS.findIndex((s) => s.text === dailySelfCare[1]?.text),
    SELF_CARE_IDEAS.findIndex((s) => s.text === dailySelfCare[2]?.text),
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor={C.mutedText} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.brand, { color: C.mutedText }]}>AXUNE</Text>
          <Text style={[styles.greeting, { color: C.primaryText }]}>{getGreeting()}</Text>
          <Text style={[styles.dateText, { color: C.tertiaryText }]}>{formatDayFull()}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={[styles.avatar, { backgroundColor: C.cardBg }]}
        >
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarEmoji}>☯</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Wisdom Quote */}
      <LinearGradient colors={['#3D3A35', '#4A463F']} style={styles.darkCard}>
        <Text style={styles.quoteLabel}>DAILY WISDOM</Text>
        <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
        <Text style={styles.quoteSource}>— {dailyQuote.source}</Text>
      </LinearGradient>

      {/* Affirmation */}
      <LinearGradient colors={['#F9F5ED', '#F0ECE2']} style={styles.affirmCard}>
        <SectionLabel>Today's Affirmation</SectionLabel>
        <Text style={[styles.affirmText, { color: Colors.primaryText }]}>{dailyAffirmation}</Text>
      </LinearGradient>

      {/* Mood Check-In */}
      <Card style={styles.card}>
        <SectionLabel>How are you feeling?</SectionLabel>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.index}
              onPress={() => handleMood(m.index)}
              style={[
                styles.moodBtn,
                mood === m.index && { backgroundColor: m.color + '22', borderColor: m.color, borderWidth: 1.5 },
              ]}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, mood === m.index && { color: m.color }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Week Calendar */}
      <Card style={styles.card}>
        <SectionLabel>This Week</SectionLabel>
        <View style={styles.weekRow}>
          {days.map((d) => {
            const moodIndex = weekMoods[d];
            const moodColor = moodIndex !== undefined ? MOODS[moodIndex]?.color : Colors.border;
            const isToday = isTodayDate(d);
            return (
              <View key={d} style={styles.dayCol}>
                <Text style={[styles.dayName, { color: C.mutedText }]}>{getDayName(d)}</Text>
                <View
                  style={[
                    styles.dayBox,
                    { backgroundColor: C.cardBg, borderColor: isToday ? C.primaryText : C.border },
                    isToday && { borderWidth: 1.5 },
                  ]}
                >
                  <Text style={[styles.dayNum, { color: C.primaryText }]}>{getDayNumber(d)}</Text>
                </View>
                <View
                  style={[
                    styles.moodDot,
                    { backgroundColor: moodIndex !== undefined ? moodColor : 'transparent' },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </Card>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: C.cardBg }, Shadow.card]}>
          <Text style={[styles.statNum, { color: Colors.sageGreen }]}>{habitPct}%</Text>
          <Text style={[styles.statLabel, { color: C.mutedText }]}>HABITS</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: C.cardBg }, Shadow.card]}>
          <Text style={[styles.statNum, { color: Colors.warmGold }]}>{streak}🔥</Text>
          <Text style={[styles.statLabel, { color: C.mutedText }]}>STREAK</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: C.cardBg }, Shadow.card]}>
          <Text style={[styles.statNum, { color: Colors.calmBlue }]}>{water}/{user?.water_goal || 8}</Text>
          <Text style={[styles.statLabel, { color: C.mutedText }]}>WATER</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: C.cardBg }, Shadow.card]}>
          <Text style={[styles.statNum, { color: Colors.softPurple }]}>-</Text>
          <Text style={[styles.statLabel, { color: C.mutedText }]}>SLEEP</Text>
        </View>
      </View>

      {/* Today's Habits */}
      {habits.length > 0 && (
        <Card style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <SectionLabel>Today's Habits</SectionLabel>
            <Text style={[styles.completedCount, { color: Colors.sageGreen }]}>
              {completedHabits}/{habits.length}
            </Text>
          </View>
          <View style={styles.habitsGrid}>
            {habits.map((h) => {
              const done = !!habitLogs[h.id];
              return (
                <TouchableOpacity
                  key={h.id}
                  onPress={() => toggleHabit(h.id)}
                  style={[
                    styles.habitPill,
                    {
                      backgroundColor: done ? Colors.sageGreen + '18' : C.background,
                      borderColor: done ? Colors.sageGreen : C.border,
                    },
                  ]}
                >
                  <Text style={styles.habitEmoji}>{h.icon}</Text>
                  <Text
                    style={[
                      styles.habitName,
                      { color: done ? Colors.sageGreen : C.primaryText },
                      done && { textDecorationLine: 'line-through' },
                    ]}
                  >
                    {h.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>
      )}

      {/* Water Tracker */}
      <Card style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <SectionLabel>Water Today</SectionLabel>
          <Text style={[styles.waterCount, { color: Colors.calmBlue }]}>
            {water}/{user?.water_goal || 8} glasses
          </Text>
        </View>
        <View style={styles.glassesRow}>
          {Array.from({ length: user?.water_goal || 8 }, (_, i) => (
            <TouchableOpacity key={i} onPress={() => handleWater(i + 1)}>
              <LinearGradient
                colors={i < water ? ['#6B9BC3', '#4A7BA3'] : ['#F0ECE5', '#E8E3DB']}
                style={styles.glass}
              >
                <Text style={styles.glassEmoji}>{i < water ? '💧' : '🫙'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        {water > 0 && (
          <TouchableOpacity
            onPress={() => handleWater(water)}
            style={styles.undoBtn}
          >
            <Text style={[styles.undoText, { color: C.mutedText }]}>↩ Undo last</Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* Self-Care Suggestions */}
      <Card style={styles.card}>
        <SectionLabel>Self-Care Today</SectionLabel>
        {dailySelfCare.map((item, i) => {
          const globalIdx = selfCareGlobalIndices[i];
          const done = selfCareDone.includes(globalIdx);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => toggleSelfCare(globalIdx)}
              style={styles.selfCareRow}
            >
              <Text style={styles.selfCareEmoji}>{item.emoji}</Text>
              <Text
                style={[
                  styles.selfCareText,
                  { color: done ? Colors.sageGreen : C.primaryText },
                  done && { textDecorationLine: 'line-through' },
                  { flex: 1 },
                ]}
              >
                {item.text}
              </Text>
              <View
                style={[
                  styles.checkbox,
                  { borderColor: done ? Colors.sageGreen : C.border },
                  done && { backgroundColor: Colors.sageGreen },
                ]}
              >
                {done && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </Card>

      {/* Void Entry */}
      <TouchableOpacity onPress={openVoid} activeOpacity={0.9}>
        <LinearGradient colors={['#131211', '#2A2622']} style={styles.voidCard}>
          <Text style={styles.voidLabel}>ENTER THE</Text>
          <Text style={styles.voidTitle}>Void Space</Text>
          <Text style={styles.voidSub}>Breathe · Meditate · Be still</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 16,
  },
  brand: {
    fontFamily: Typography.sansMedium,
    fontSize: 13,
    letterSpacing: 6,
    marginBottom: 4,
  },
  greeting: {
    fontFamily: Typography.serif,
    fontSize: 28,
  },
  dateText: {
    fontFamily: Typography.sans,
    fontSize: 13,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  avatarImg: { width: 44, height: 44, borderRadius: 22 },
  avatarEmoji: { fontSize: 22 },
  darkCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  quoteLabel: {
    fontFamily: Typography.sansMedium,
    fontSize: 11,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 10,
  },
  quoteText: {
    fontFamily: Typography.serifItalic,
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 26,
    marginBottom: 10,
  },
  quoteSource: {
    fontFamily: Typography.sans,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.35)',
  },
  affirmCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  affirmText: {
    fontFamily: Typography.serif,
    fontSize: 17,
    lineHeight: 26,
  },
  card: { marginBottom: 12 },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodBtn: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minWidth: 46,
  },
  moodEmoji: { fontSize: 22 },
  moodLabel: {
    fontFamily: Typography.sans,
    fontSize: 9,
    color: Colors.mutedText,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: { alignItems: 'center', flex: 1 },
  dayName: {
    fontFamily: Typography.sans,
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dayBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayNum: {
    fontFamily: Typography.sansMedium,
    fontSize: 12,
  },
  moodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: Typography.serif,
    fontSize: 24,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Typography.sansMedium,
    fontSize: 9,
    letterSpacing: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completedCount: {
    fontFamily: Typography.sansMedium,
    fontSize: 13,
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  habitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  habitEmoji: { fontSize: 15 },
  habitName: {
    fontFamily: Typography.sansMedium,
    fontSize: 13,
  },
  waterCount: {
    fontFamily: Typography.sansMedium,
    fontSize: 13,
  },
  glassesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  glass: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassEmoji: { fontSize: 20 },
  undoBtn: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  undoText: {
    fontFamily: Typography.sans,
    fontSize: 12,
  },
  selfCareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  selfCareEmoji: { fontSize: 18 },
  selfCareText: {
    fontFamily: Typography.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Typography.sansBold,
  },
  voidCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 12,
  },
  voidLabel: {
    fontFamily: Typography.sansMedium,
    fontSize: 11,
    letterSpacing: 4,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 8,
  },
  voidTitle: {
    fontFamily: Typography.serifItalic,
    fontSize: 28,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  voidSub: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
});

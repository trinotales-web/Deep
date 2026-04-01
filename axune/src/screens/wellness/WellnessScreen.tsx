import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, DarkColors, Typography, Shadow } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import {
  moodStorage,
  waterStorage,
  sleepStorage,
  bodyStorage,
  routineStorage,
  focusStorage,
} from '../../lib/storage';
import { last7Days, getDayName, today } from '../../lib/dateUtils';
import { MOODS, MORNING_RITUAL_ITEMS, EVENING_RITUAL_ITEMS } from '../../constants/content';
import { Card } from '../../components/common/ThemedView';
import { SectionLabel } from '../../components/common/SectionLabel';
import { DotRating } from '../../components/common/DotRating';
import FocusTimer from './FocusTimer';

const TABS = ['Overview', 'Sleep', 'Body', 'Focus', 'Rituals'];

export default function WellnessScreen() {
  const { darkMode, todayDate, dailySelfCare } = useApp();
  const C = darkMode ? DarkColors : Colors;
  const [activeTab, setActiveTab] = useState(0);

  // Data states
  const [weekMoods, setWeekMoods] = useState<Record<string, number | undefined>>({});
  const [weekWater, setWeekWater] = useState<Record<string, number>>({});
  const [weekSleep, setWeekSleep] = useState<Record<string, number>>({});
  const [sleepHours, setSleepHours] = useState<number | null>(null);
  const [sleepQuality, setSleepQuality] = useState(0);
  const [sleepRestedness, setSleepRestedness] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [stress, setStress] = useState(0);
  const [calm, setCalm] = useState(0);
  const [physicalComfort, setPhysicalComfort] = useState(0);
  const [morningDone, setMorningDone] = useState<string[]>([]);
  const [eveningDone, setEveningDone] = useState<string[]>([]);

  const days = last7Days();

  async function load() {
    const [moodLogs, waterLogs, sleepLogs, todaySleep, todayBody, morningLogs, eveningLogs] =
      await Promise.all([
        moodStorage.getLogs(),
        waterStorage.getLogs(),
        sleepStorage.getLogs(),
        sleepStorage.getLogForDate(todayDate),
        bodyStorage.getLogForDate(todayDate),
        routineStorage.getLogsForDate(todayDate, 'morning'),
        routineStorage.getLogsForDate(todayDate, 'evening'),
      ]);

    const moodMap: Record<string, number | undefined> = {};
    moodLogs.forEach((l: any) => { moodMap[l.date] = l.mood_index; });
    setWeekMoods(moodMap);

    const waterMap: Record<string, number> = {};
    waterLogs.forEach((l: any) => { waterMap[l.date] = l.glasses; });
    setWeekWater(waterMap);

    const sleepMap: Record<string, number> = {};
    sleepLogs.forEach((l: any) => { sleepMap[l.date] = l.hours; });
    setWeekSleep(sleepMap);

    if (todaySleep) {
      setSleepHours(todaySleep.hours);
      setSleepQuality(todaySleep.quality || 0);
      setSleepRestedness(todaySleep.restedness || 0);
    }

    if (todayBody) {
      setEnergy(todayBody.energy || 0);
      setStress(todayBody.stress || 0);
      setCalm(todayBody.calm || 0);
      setPhysicalComfort(todayBody.physical_comfort || 0);
    }

    setMorningDone(morningLogs.filter((l: any) => l.completed).map((l: any) => l.item_name));
    setEveningDone(eveningLogs.filter((l: any) => l.completed).map((l: any) => l.item_name));
  }

  useFocusEffect(useCallback(() => { load(); }, [todayDate]));

  async function saveSleep(field: string, val: any) {
    const log = await sleepStorage.getLogForDate(todayDate) || {};
    await sleepStorage.saveLog(todayDate, { ...log, [field]: val });
  }

  async function saveBody() {
    await bodyStorage.saveLog(todayDate, { energy, stress, calm, physical_comfort: physicalComfort });
  }

  async function toggleRoutine(type: 'morning' | 'evening', itemId: string) {
    const current = type === 'morning' ? morningDone : eveningDone;
    const isDone = current.includes(itemId);
    await routineStorage.toggleItem(todayDate, type, itemId, !isDone);
    if (type === 'morning') {
      setMorningDone(isDone ? current.filter((i) => i !== itemId) : [...current, itemId]);
    } else {
      setEveningDone(isDone ? current.filter((i) => i !== itemId) : [...current, itemId]);
    }
  }

  const SLEEP_HOURS = [4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10];
  const weekSleepAvg =
    days.reduce((sum, d) => sum + (weekSleep[d] || 0), 0) /
    Math.max(1, days.filter((d) => weekSleep[d]).length);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.background }]}>
        <Text style={[styles.brand, { color: C.mutedText }]}>AXUNE</Text>
        <Text style={[styles.title, { color: C.primaryText }]}>Wellness</Text>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContent}
        >
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(i)}
              style={[
                styles.tabPill,
                { backgroundColor: activeTab === i ? C.primaryText : C.cardBg },
                { borderColor: activeTab === i ? C.primaryText : C.border },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === i ? '#fff' : C.secondaryText },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* OVERVIEW */}
        {activeTab === 0 && (
          <View>
            <Card style={styles.card}>
              <SectionLabel>Mood This Week</SectionLabel>
              <View style={styles.moodChart}>
                {days.map((d) => {
                  const mi = weekMoods[d];
                  const mood = mi !== undefined ? MOODS[mi] : null;
                  return (
                    <View key={d} style={styles.moodChartCol}>
                      {mood ? (
                        <Text style={[styles.moodChartEmoji, { marginTop: (mi || 0) * 8 }]}>
                          {mood.emoji}
                        </Text>
                      ) : (
                        <View style={styles.moodEmpty} />
                      )}
                      <Text style={[styles.moodChartDay, { color: C.mutedText }]}>
                        {getDayName(d)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card>

            <Card style={styles.card}>
              <SectionLabel>Water This Week</SectionLabel>
              <View style={styles.chartRow}>
                {days.map((d) => {
                  const val = weekWater[d] || 0;
                  const maxH = 60;
                  const barH = Math.max(4, (val / 8) * maxH);
                  return (
                    <View key={d} style={styles.barCol}>
                      <View style={[styles.barBg, { height: maxH }]}>
                        <View
                          style={[styles.barFill, { height: barH, backgroundColor: Colors.calmBlue }]}
                        />
                      </View>
                      <Text style={[styles.barLabel, { color: C.mutedText }]}>{getDayName(d)}</Text>
                    </View>
                  );
                })}
              </View>
            </Card>

            <Card style={styles.card}>
              <SectionLabel>Sleep This Week</SectionLabel>
              <View style={styles.chartRow}>
                {days.map((d) => {
                  const val = weekSleep[d] || 0;
                  const maxH = 60;
                  const barH = Math.max(4, (val / 10) * maxH);
                  return (
                    <View key={d} style={styles.barCol}>
                      <View style={[styles.barBg, { height: maxH }]}>
                        <View
                          style={[styles.barFill, { height: barH, backgroundColor: Colors.softPurple }]}
                        />
                      </View>
                      <Text style={[styles.barLabel, { color: C.mutedText }]}>{getDayName(d)}</Text>
                    </View>
                  );
                })}
              </View>
            </Card>
          </View>
        )}

        {/* SLEEP */}
        {activeTab === 1 && (
          <View>
            <Card style={styles.card}>
              <SectionLabel>Hours Slept</SectionLabel>
              <View style={styles.hoursGrid}>
                {SLEEP_HOURS.map((h) => (
                  <TouchableOpacity
                    key={h}
                    onPress={() => {
                      setSleepHours(h);
                      saveSleep('hours', h);
                    }}
                    style={[
                      styles.hourBtn,
                      {
                        backgroundColor: sleepHours === h ? Colors.softPurple : C.background,
                        borderColor: sleepHours === h ? Colors.softPurple : C.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.hourBtnText,
                        { color: sleepHours === h ? '#fff' : C.primaryText },
                      ]}
                    >
                      {h}h
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <Card style={styles.card}>
              <View style={styles.ratingRow}>
                <View style={styles.ratingLeft}>
                  <Text style={[styles.ratingLabel, { color: C.primaryText }]}>Sleep Quality</Text>
                </View>
                <DotRating
                  value={sleepQuality}
                  onChange={(v) => { setSleepQuality(v); saveSleep('quality', v); }}
                  color={Colors.softPurple}
                />
              </View>
              <View style={[styles.ratingRow, { marginBottom: 0 }]}>
                <View style={styles.ratingLeft}>
                  <Text style={[styles.ratingLabel, { color: C.primaryText }]}>Restedness</Text>
                </View>
                <DotRating
                  value={sleepRestedness}
                  onChange={(v) => { setSleepRestedness(v); saveSleep('restedness', v); }}
                  color={Colors.warmGold}
                />
              </View>
            </Card>

            <Card style={styles.card}>
              <SectionLabel>Sleep This Week</SectionLabel>
              <Text style={[styles.avgText, { color: Colors.softPurple }]}>
                Avg: {isNaN(weekSleepAvg) ? '—' : weekSleepAvg.toFixed(1)}h
              </Text>
              <View style={styles.chartRow}>
                {days.map((d) => {
                  const val = weekSleep[d] || 0;
                  const maxH = 60;
                  const barH = Math.max(4, (val / 10) * maxH);
                  return (
                    <View key={d} style={styles.barCol}>
                      <Text style={[styles.barVal, { color: C.mutedText }]}>
                        {val > 0 ? `${val}h` : ''}
                      </Text>
                      <View style={[styles.barBg, { height: maxH }]}>
                        <View
                          style={[styles.barFill, { height: barH, backgroundColor: Colors.softPurple }]}
                        />
                      </View>
                      <Text style={[styles.barLabel, { color: C.mutedText }]}>{getDayName(d)}</Text>
                    </View>
                  );
                })}
              </View>
            </Card>
          </View>
        )}

        {/* BODY */}
        {activeTab === 2 && (
          <View>
            <Card style={styles.card}>
              <SectionLabel>Body Check-In</SectionLabel>
              {[
                { label: 'Energy Level', val: energy, set: setEnergy, color: Colors.warmGold },
                { label: 'Stress Level', val: stress, set: setStress, color: Colors.terracotta },
                { label: 'Inner Calm', val: calm, set: setCalm, color: Colors.sageGreen },
                { label: 'Physical Comfort', val: physicalComfort, set: setPhysicalComfort, color: Colors.calmBlue },
              ].map((item) => (
                <View key={item.label} style={styles.bodyRow}>
                  <Text style={[styles.bodyLabel, { color: C.primaryText }]}>{item.label}</Text>
                  <DotRating
                    value={item.val}
                    onChange={async (v) => {
                      item.set(v);
                      await saveBody();
                    }}
                    color={item.color}
                  />
                </View>
              ))}
            </Card>

            <LinearGradient colors={['#F9F5ED', '#F0ECE2']} style={[styles.card, styles.quoteCard]}>
              <Text style={styles.bodyQuote}>
                "Take care of your body. It's the only place you have to live."
              </Text>
              <Text style={styles.bodyQuoteSource}>— Jim Rohn</Text>
            </LinearGradient>
          </View>
        )}

        {/* FOCUS */}
        {activeTab === 3 && <FocusTimer darkMode={darkMode} C={C} todayDate={todayDate} />}

        {/* RITUALS */}
        {activeTab === 4 && (
          <View>
            <Card style={styles.card}>
              <View style={styles.ritualHeader}>
                <Text style={styles.ritualTitle}>☀️  Morning Ritual</Text>
                <Text style={[styles.ritualCount, { color: Colors.warmGold }]}>
                  {morningDone.length}/{MORNING_RITUAL_ITEMS.length}
                </Text>
              </View>
              {MORNING_RITUAL_ITEMS.map((item) => {
                const done = morningDone.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => toggleRoutine('morning', item.id)}
                    style={[styles.ritualRow, { borderBottomColor: C.border }]}
                  >
                    <View
                      style={[
                        styles.ritualCheckbox,
                        { borderColor: done ? Colors.warmGold : C.border },
                        done && { backgroundColor: Colors.warmGold },
                      ]}
                    >
                      {done && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.ritualItemIcon}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.ritualItemText,
                        { color: done ? Colors.warmGold : C.primaryText },
                        done && { textDecorationLine: 'line-through' },
                      ]}
                    >
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Card>

            <Card style={styles.card}>
              <View style={styles.ritualHeader}>
                <Text style={styles.ritualTitle}>🌙  Evening Ritual</Text>
                <Text style={[styles.ritualCount, { color: Colors.blueGrey }]}>
                  {eveningDone.length}/{EVENING_RITUAL_ITEMS.length}
                </Text>
              </View>
              {EVENING_RITUAL_ITEMS.map((item) => {
                const done = eveningDone.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => toggleRoutine('evening', item.id)}
                    style={[styles.ritualRow, { borderBottomColor: C.border }]}
                  >
                    <View
                      style={[
                        styles.ritualCheckbox,
                        { borderColor: done ? Colors.blueGrey : C.border },
                        done && { backgroundColor: Colors.blueGrey },
                      ]}
                    >
                      {done && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.ritualItemIcon}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.ritualItemText,
                        { color: done ? Colors.blueGrey : C.primaryText },
                        done && { textDecorationLine: 'line-through' },
                      ]}
                    >
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Card>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  brand: { fontFamily: Typography.sansMedium, fontSize: 13, letterSpacing: 6, marginBottom: 4 },
  title: { fontFamily: Typography.serif, fontSize: 28, marginBottom: 16 },
  tabScroll: { marginHorizontal: -20 },
  tabContent: { paddingHorizontal: 20, gap: 8, paddingBottom: 8 },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  tabLabel: { fontFamily: Typography.sansMedium, fontSize: 13 },
  scrollContent: { padding: 20, paddingTop: 8 },
  card: { marginBottom: 12 },
  moodChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    alignItems: 'flex-start',
  },
  moodChartCol: { flex: 1, alignItems: 'center' },
  moodChartEmoji: { fontSize: 20, marginBottom: 4 },
  moodEmpty: { width: 20, height: 20 },
  moodChartDay: { fontFamily: Typography.sans, fontSize: 9, marginTop: 4 },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barBg: {
    width: 24,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  barFill: { width: '100%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontFamily: Typography.sans, fontSize: 9, marginTop: 4 },
  barVal: { fontFamily: Typography.sans, fontSize: 9, marginBottom: 2 },
  avgText: { fontFamily: Typography.sansBold, fontSize: 13, marginBottom: 10 },
  hoursGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hourBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  hourBtnText: { fontFamily: Typography.sansMedium, fontSize: 13 },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 4,
  },
  ratingLeft: { flex: 1 },
  ratingLabel: { fontFamily: Typography.sansMedium, fontSize: 14 },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bodyLabel: { fontFamily: Typography.sansMedium, fontSize: 14 },
  quoteCard: { borderRadius: 20, padding: 20 },
  bodyQuote: {
    fontFamily: Typography.serifItalic,
    fontSize: 15,
    color: Colors.primaryText,
    lineHeight: 24,
    marginBottom: 8,
  },
  bodyQuoteSource: { fontFamily: Typography.sans, fontSize: 12, color: Colors.tertiaryText },
  ritualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ritualTitle: { fontFamily: Typography.sansBold, fontSize: 16, color: Colors.primaryText },
  ritualCount: { fontFamily: Typography.sansMedium, fontSize: 13 },
  ritualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  ritualCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualItemIcon: { fontSize: 16 },
  ritualItemText: { fontFamily: Typography.sansMedium, fontSize: 14 },
  checkmark: { color: '#fff', fontSize: 11, fontFamily: Typography.sansBold },
});

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, DarkColors, Typography, Shadow, BorderRadius } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { habitStorage, habitLogStorage } from '../../lib/storage';
import { today, last7Days, getDayName } from '../../lib/dateUtils';
import { Card } from '../../components/common/ThemedView';
import { SectionLabel } from '../../components/common/SectionLabel';

export default function HabitsScreen() {
  const { darkMode, todayDate } = useApp();
  const C = darkMode ? DarkColors : Colors;

  const [habits, setHabits] = useState<any[]>([]);
  const [logs, setLogs] = useState<Record<string, boolean>>({});
  const [weekData, setWeekData] = useState<Record<string, number>>({});
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('✅');

  const days = last7Days();

  async function load() {
    const allHabits = ((await habitStorage.getHabits()) as any[]) || [];
    const active = allHabits.filter((h: any) => h.is_active);
    setHabits(active);

    const todayLogs = await habitLogStorage.getLogsForDate(todayDate);
    const logMap: Record<string, boolean> = {};
    todayLogs.forEach((l: any) => { logMap[l.habit_id] = l.completed; });
    setLogs(logMap);

    // Load week data for chart
    const week: Record<string, number> = {};
    for (const d of days) {
      const dayLogs = await habitLogStorage.getLogsForDate(d);
      const completed = dayLogs.filter((l: any) => l.completed).length;
      week[d] = active.length > 0 ? Math.round((completed / active.length) * 100) : 0;
    }
    setWeekData(week);
  }

  useFocusEffect(useCallback(() => { load(); }, [todayDate]));

  async function toggleHabit(habitId: string) {
    const current = !!logs[habitId];
    const newVal = !current;
    setLogs((prev) => ({ ...prev, [habitId]: newVal }));
    await habitLogStorage.toggleLog(habitId, todayDate, newVal);
  }

  async function addHabit() {
    if (!newName.trim()) return;
    const allHabits = ((await habitStorage.getHabits()) as any[]) || [];
    const newHabit = {
      id: `habit_${Date.now()}`,
      name: newName.trim(),
      icon: newIcon,
      sort_order: allHabits.length,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    await habitStorage.saveHabits([...allHabits, newHabit]);
    setNewName('');
    setNewIcon('✅');
    setAdding(false);
    await load();
  }

  async function deleteHabit(id: string) {
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const allHabits = ((await habitStorage.getHabits()) as any[]) || [];
          await habitStorage.saveHabits(allHabits.filter((h: any) => h.id !== id));
          await load();
        },
      },
    ]);
  }

  const completedCount = habits.filter((h) => logs[h.id]).length;
  const pct = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const maxBar = 80;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.brand, { color: C.mutedText }]}>AXUNE</Text>
        <Text style={[styles.title, { color: C.primaryText }]}>Your Habits</Text>
        <Text style={[styles.subtitle, { color: C.tertiaryText }]}>
          {completedCount} of {habits.length} completed today
        </Text>
      </View>

      {/* Progress Bar */}
      <Card style={styles.card}>
        <View style={styles.progressRow}>
          <Text style={[styles.pctText, { color: Colors.sageGreen }]}>{pct}%</Text>
          <Text style={[styles.streakText, { color: Colors.warmGold }]}>1 🔥 streak</Text>
        </View>
        <View style={[styles.progressBg, { backgroundColor: Colors.progressBg }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${pct}%`, backgroundColor: Colors.sageGreen },
            ]}
          />
        </View>
      </Card>

      {/* Weekly Chart */}
      <Card style={styles.card}>
        <SectionLabel>This Week</SectionLabel>
        <View style={styles.chartRow}>
          {days.map((d) => {
            const val = weekData[d] || 0;
            const barH = Math.max(4, (val / 100) * maxBar);
            return (
              <View key={d} style={styles.barCol}>
                <Text style={[styles.barPct, { color: C.mutedText }]}>{val > 0 ? `${val}%` : ''}</Text>
                <View style={[styles.barBg, { height: maxBar, backgroundColor: C.background }]}>
                  <View
                    style={[
                      styles.barFill,
                      { height: barH, backgroundColor: Colors.sageGreen },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: C.mutedText }]}>{getDayName(d)}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      {/* Habit List */}
      <Card style={styles.card}>
        <SectionLabel>Daily Habits</SectionLabel>
        {habits.map((h) => {
          const done = !!logs[h.id];
          return (
            <View key={h.id} style={[styles.habitRow, { borderBottomColor: C.border }]}>
              <TouchableOpacity
                onPress={() => toggleHabit(h.id)}
                style={[
                  styles.checkbox,
                  { borderColor: done ? Colors.sageGreen : C.border },
                  done && { backgroundColor: Colors.sageGreen },
                ]}
              >
                {done && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.habitIcon}>{h.icon}</Text>
              <Text
                style={[
                  styles.habitName,
                  { color: done ? Colors.sageGreen : C.primaryText },
                  done && { textDecorationLine: 'line-through' },
                  { flex: 1 },
                ]}
              >
                {h.name}
              </Text>
              <TouchableOpacity onPress={() => deleteHabit(h.id)} style={styles.deleteBtn}>
                <Text style={[styles.deleteText, { color: C.mutedText }]}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Add Habit */}
        {adding ? (
          <View style={styles.addForm}>
            <View style={styles.addFormRow}>
              <TextInput
                style={[styles.iconInput, { color: C.primaryText, borderColor: C.border }]}
                value={newIcon}
                onChangeText={setNewIcon}
                maxLength={2}
              />
              <TextInput
                style={[styles.nameInput, { color: C.primaryText, borderColor: C.border, flex: 1 }]}
                value={newName}
                onChangeText={setNewName}
                placeholder="New habit name..."
                placeholderTextColor={C.mutedText}
                autoFocus
              />
            </View>
            <View style={styles.addBtns}>
              <TouchableOpacity style={styles.addConfirm} onPress={addHabit}>
                <Text style={styles.addConfirmText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAdding(false)} style={styles.cancelBtn}>
                <Text style={[styles.cancelText, { color: C.mutedText }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setAdding(true)}
            style={[styles.addHabitBtn, { borderColor: C.border }]}
          >
            <Text style={[styles.addHabitText, { color: C.tertiaryText }]}>+ Add a new habit</Text>
          </TouchableOpacity>
        )}
      </Card>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { marginBottom: 20, marginTop: 16 },
  brand: {
    fontFamily: Typography.sansMedium,
    fontSize: 13,
    letterSpacing: 6,
    marginBottom: 4,
  },
  title: { fontFamily: Typography.serif, fontSize: 28 },
  subtitle: { fontFamily: Typography.sans, fontSize: 13, marginTop: 2 },
  card: { marginBottom: 12 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pctText: { fontFamily: Typography.sansBold, fontSize: 15 },
  streakText: { fontFamily: Typography.sansMedium, fontSize: 13 },
  progressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barPct: { fontFamily: Typography.sans, fontSize: 9, marginBottom: 2 },
  barBg: {
    width: 24,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontFamily: Typography.sans,
    fontSize: 9,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: { color: '#fff', fontSize: 12, fontFamily: Typography.sansBold },
  habitIcon: { fontSize: 18 },
  habitName: { fontFamily: Typography.sansMedium, fontSize: 15 },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 13 },
  addHabitBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  addHabitText: { fontFamily: Typography.sansMedium, fontSize: 14 },
  addForm: { marginTop: 12 },
  addFormRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  iconInput: {
    fontFamily: Typography.sans,
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 52,
    textAlign: 'center',
  },
  nameInput: {
    fontFamily: Typography.sans,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addBtns: { flexDirection: 'row', gap: 10 },
  addConfirm: {
    backgroundColor: Colors.sageGreen,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addConfirmText: {
    fontFamily: Typography.sansMedium,
    fontSize: 14,
    color: '#fff',
  },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 8 },
  cancelText: { fontFamily: Typography.sans, fontSize: 14 },
});

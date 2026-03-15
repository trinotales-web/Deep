import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, DarkColors, Typography, Shadow } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { journalStorage, gratitudeStorage, goalsStorage } from '../../lib/storage';
import { currentMonth, formatMonthYear, today } from '../../lib/dateUtils';
import { Card } from '../../components/common/ThemedView';
import { SectionLabel } from '../../components/common/SectionLabel';

const TABS = ['Write', 'Gratitude', 'Goals'];

export default function JournalScreen() {
  const { darkMode, todayDate, dailyPrompt, dailyAffirmation } = useApp();
  const C = darkMode ? DarkColors : Colors;
  const [activeTab, setActiveTab] = useState(0);

  // Write Tab
  const [journalText, setJournalText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Gratitude Tab
  const [grat1, setGrat1] = useState('');
  const [grat2, setGrat2] = useState('');
  const [grat3, setGrat3] = useState('');

  // Goals Tab
  const [goals, setGoals] = useState<any[]>([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);

  const month = currentMonth();

  async function load() {
    const [entry, grat, monthGoals] = await Promise.all([
      journalStorage.getEntryForDate(todayDate),
      gratitudeStorage.getLogForDate(todayDate),
      goalsStorage.getGoalsForMonth(month),
    ]);
    if (entry) setJournalText(entry.free_text || '');
    if (grat) {
      setGrat1(grat.entry_1 || '');
      setGrat2(grat.entry_2 || '');
      setGrat3(grat.entry_3 || '');
    }
    setGoals(monthGoals.sort((a: any, b: any) => a.sort_order - b.sort_order));
  }

  useFocusEffect(useCallback(() => { load(); }, [todayDate]));

  async function saveJournal() {
    if (!journalText.trim()) return;
    await journalStorage.saveEntry(todayDate, journalText.trim(), dailyPrompt);
    Alert.alert('Saved', 'Your journal entry has been saved.');
  }

  async function saveGratitude(field: 1 | 2 | 3, val: string) {
    const current = {
      entry_1: field === 1 ? val : grat1,
      entry_2: field === 2 ? val : grat2,
      entry_3: field === 3 ? val : grat3,
    };
    if (field === 1) setGrat1(val);
    if (field === 2) setGrat2(val);
    if (field === 3) setGrat3(val);
    await gratitudeStorage.saveLog(todayDate, current.entry_1, current.entry_2, current.entry_3);
  }

  async function addGoal() {
    if (!newGoalText.trim()) return;
    const newGoal = {
      id: `goal_${Date.now()}`,
      month,
      text: newGoalText.trim(),
      completed: false,
      sort_order: goals.length,
      created_at: new Date().toISOString(),
    };
    await goalsStorage.addGoal(newGoal);
    setNewGoalText('');
    setAddingGoal(false);
    await load();
  }

  async function toggleGoal(id: string, completed: boolean) {
    await goalsStorage.updateGoal(id, { completed });
    await load();
  }

  async function deleteGoal(id: string) {
    await goalsStorage.deleteGoal(id);
    await load();
  }

  const completedGoals = goals.filter((g) => g.completed).length;
  const goalPct = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: C.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.background }]}>
        <Text style={[styles.brand, { color: C.mutedText }]}>AXUNE</Text>
        <Text style={[styles.title, { color: C.primaryText }]}>Journal</Text>
        <View style={styles.tabRow}>
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
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* WRITE TAB */}
        {activeTab === 0 && (
          <View>
            <LinearGradient colors={['#F9F5ED', '#F0ECE2']} style={styles.promptCard}>
              <SectionLabel>Today's Prompt</SectionLabel>
              <Text style={styles.promptText}>{dailyPrompt}</Text>
            </LinearGradient>

            <Card style={styles.card}>
              <TextInput
                style={[
                  styles.journalInput,
                  { color: C.primaryText },
                  isFocused && { borderColor: Colors.sageGreen, borderWidth: 1.5 },
                ]}
                multiline
                value={journalText}
                onChangeText={setJournalText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Write freely... let your thoughts flow onto the page like water finding its path."
                placeholderTextColor={C.mutedText}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: C.primaryText }]}
                onPress={saveJournal}
              >
                <Text style={styles.saveBtnText}>Save Entry</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}

        {/* GRATITUDE TAB */}
        {activeTab === 1 && (
          <View>
            <Card style={styles.card}>
              <Text style={[styles.gratTitle, { color: C.primaryText }]}>Three Gratitudes</Text>
              <Text style={[styles.gratSubtitle, { color: C.tertiaryText }]}>
                What are three things, no matter how small, that you appreciate today?
              </Text>

              {[1, 2, 3].map((num) => (
                <View key={num} style={styles.gratRow}>
                  <Text style={[styles.gratNum, { color: Colors.warmGold }]}>{num}.</Text>
                  <TextInput
                    style={[
                      styles.gratInput,
                      { color: C.primaryText, borderColor: C.border },
                    ]}
                    value={num === 1 ? grat1 : num === 2 ? grat2 : grat3}
                    onChangeText={(v) => saveGratitude(num as 1 | 2 | 3, v)}
                    placeholder="I am grateful for..."
                    placeholderTextColor={C.mutedText}
                    onFocus={() => {}}
                  />
                </View>
              ))}
            </Card>

            <LinearGradient colors={['#F9F5ED', '#F0ECE2']} style={[styles.card, styles.affirmCard]}>
              <SectionLabel>Today's Affirmation</SectionLabel>
              <Text style={styles.affirmText}>{dailyAffirmation}</Text>
            </LinearGradient>
          </View>
        )}

        {/* GOALS TAB */}
        {activeTab === 2 && (
          <View>
            <Card style={styles.card}>
              <View style={styles.goalHeader}>
                <Text style={[styles.goalMonth, { color: C.primaryText }]}>
                  {formatMonthYear(month)}
                </Text>
                <Text style={[styles.goalCount, { color: Colors.warmGold }]}>
                  {completedGoals}/{goals.length}
                </Text>
              </View>

              {/* Progress */}
              <View style={[styles.progressBg, { backgroundColor: Colors.progressBg }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${goalPct}%`, backgroundColor: Colors.warmGold },
                  ]}
                />
              </View>

              <View style={{ marginTop: 16 }}>
                {goals.map((g) => (
                  <View key={g.id} style={[styles.goalRow, { borderBottomColor: C.border }]}>
                    <TouchableOpacity
                      onPress={() => toggleGoal(g.id, !g.completed)}
                      style={[
                        styles.goalCheck,
                        { borderColor: g.completed ? Colors.warmGold : C.border },
                        g.completed && { backgroundColor: Colors.warmGold },
                      ]}
                    >
                      {g.completed && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.goalText,
                        { color: g.completed ? Colors.warmGold : C.primaryText },
                        g.completed && { textDecorationLine: 'line-through', flex: 1 },
                        { flex: 1 },
                      ]}
                    >
                      {g.text}
                    </Text>
                    <TouchableOpacity onPress={() => deleteGoal(g.id)} style={styles.deleteBtn}>
                      <Text style={[styles.deleteText, { color: C.mutedText }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {addingGoal ? (
                  <View style={styles.addGoalForm}>
                    <TextInput
                      style={[styles.addGoalInput, { color: C.primaryText, borderColor: C.border }]}
                      value={newGoalText}
                      onChangeText={setNewGoalText}
                      placeholder="New goal for this month..."
                      placeholderTextColor={C.mutedText}
                      autoFocus
                    />
                    <View style={styles.addGoalBtns}>
                      <TouchableOpacity
                        style={[styles.addGoalConfirm, { backgroundColor: Colors.warmGold }]}
                        onPress={addGoal}
                      >
                        <Text style={styles.addGoalConfirmText}>Add Goal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setAddingGoal(false)} style={styles.cancelBtn}>
                        <Text style={[styles.cancelText, { color: C.mutedText }]}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => setAddingGoal(true)}
                    style={[styles.addGoalBtn, { borderColor: C.border }]}
                  >
                    <Text style={[styles.addGoalBtnText, { color: C.tertiaryText }]}>
                      + Add a monthly goal
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>

            <LinearGradient colors={['#F9F5ED', '#F0ECE2']} style={[styles.card, styles.intentCard]}>
              <SectionLabel>Monthly Intention</SectionLabel>
              <Text style={styles.intentText}>
                "What would this month look like if I showed up with full presence and intention?"
              </Text>
            </LinearGradient>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  brand: { fontFamily: Typography.sansMedium, fontSize: 13, letterSpacing: 6, marginBottom: 4 },
  title: { fontFamily: Typography.serif, fontSize: 28, marginBottom: 16 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  tabLabel: { fontFamily: Typography.sansMedium, fontSize: 13 },
  scrollContent: { padding: 20, paddingTop: 8 },
  card: { marginBottom: 12 },
  promptCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  promptText: {
    fontFamily: Typography.serifItalic,
    fontSize: 16,
    color: Colors.primaryText,
    lineHeight: 26,
  },
  journalInput: {
    fontFamily: Typography.serif,
    fontSize: 14.5,
    lineHeight: 26,
    minHeight: 200,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: { fontFamily: Typography.sansMedium, fontSize: 14, color: '#fff' },
  gratTitle: { fontFamily: Typography.serif, fontSize: 22, marginBottom: 6 },
  gratSubtitle: {
    fontFamily: Typography.sans,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  gratRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  gratNum: { fontFamily: Typography.sansBold, fontSize: 16, width: 20 },
  gratInput: {
    flex: 1,
    fontFamily: Typography.sans,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  affirmCard: { borderRadius: 20, padding: 20 },
  affirmText: {
    fontFamily: Typography.serif,
    fontSize: 16,
    color: Colors.primaryText,
    lineHeight: 26,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalMonth: { fontFamily: Typography.sansBold, fontSize: 16 },
  goalCount: { fontFamily: Typography.sansMedium, fontSize: 13 },
  progressBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  goalCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: { color: '#fff', fontSize: 11, fontFamily: Typography.sansBold },
  goalText: { fontFamily: Typography.sans, fontSize: 14 },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 12 },
  addGoalBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  addGoalBtnText: { fontFamily: Typography.sansMedium, fontSize: 14 },
  addGoalForm: { marginTop: 12 },
  addGoalInput: {
    fontFamily: Typography.sans,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  addGoalBtns: { flexDirection: 'row', gap: 10 },
  addGoalConfirm: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addGoalConfirmText: { fontFamily: Typography.sansMedium, fontSize: 14, color: '#fff' },
  cancelBtn: { paddingVertical: 10 },
  cancelText: { fontFamily: Typography.sans, fontSize: 14 },
  intentCard: { borderRadius: 20, padding: 20 },
  intentText: {
    fontFamily: Typography.serifItalic,
    fontSize: 15,
    color: Colors.primaryText,
    lineHeight: 24,
  },
});

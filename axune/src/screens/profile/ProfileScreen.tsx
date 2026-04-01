import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, DarkColors, Typography, Shadow } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import {
  journalStorage,
  meditationStorage,
  habitLogStorage,
  userStorage,
  clearAll,
} from '../../lib/storage';
import { ACHIEVEMENTS } from '../../constants/content';
import { Card } from '../../components/common/ThemedView';
import { SectionLabel } from '../../components/common/SectionLabel';
import { formatDate } from '../../lib/dateUtils';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { user, setUser, darkMode, toggleDarkMode } = useApp();
  const C = darkMode ? DarkColors : Colors;

  const [stats, setStats] = useState({ daysActive: 0, journalCount: 0, meditationMins: 0 });
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.display_name || '');
  const [notifications, setNotifications] = useState(user?.notifications ?? true);
  const [haptics, setHaptics] = useState(user?.haptics ?? true);
  const [sounds, setSounds] = useState(user?.sounds ?? true);

  async function loadStats() {
    const [entries, sessions] = await Promise.all([
      journalStorage.getEntries(),
      meditationStorage.getSessions(),
    ]);
    const totalMins = sessions.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0) / 60, 0);
    setStats({
      daysActive: entries.length,
      journalCount: entries.length,
      meditationMins: Math.round(totalMins),
    });
  }

  useFocusEffect(useCallback(() => { loadStats(); }, []));

  async function saveProfile() {
    if (!user) return;
    const updated = {
      ...user,
      display_name: editName.trim() || user.display_name,
      notifications,
      haptics,
      sounds,
      updated_at: new Date().toISOString(),
    };
    await setUser(updated);
    setEditing(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await setUser(null);
          // App router will redirect to auth
        },
      },
    ]);
  }

  async function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            await setUser(null);
            // App router will redirect to auth
          },
        },
      ]
    );
  }

  async function handleExportData() {
    Alert.alert('Export Data', 'Your data export would be downloaded as a JSON file. (Feature requires file system access)');
  }

  const joinDate = user?.created_at ? formatDate(user.created_at.slice(0, 10)) : 'Today';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: C.secondaryText }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: C.primaryText }]}>Profile</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={[styles.editBtn, { color: Colors.sageGreen }]}>
            {editing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <LinearGradient colors={['#3D3A35', '#4A463F']} style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarEmoji}>☯</Text>
        </View>
        {editing ? (
          <TextInput
            style={styles.nameInput}
            value={editName}
            onChangeText={setEditName}
            placeholder={user?.display_name}
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
        ) : (
          <Text style={styles.profileName}>{user?.display_name || 'Practitioner'}</Text>
        )}
        <Text style={styles.profileJoin}>Joined {joinDate}</Text>
        <Text style={styles.profileStreak}>1 day streak 🔥</Text>
      </LinearGradient>

      {/* Stats Grid */}
      <Card style={styles.card}>
        <SectionLabel>Your Journey</SectionLabel>
        <View style={styles.statsGrid}>
          {[
            { label: 'Days Active', value: stats.daysActive, color: Colors.sageGreen },
            { label: 'Longest Streak', value: 1, color: Colors.warmGold },
            { label: 'Journal Entries', value: stats.journalCount, color: Colors.softPurple },
            { label: 'Meditation Mins', value: stats.meditationMins, color: Colors.calmBlue },
          ].map((s) => (
            <View key={s.label} style={[styles.statCell, { backgroundColor: C.background }]}>
              <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: C.mutedText }]}>{s.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Achievements */}
      <Card style={styles.card}>
        <SectionLabel>Achievements</SectionLabel>
        <View style={styles.achievementGrid}>
          {ACHIEVEMENTS.map((a, i) => {
            const unlocked = i === 0; // First Step always unlocked for demo
            return (
              <View
                key={a.id}
                style={[
                  styles.achievementCell,
                  { backgroundColor: unlocked ? Colors.warmGold + '15' : C.background },
                  unlocked && { borderColor: Colors.warmGold, borderWidth: 1 },
                ]}
              >
                <Text style={[styles.achievementEmoji, !unlocked && { opacity: 0.3 }]}>
                  {a.emoji}
                </Text>
                <Text
                  style={[
                    styles.achievementName,
                    { color: unlocked ? C.primaryText : C.mutedText },
                  ]}
                >
                  {a.name}
                </Text>
                {!unlocked && (
                  <Text style={[styles.achievementReq, { color: C.mutedText }]}>
                    {a.requirement}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </Card>

      {/* Settings */}
      <Card style={styles.card}>
        <SectionLabel>Settings</SectionLabel>

        {[
          { label: 'Dark Mode', value: darkMode, onChange: toggleDarkMode },
          {
            label: 'Notifications',
            value: notifications,
            onChange: async (v: boolean) => {
              setNotifications(v);
              if (user) await setUser({ ...user, notifications: v });
            },
          },
          {
            label: 'Haptic Feedback',
            value: haptics,
            onChange: async (v: boolean) => {
              setHaptics(v);
              if (user) await setUser({ ...user, haptics: v });
            },
          },
          {
            label: 'Sound Effects',
            value: sounds,
            onChange: async (v: boolean) => {
              setSounds(v);
              if (user) await setUser({ ...user, sounds: v });
            },
          },
        ].map((item) => (
          <View key={item.label} style={[styles.settingRow, { borderBottomColor: C.border }]}>
            <Text style={[styles.settingLabel, { color: C.primaryText }]}>{item.label}</Text>
            <Switch
              value={item.value}
              onValueChange={item.onChange}
              trackColor={{ false: C.border, true: Colors.sageGreen }}
              thumbColor="#fff"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.exportBtn} onPress={handleExportData}>
          <Text style={[styles.exportBtnText, { color: Colors.calmBlue }]}>
            Export My Data (JSON)
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Editing Save Button */}
      {editing && (
        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      {/* Links */}
      <Card style={styles.card}>
        <SectionLabel>More</SectionLabel>
        {[
          { label: 'About AXUNE', screen: 'About' },
          { label: 'Privacy Policy', screen: 'Privacy' },
          { label: 'Disclaimer', screen: 'Disclaimer' },
        ].map((item) => (
          <TouchableOpacity
            key={item.screen}
            onPress={() => navigation.navigate(item.screen)}
            style={[styles.linkRow, { borderBottomColor: C.border }]}
          >
            <Text style={[styles.linkText, { color: C.primaryText }]}>{item.label}</Text>
            <Text style={[styles.linkArrow, { color: C.mutedText }]}>›</Text>
          </TouchableOpacity>
        ))}
      </Card>

      {/* Account Actions */}
      <View style={styles.accountBtns}>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={[styles.signOutText, { color: C.secondaryText }]}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 8,
  },
  backBtn: { padding: 4 },
  backText: { fontFamily: Typography.sans, fontSize: 14 },
  screenTitle: { fontFamily: Typography.serif, fontSize: 22 },
  editBtn: { fontFamily: Typography.sansMedium, fontSize: 14 },
  profileCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: { fontSize: 36 },
  profileName: {
    fontFamily: Typography.serif,
    fontSize: 24,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  nameInput: {
    fontFamily: Typography.serif,
    fontSize: 22,
    color: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: 4,
    marginBottom: 4,
    minWidth: 160,
    textAlign: 'center',
  },
  profileJoin: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 4,
  },
  profileStreak: {
    fontFamily: Typography.sansMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  card: { marginBottom: 12 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCell: {
    flex: 1,
    minWidth: '44%',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  statNum: { fontFamily: Typography.serif, fontSize: 28, marginBottom: 2 },
  statLabel: { fontFamily: Typography.sans, fontSize: 11, textAlign: 'center' },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementCell: {
    width: '30%',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  achievementEmoji: { fontSize: 24, marginBottom: 4 },
  achievementName: {
    fontFamily: Typography.sans,
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 2,
  },
  achievementReq: {
    fontFamily: Typography.sans,
    fontSize: 9,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabel: { fontFamily: Typography.sansMedium, fontSize: 15 },
  exportBtn: { paddingVertical: 14, alignItems: 'center' },
  exportBtnText: { fontFamily: Typography.sansMedium, fontSize: 14 },
  saveBtn: {
    backgroundColor: Colors.sageGreen,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: { fontFamily: Typography.sansMedium, fontSize: 15, color: '#fff' },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  linkText: { fontFamily: Typography.sansMedium, fontSize: 15 },
  linkArrow: { fontFamily: Typography.sans, fontSize: 20 },
  accountBtns: { gap: 12, marginBottom: 20, alignItems: 'center' },
  signOutBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  signOutText: { fontFamily: Typography.sansMedium, fontSize: 15 },
  deleteText: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: Colors.terracotta,
    textDecorationLine: 'underline',
  },
});

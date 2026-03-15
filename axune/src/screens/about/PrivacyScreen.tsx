import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Colors, DarkColors, Typography } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/ThemedView';

const sections = [
  {
    title: 'Introduction',
    content: 'At AXUNE, we believe your personal data is as sacred as your inner peace. This Privacy Policy explains how we collect, use, and protect your information when you use AXUNE.',
  },
  {
    title: 'Information We Collect',
    content: 'We collect:\n\n• Account information: email, name, photo, timezone, preferences\n• Wellness data: mood, habits, journal entries, gratitude, sleep, water, body check-in, meditation, focus, routines, and goals\n• Usage data: app open times, feature usage frequency\n• Device data: device type, OS version, app version',
  },
  {
    title: 'How We Use Your Data',
    content: 'Your data is used exclusively to power your personal experience. We use it to:\n\n• Display your wellness analytics and progress\n• Calculate streaks and unlock achievements\n• Generate personalized self-care suggestions\n\nWe NEVER sell your data, use wellness data for advertising, or share your journal entries or health information.',
  },
  {
    title: 'Data Storage & Security',
    content: 'All data is protected with industry-standard encryption at rest and in transit. We use SOC 2 compliant hosting infrastructure. Passwords are hashed using industry-standard algorithms. All communications use HTTPS/TLS.',
  },
  {
    title: 'Data Retention',
    content: 'Your data is retained while your account is active. Upon account deletion, all personal data is permanently deleted within 30 days. You can export your data at any time from your Profile settings.',
  },
  {
    title: 'Third-Party Services',
    content: 'We use:\n\n• Backend infrastructure (Supabase/Firebase) for secure data storage\n• OAuth providers (Google, Apple) for authentication\n\nWe do not use any advertising services.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to:\n\n• Access your personal data\n• Export your data as JSON\n• Correct inaccurate data\n• Delete your account and all associated data\n• Opt out of non-essential data collection',
  },
  {
    title: 'Children\'s Privacy',
    content: 'AXUNE is not intended for use by children under 13 years of age. We do not knowingly collect personal information from children under 13.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We will notify users of any significant changes to this Privacy Policy. The date of the last update is shown at the bottom of this page. Continued use of the app constitutes acceptance of the updated policy.',
  },
];

export default function PrivacyScreen({ navigation }: { navigation: any }) {
  const { darkMode } = useApp();
  const C = darkMode ? DarkColors : Colors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={[styles.backText, { color: C.secondaryText }]}>← Back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: C.primaryText }]}>Privacy Policy</Text>
      <Text style={[styles.updated, { color: C.mutedText }]}>Last updated: March 2026</Text>

      {sections.map((s) => (
        <Card key={s.title} style={styles.card}>
          <Text style={[styles.sectionTitle, { color: C.primaryText }]}>{s.title}</Text>
          <Text style={[styles.body, { color: C.secondaryText }]}>{s.content}</Text>
        </Card>
      ))}

      <TouchableOpacity onPress={() => Linking.openURL('mailto:privacy@axune.app')}>
        <Text style={[styles.contact, { color: Colors.calmBlue }]}>
          Contact: privacy@axune.app
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  backBtn: { marginBottom: 16, marginTop: 8 },
  backText: { fontFamily: Typography.sans, fontSize: 14 },
  title: { fontFamily: Typography.serif, fontSize: 28, marginBottom: 4 },
  updated: { fontFamily: Typography.sans, fontSize: 12, marginBottom: 20 },
  card: { marginBottom: 10 },
  sectionTitle: { fontFamily: Typography.sansBold, fontSize: 15, marginBottom: 8 },
  body: { fontFamily: Typography.sans, fontSize: 13, lineHeight: 22 },
  contact: {
    fontFamily: Typography.sansMedium,
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingVertical: 8,
  },
});

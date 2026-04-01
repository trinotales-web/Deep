import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Colors, DarkColors, Typography } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/ThemedView';

const sections = [
  {
    title: 'General',
    content: 'AXUNE is a self-care and mindfulness companion designed to support your personal wellness journey. Content and features are for informational and personal development purposes only.',
  },
  {
    title: 'Not Medical Advice',
    content: 'Mood tracking, sleep logging, and body check-in features are personal reflection tools, not diagnostic instruments. They are not intended to diagnose, treat, cure, or prevent any medical condition. Please contact a qualified healthcare professional for any medical concerns.',
  },
  {
    title: 'Not a Therapy Replacement',
    content: 'Journaling, gratitude practices, and meditation features are mindfulness and personal development tools. They are not a replacement for professional therapy or mental health treatment. If you are struggling with mental health challenges, please seek support from a licensed mental health professional.',
  },
  {
    title: 'Content',
    content: 'Quotes, affirmations, and self-care suggestions in AXUNE are drawn from various cultural and philosophical traditions and are presented for inspiration and personal reflection only.',
  },
  {
    title: 'Accuracy',
    content: 'While we strive to provide accurate and helpful content, we make no warranties about the completeness, reliability, or accuracy of this information.',
  },
  {
    title: 'User Responsibility',
    content: 'Use of AXUNE and its features is at your own discretion and risk. You are solely responsible for how you use the information and tools provided in this application.',
  },
  {
    title: 'Limitation of Liability',
    content: 'To the maximum extent permitted by applicable law, AXUNE and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the application.',
  },
];

export default function DisclaimerScreen({ navigation }: { navigation: any }) {
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

      <Text style={[styles.title, { color: C.primaryText }]}>Disclaimer</Text>

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
  title: { fontFamily: Typography.serif, fontSize: 28, marginBottom: 20 },
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

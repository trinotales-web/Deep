import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, DarkColors, Typography } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/ThemedView';
import { SectionLabel } from '../../components/common/SectionLabel';

export default function AboutScreen({ navigation }: { navigation: any }) {
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

      <Text style={[styles.title, { color: C.primaryText }]}>About AXUNE</Text>

      <Card style={styles.card}>
        <Text style={[styles.body, { color: C.secondaryText }]}>
          AXUNE is a mindful self-care companion inspired by Japanese philosophy and the art of simple living. We believe that happiness is not found in grand achievements but in the gentle accumulation of small, intentional daily practices.
        </Text>
        <Text style={[styles.body, { color: C.secondaryText, marginTop: 12 }]}>
          AXUNE was created to help you build a life of peace, presence, and purpose through daily rituals, mindful habits, honest journaling, and moments of deep stillness.
        </Text>
        <Text style={[styles.body, { color: C.secondaryText, marginTop: 12 }]}>
          The name AXUNE represents the intersection of ancient wisdom and modern wellness — a space where timeless Japanese principles like wabi-sabi, kaizen, and teinei meet the needs of contemporary life.
        </Text>
      </Card>

      <Card style={styles.card}>
        <SectionLabel>Creator</SectionLabel>
        <Text style={[styles.body, { color: C.secondaryText }]}>
          Created with intention by Hiroto Takana, a Japanese-Indian creator and author based in Nagoya, Japan. Inspired by the journals of his grandfather Daiki, who believed that a simple life is the most beautiful life.
        </Text>
      </Card>

      <LinearGradient colors={['#3D3A35', '#4A463F']} style={[styles.card, styles.quoteCard]}>
        <Text style={styles.quoteText}>
          "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived."
        </Text>
        <Text style={styles.quoteSource}>— Henry David Thoreau, Walden</Text>
      </LinearGradient>

      <Card style={styles.card}>
        <SectionLabel>Details</SectionLabel>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: C.mutedText }]}>Version</Text>
          <Text style={[styles.detailValue, { color: C.primaryText }]}>1.0.0</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: C.mutedText }]}>Platform</Text>
          <Text style={[styles.detailValue, { color: C.primaryText }]}>iOS & Android</Text>
        </View>

        <View style={styles.linksRow}>
          {[
            { label: '🌐 Website', url: 'https://axune.app' },
            { label: '▶ YouTube', url: 'https://youtube.com/@axune' },
            { label: '📷 Instagram', url: 'https://instagram.com/axune.app' },
          ].map((link) => (
            <TouchableOpacity
              key={link.label}
              style={[styles.linkChip, { backgroundColor: C.background, borderColor: C.border }]}
              onPress={() => Linking.openURL(link.url)}
            >
              <Text style={[styles.linkChipText, { color: C.secondaryText }]}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => Linking.openURL('mailto:privacy@axune.app')}>
          <Text style={[styles.emailLink, { color: Colors.calmBlue }]}>privacy@axune.app</Text>
        </TouchableOpacity>
      </Card>

      <View style={styles.adFreeCard}>
        <Text style={styles.adFreeEmoji}>🌿</Text>
        <Text style={[styles.adFreeText, { color: C.tertiaryText }]}>
          AXUNE is ad-free and always will be. Your sanctuary should never be interrupted.
        </Text>
      </View>

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
  card: { marginBottom: 12 },
  body: { fontFamily: Typography.sans, fontSize: 14, lineHeight: 22 },
  quoteCard: { borderRadius: 20, padding: 24 },
  quoteText: {
    fontFamily: Typography.serifItalic,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 26,
    marginBottom: 12,
  },
  quoteSource: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: { fontFamily: Typography.sans, fontSize: 14 },
  detailValue: { fontFamily: Typography.sansMedium, fontSize: 14 },
  linksRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 16 },
  linkChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  linkChipText: { fontFamily: Typography.sans, fontSize: 13 },
  emailLink: {
    fontFamily: Typography.sans,
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  adFreeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  adFreeEmoji: { fontSize: 24 },
  adFreeText: {
    fontFamily: Typography.serifItalic,
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
});

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  Image,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { WELLNESS_GOALS } from '../../constants/content';
import { useApp } from '../../context/AppContext';
import { userStorage, habitStorage } from '../../lib/storage';
import { DEFAULT_HABITS } from '../../constants/content';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { user, setUser, setOnboardingDone } = useApp();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [wakeTime, setWakeTime] = useState('07:00');
  const [bedTime, setBedTime] = useState('22:00');
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const scrollRef = useRef<ScrollView>(null);

  const totalSteps = 4;

  function goToStep(s: number) {
    setStep(s);
    scrollRef.current?.scrollTo({ x: s * width, animated: true });
  }

  function toggleGoal(id: string) {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  async function handleComplete() {
    if (user) {
      const updated = {
        ...user,
        display_name: displayName.trim() || user.display_name,
        wellness_goals: selectedGoals,
        wake_time: wakeTime,
        bed_time: bedTime,
        updated_at: new Date().toISOString(),
      };
      await setUser(updated);
    }
    await setOnboardingDone();
    onComplete();
  }

  return (
    <View style={styles.container}>
      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            style={[styles.dot, step === i && styles.dotActive]}
          />
        ))}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Screen 1: Welcome */}
        <View style={[styles.screen, { width }]}>
          <Text style={styles.brand}>AXUNE</Text>
          <Text style={styles.tagline}>Your daily sanctuary</Text>
          <Text style={styles.welcomeText}>
            Welcome to a space of stillness and gentle growth. Here, you will cultivate daily rituals, track your well-being, and find moments of peace.
          </Text>
          <Text style={styles.subWelcome}>
            Inspired by Japanese philosophy and the art of simple living.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => goToStep(1)}>
            <Text style={styles.primaryBtnText}>Begin</Text>
          </TouchableOpacity>
        </View>

        {/* Screen 2: Wellness Goals */}
        <View style={[styles.screen, { width }]}>
          <Text style={styles.stepTitle}>What brings you here?</Text>
          <Text style={styles.stepSubtitle}>Select all that resonate with you</Text>
          <View style={styles.goalsGrid}>
            {WELLNESS_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalPill,
                  selectedGoals.includes(goal.id) && styles.goalPillSelected,
                ]}
                onPress={() => toggleGoal(goal.id)}
              >
                <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                <Text
                  style={[
                    styles.goalLabel,
                    selectedGoals.includes(goal.id) && styles.goalLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => goToStep(2)}>
            <Text style={styles.primaryBtnText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => goToStep(2)} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>

        {/* Screen 3: Schedule */}
        <View style={[styles.screen, { width }]}>
          <Text style={styles.stepTitle}>Your daily rhythm</Text>
          <Text style={styles.stepSubtitle}>
            Set your preferred times so AXUNE can support your morning and evening rituals
          </Text>

          <View style={styles.timeCard}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>🌅  Wake time</Text>
              <TextInput
                style={styles.timeInput}
                value={wakeTime}
                onChangeText={setWakeTime}
                placeholder="07:00"
                placeholderTextColor={Colors.mutedText}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>🌙  Bed time</Text>
              <TextInput
                style={styles.timeInput}
                value={bedTime}
                onChangeText={setBedTime}
                placeholder="22:00"
                placeholderTextColor={Colors.mutedText}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          <Text style={styles.timeNote}>
            You can change these anytime in your profile settings
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => goToStep(3)}>
            <Text style={styles.primaryBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Screen 4: Name */}
        <View style={[styles.screen, { width }]}>
          <Text style={styles.readyEmoji}>🌿</Text>
          <Text style={styles.stepTitle}>Your sanctuary is ready</Text>
          <Text style={styles.stepSubtitle}>What should we call you?</Text>

          <TextInput
            style={styles.nameInput}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            placeholderTextColor={Colors.mutedText}
            autoCapitalize="words"
          />

          <Text style={styles.readyMessage}>
            "The journey of a thousand miles begins with a single step." — Lao Tzu
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleComplete}>
            <Text style={styles.primaryBtnText}>Enter AXUNE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {step > 0 && (
        <TouchableOpacity onPress={() => goToStep(step - 1)} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primaryText,
    width: 20,
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  brand: {
    fontFamily: Typography.sansBold,
    fontSize: 32,
    letterSpacing: 8,
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontFamily: Typography.serifItalic,
    fontSize: 18,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontFamily: Typography.serif,
    fontSize: 17,
    color: Colors.primaryText,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
  },
  subWelcome: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: Colors.tertiaryText,
    textAlign: 'center',
    marginBottom: 48,
  },
  stepTitle: {
    fontFamily: Typography.serif,
    fontSize: 26,
    color: Colors.primaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontFamily: Typography.sans,
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    gap: 6,
  },
  goalPillSelected: {
    backgroundColor: Colors.primaryText,
    borderColor: Colors.primaryText,
  },
  goalEmoji: {
    fontSize: 16,
  },
  goalLabel: {
    fontFamily: Typography.sansMedium,
    fontSize: 13,
    color: Colors.primaryText,
  },
  goalLabelSelected: {
    color: '#fff',
  },
  primaryBtn: {
    backgroundColor: Colors.primaryText,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    fontFamily: Typography.sansMedium,
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.5,
  },
  skipBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: Colors.mutedText,
  },
  timeCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  timeDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  timeLabel: {
    fontFamily: Typography.sansMedium,
    fontSize: 15,
    color: Colors.primaryText,
  },
  timeInput: {
    fontFamily: Typography.serif,
    fontSize: 20,
    color: Colors.primaryText,
    textAlign: 'right',
    minWidth: 80,
  },
  timeNote: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: Colors.mutedText,
    textAlign: 'center',
    marginBottom: 24,
  },
  readyEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  nameInput: {
    fontFamily: Typography.serif,
    fontSize: 20,
    color: Colors.primaryText,
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  readyMessage: {
    fontFamily: Typography.serifItalic,
    fontSize: 14,
    color: Colors.tertiaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  backBtn: {
    position: 'absolute',
    top: 54,
    left: 20,
    padding: 10,
  },
  backText: {
    fontFamily: Typography.sans,
    fontSize: 14,
    color: Colors.secondaryText,
  },
});

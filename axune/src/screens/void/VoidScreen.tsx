import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography } from '../../constants/theme';
import { BREATHING_PATTERNS } from '../../constants/content';
import { meditationStorage } from '../../lib/storage';
import { today } from '../../lib/dateUtils';

const { width, height } = Dimensions.get('window');

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  anim: Animated.Value;
}

interface VoidScreenProps {
  visible: boolean;
  onClose: () => void;
  todayDate: string;
}

type VoidMode = 'select' | 'breathing_patterns' | 'breathing_active' | 'timer_select' | 'timer_active' | 'free_void';

const TIMER_DURATIONS = [2, 5, 10, 15, 20];

export default function VoidScreen({ visible, onClose, todayDate }: VoidScreenProps) {
  const [mode, setMode] = useState<VoidMode>('select');
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 3,
      opacity: 0.08 + Math.random() * 0.12,
      anim: new Animated.Value(0),
    }))
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Breathing
  const [selectedPattern, setSelectedPattern] = useState(BREATHING_PATTERNS[0]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const breathScaleAnim = useRef(new Animated.Value(1)).current;
  const breathActive = useRef(false);
  const phaseRef = useRef(0);
  const cycleRef = useRef(0);
  const patternRef = useRef(BREATHING_PATTERNS[0]);

  // Timer
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerDone, setTimerDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStart = useRef<number>(0);
  const [freeSeconds, setFreeSeconds] = useState(0);
  const freeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
      startParticles();
    }
  }, [visible]);

  function startParticles() {
    particles.forEach((p) => {
      const loop = () => {
        Animated.sequence([
          Animated.timing(p.anim, {
            toValue: 1,
            duration: 3000 + Math.random() * 5000,
            useNativeDriver: true,
          }),
          Animated.timing(p.anim, {
            toValue: 0,
            duration: 3000 + Math.random() * 5000,
            useNativeDriver: true,
          }),
        ]).start(loop);
      };
      loop();
    });
  }

  // Breathing animation
  function runBreathingCycle(pattern: typeof BREATHING_PATTERNS[0], pIdx: number) {
    if (!breathActive.current) return;
    const phase = pattern.phases[pIdx];
    const targetScale = phase.label.includes('in') ? 1.25 : phase.label === 'hold' ? 1.25 : 0.8;

    Animated.timing(breathScaleAnim, {
      toValue: targetScale,
      duration: phase.duration,
      useNativeDriver: true,
    }).start(() => {
      if (!breathActive.current) return;
      const nextIdx = (pIdx + 1) % pattern.phases.length;
      phaseRef.current = nextIdx;
      setPhaseIndex(nextIdx);
      if (nextIdx === 0) {
        cycleRef.current += 1;
        setCycleCount(cycleRef.current);
      }
      runBreathingCycle(pattern, nextIdx);
    });
  }

  function startBreathing() {
    breathActive.current = true;
    phaseRef.current = 0;
    cycleRef.current = 0;
    setPhaseIndex(0);
    setCycleCount(0);
    sessionStart.current = Date.now();
    breathScaleAnim.setValue(1);
    setMode('breathing_active');
    patternRef.current = selectedPattern;
    setTimeout(() => runBreathingCycle(selectedPattern, 0), 100);
  }

  async function stopBreathing() {
    breathActive.current = false;
    breathScaleAnim.stopAnimation();
    const duration = Math.round((Date.now() - sessionStart.current) / 1000);
    await meditationStorage.saveSession({
      date: todayDate,
      type: 'breathing',
      pattern: patternRef.current.name,
      duration_seconds: duration,
      breath_cycles: cycleRef.current,
    });
    setMode('select');
  }

  // Timer
  function startTimer() {
    sessionStart.current = Date.now();
    const total = selectedDuration * 60;
    setTimeLeft(total);
    setTimerDone(false);
    setMode('timer_active');
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = Math.round((Date.now() - sessionStart.current) / 1000);
    await meditationStorage.saveSession({
      date: todayDate,
      type: 'timed_silence',
      duration_seconds: duration,
    });
    setMode('select');
    setTimerDone(false);
  }

  // Free void
  function startFreeVoid() {
    sessionStart.current = Date.now();
    setFreeSeconds(0);
    setMode('free_void');
    freeTimerRef.current = setInterval(() => {
      setFreeSeconds((s) => s + 1);
    }, 1000);
  }

  async function stopFreeVoid() {
    if (freeTimerRef.current) clearInterval(freeTimerRef.current);
    const duration = Math.round((Date.now() - sessionStart.current) / 1000);
    await meditationStorage.saveSession({
      date: todayDate,
      type: 'free_void',
      duration_seconds: duration,
    });
    setMode('select');
  }

  function handleClose() {
    breathActive.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    if (freeTimerRef.current) clearInterval(freeTimerRef.current);
    setMode('select');
    onClose();
  }

  function formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  const currentPhase = selectedPattern?.phases[phaseIndex];

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <StatusBar hidden />
      <View style={styles.container}>
        {/* Particles */}
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                opacity: p.anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [p.opacity * 0.3, p.opacity, p.opacity * 0.3],
                }),
              },
            ]}
          />
        ))}

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* SELECTION SCREEN */}
          {mode === 'select' && (
            <View style={styles.centerContent}>
              <Text style={styles.voidLabel}>THE VOID</Text>
              <Text style={styles.voidTitle}>Enter stillness</Text>

              <View style={styles.choiceGrid}>
                <TouchableOpacity
                  style={styles.choiceBtn}
                  onPress={() => setMode('breathing_patterns')}
                >
                  <Text style={styles.choiceBtnTitle}>Guided Breathing</Text>
                  <Text style={styles.choiceBtnSub}>Multiple patterns available</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choiceBtn}
                  onPress={() => setMode('timer_select')}
                >
                  <Text style={styles.choiceBtnTitle}>Timed Silence</Text>
                  <Text style={styles.choiceBtnSub}>Choose your duration</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.choiceBtn} onPress={startFreeVoid}>
                  <Text style={styles.choiceBtnTitle}>Free Void</Text>
                  <Text style={styles.choiceBtnSub}>Infinite stillness</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>Return</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* BREATHING PATTERNS */}
          {mode === 'breathing_patterns' && (
            <View style={styles.centerContent}>
              <Text style={styles.sectionTitle}>Choose a Pattern</Text>
              <View style={styles.patternList}>
                {BREATHING_PATTERNS.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.patternBtn,
                      selectedPattern.id === p.id && styles.patternBtnSelected,
                    ]}
                    onPress={() => setSelectedPattern(p)}
                  >
                    <Text style={styles.patternName}>{p.name}</Text>
                    <Text style={styles.patternDetail}>
                      {p.phases.map((ph) => `${ph.duration / 1000}s`).join(' · ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.startBtn} onPress={startBreathing}>
                <Text style={styles.startBtnText}>Begin</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode('select')} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* BREATHING ACTIVE */}
          {mode === 'breathing_active' && (
            <View style={styles.centerContent}>
              <Animated.View
                style={[
                  styles.breathCircle,
                  { transform: [{ scale: breathScaleAnim }] },
                ]}
              >
                <Text style={styles.breathPhaseText}>{currentPhase?.label || ''}</Text>
              </Animated.View>
              <Text style={styles.cycleCount}>Cycle {cycleCount + 1}</Text>
              <Text style={styles.patternNameActive}>{selectedPattern.name}</Text>
              <TouchableOpacity onPress={stopBreathing} style={styles.returnBtn}>
                <Text style={styles.returnBtnText}>Return</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TIMER SELECT */}
          {mode === 'timer_select' && (
            <View style={styles.centerContent}>
              <Text style={styles.sectionTitle}>Choose Duration</Text>
              <View style={styles.durationRow}>
                {TIMER_DURATIONS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.durationBtn,
                      selectedDuration === d && styles.durationBtnSelected,
                    ]}
                    onPress={() => setSelectedDuration(d)}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        selectedDuration === d && { color: '#fff' },
                      ]}
                    >
                      {d} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.startBtn} onPress={startTimer}>
                <Text style={styles.startBtnText}>Begin Silence</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode('select')} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TIMER ACTIVE */}
          {mode === 'timer_active' && (
            <View style={styles.centerContent}>
              {timerDone ? (
                <>
                  <Text style={styles.timerDoneText}>Your silence is complete</Text>
                  <TouchableOpacity onPress={stopTimer} style={styles.returnBtn}>
                    <Text style={styles.returnBtnText}>Return</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
                  <Text style={styles.timerSub}>remaining</Text>
                  <TouchableOpacity onPress={stopTimer} style={[styles.returnBtn, { marginTop: 48 }]}>
                    <Text style={styles.returnBtnText}>Return</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* FREE VOID */}
          {mode === 'free_void' && (
            <View style={styles.centerContent}>
              <Text style={styles.freeTimer}>{formatTime(freeSeconds)}</Text>
              <Text style={styles.freeLabel}>in the void</Text>
              <TouchableOpacity onPress={stopFreeVoid} style={[styles.returnBtn, { marginTop: 48 }]}>
                <Text style={styles.returnBtnText}>Return</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,252,245,0.9)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  voidLabel: {
    fontFamily: Typography.sansMedium,
    fontSize: 13,
    letterSpacing: 7,
    color: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  voidTitle: {
    fontFamily: Typography.serifItalic,
    fontSize: 30,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 48,
  },
  choiceGrid: { width: '100%', gap: 12, marginBottom: 32 },
  choiceBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  choiceBtnTitle: {
    fontFamily: Typography.sansMedium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  choiceBtnSub: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
  closeBtn: { marginTop: 8 },
  closeBtnText: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontFamily: Typography.serifItalic,
    fontSize: 24,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 24,
  },
  patternList: { width: '100%', gap: 10, marginBottom: 28 },
  patternBtn: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  patternBtnSelected: {
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  patternName: {
    fontFamily: Typography.sansMedium,
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 4,
  },
  patternDetail: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
  startBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginBottom: 16,
  },
  startBtnText: {
    fontFamily: Typography.sansMedium,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  backBtn: { marginTop: 4 },
  backBtnText: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: 'rgba(255,255,255,0.25)',
  },
  breathCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  breathPhaseText: {
    fontFamily: Typography.serifItalic,
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
  },
  cycleCount: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 2,
    marginBottom: 8,
  },
  patternNameActive: {
    fontFamily: Typography.sans,
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1,
    marginBottom: 48,
  },
  returnBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 24,
  },
  returnBtnText: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  durationBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  durationBtnSelected: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  durationText: {
    fontFamily: Typography.sansMedium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  timerDisplay: {
    fontFamily: Typography.serif,
    fontSize: 60,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 2,
  },
  timerSub: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 3,
    marginTop: 8,
  },
  timerDoneText: {
    fontFamily: Typography.serifItalic,
    fontSize: 24,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: 32,
  },
  freeTimer: {
    fontFamily: Typography.serif,
    fontSize: 52,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
  freeLabel: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.15)',
    letterSpacing: 3,
    marginTop: 8,
  },
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography } from '../../constants/theme';
import { focusStorage } from '../../lib/storage';
import { today } from '../../lib/dateUtils';
import { Card } from '../../components/common/ThemedView';
import { SectionLabel } from '../../components/common/SectionLabel';

const DURATIONS = [15, 25, 30, 45];
const BREAK_DURATION = 5;
const RING_SIZE = 160;
const STROKE_WIDTH = 8;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface FocusTimerProps {
  darkMode: boolean;
  C: any;
  todayDate: string;
}

export default function FocusTimer({ darkMode, C, todayDate }: FocusTimerProps) {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startTimer() {
    const dur = isBreak ? BREAK_DURATION * 60 : selectedDuration * 60;
    setTimeLeft(dur);
    setTotalTime(dur);
    setIsRunning(true);
    setIsPaused(false);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleTimerEnd() {
    setIsRunning(false);
    if (!isBreak) {
      setSessions((s) => s + 1);
      await focusStorage.saveSession({
        date: todayDate,
        duration_minutes: selectedDuration,
        completed: true,
      });
      setIsBreak(true);
      setTimeLeft(BREAK_DURATION * 60);
      setTotalTime(BREAK_DURATION * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(selectedDuration * 60);
      setTotalTime(selectedDuration * 60);
    }
  }

  function pauseTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPaused(true);
    setIsRunning(false);
  }

  function resumeTimer() {
    setIsRunning(true);
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function resetTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setIsBreak(false);
    setTimeLeft(selectedDuration * 60);
    setTotalTime(selectedDuration * 60);
  }

  function formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const ringColor = isBreak ? Colors.warmGold : Colors.sageGreen;

  return (
    <View>
      <Card style={styles.card}>
        <SectionLabel>{isBreak ? 'Break Time' : 'Focus Session'}</SectionLabel>

        {/* Ring */}
        <View style={styles.ringContainer}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={C.border || '#E8E3DB'}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={ringColor}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90, ${RING_SIZE / 2}, ${RING_SIZE / 2})`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={[styles.timerText, { color: C.primaryText }]}>{formatTime(timeLeft)}</Text>
            <Text style={[styles.timerSub, { color: C.mutedText }]}>
              {isBreak ? 'break' : 'focus'}
            </Text>
          </View>
        </View>

        {/* Duration Picker */}
        {!isRunning && !isPaused && !isBreak && (
          <View style={styles.durRow}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => {
                  setSelectedDuration(d);
                  setTimeLeft(d * 60);
                  setTotalTime(d * 60);
                }}
                style={[
                  styles.durBtn,
                  {
                    backgroundColor: selectedDuration === d ? ringColor : C.background,
                    borderColor: selectedDuration === d ? ringColor : C.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.durText,
                    { color: selectedDuration === d ? '#fff' : C.primaryText },
                  ]}
                >
                  {d}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Controls */}
        <View style={styles.controlsRow}>
          {!isRunning && !isPaused && (
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: ringColor }]} onPress={startTimer}>
              <Text style={styles.startBtnText}>{isBreak ? 'Start Break' : 'Start Focus'}</Text>
            </TouchableOpacity>
          )}
          {isRunning && (
            <TouchableOpacity style={[styles.controlBtn, { borderColor: C.border }]} onPress={pauseTimer}>
              <Text style={[styles.controlBtnText, { color: C.primaryText }]}>Pause</Text>
            </TouchableOpacity>
          )}
          {isPaused && (
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: ringColor }]} onPress={resumeTimer}>
              <Text style={styles.startBtnText}>Resume</Text>
            </TouchableOpacity>
          )}
          {(isRunning || isPaused) && (
            <TouchableOpacity style={[styles.controlBtn, { borderColor: C.border }]} onPress={resetTimer}>
              <Text style={[styles.controlBtnText, { color: C.tertiaryText }]}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.sessionsText, { color: C.mutedText }]}>
          {sessions} session{sessions !== 1 ? 's' : ''} today
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerText: {
    fontFamily: Typography.serif,
    fontSize: 36,
  },
  timerSub: {
    fontFamily: Typography.sans,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 2,
  },
  durRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  durBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  durText: { fontFamily: Typography.sansMedium, fontSize: 14 },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  startBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  startBtnText: { fontFamily: Typography.sansMedium, fontSize: 15, color: '#fff' },
  controlBtn: {
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  controlBtnText: { fontFamily: Typography.sansMedium, fontSize: 15 },
  sessionsText: {
    fontFamily: Typography.sans,
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
});

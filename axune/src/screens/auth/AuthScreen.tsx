import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { userStorage } from '../../lib/storage';
import { DEFAULT_HABITS } from '../../constants/content';
import { habitStorage } from '../../lib/storage';
import { today } from '../../lib/dateUtils';

interface AuthScreenProps {
  onAuth: () => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const { setUser } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      Alert.alert('Please enter your email');
      return;
    }

    if (mode === 'forgot') {
      Alert.alert('Password Reset', 'If an account exists for ' + email + ', a reset link will be sent.');
      setMode('login');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      // For demo: create local user account
      // In production: use supabase.auth.signUp / signInWithPassword
      const userId = `user_${Date.now()}`;
      const now = new Date().toISOString();

      const newUser = {
        id: userId,
        email: email.trim(),
        display_name: name.trim() || email.split('@')[0],
        avatar_url: undefined,
        timezone: 'UTC',
        wake_time: '07:00',
        bed_time: '22:00',
        water_goal: 8,
        wellness_goals: [],
        dark_mode: false,
        notifications: true,
        haptics: true,
        sounds: true,
        created_at: now,
        updated_at: now,
      };

      await setUser(newUser);

      if (mode === 'signup') {
        // Create default habits
        const habits = DEFAULT_HABITS.map((h, i) => ({
          id: `habit_${Date.now()}_${i}`,
          user_id: userId,
          name: h.name,
          icon: h.icon,
          sort_order: i,
          is_active: true,
          created_at: new Date().toISOString(),
        }));
        await habitStorage.saveHabits(habits);
      }

      onAuth();
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGuest() {
    const userId = `guest_${Date.now()}`;
    const now = new Date().toISOString();
    const guestUser = {
      id: userId,
      email: 'guest@axune.app',
      display_name: 'Guest',
      timezone: 'UTC',
      wake_time: '07:00',
      bed_time: '22:00',
      water_goal: 8,
      wellness_goals: [],
      dark_mode: false,
      notifications: false,
      haptics: true,
      sounds: true,
      created_at: now,
      updated_at: now,
    };
    await setUser(guestUser);
    const habits = DEFAULT_HABITS.map((h, i) => ({
      id: `habit_${Date.now()}_${i}`,
      user_id: userId,
      name: h.name,
      icon: h.icon,
      sort_order: i,
      is_active: true,
      created_at: now,
    }));
    await habitStorage.saveHabits(habits);
    onAuth();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>AXUNE</Text>
          <Text style={styles.tagline}>Your daily sanctuary</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>
            {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Begin your practice' : 'Reset password'}
          </Text>

          {mode === 'signup' && (
            <TextInput
              style={styles.input}
              placeholder="Display name"
              placeholderTextColor={Colors.mutedText}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={Colors.mutedText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {mode !== 'forgot' && (
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.mutedText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          )}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              </Text>
            )}
          </TouchableOpacity>

          {mode === 'login' && (
            <TouchableOpacity onPress={() => setMode('forgot')} style={styles.linkBtn}>
              <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.oauthBtn}>
            <Text style={styles.oauthBtnText}>🔑  Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.oauthBtn, styles.appleBtn]}>
            <Text style={[styles.oauthBtnText, { color: '#fff' }]}>  Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={styles.switchBtn}
          >
            <Text style={styles.switchText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.switchTextBold}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  brand: {
    fontFamily: Typography.sansBold,
    fontSize: 28,
    letterSpacing: 8,
    color: Colors.primaryText,
  },
  tagline: {
    fontFamily: Typography.serifItalic,
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 8,
  },
  form: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.serif,
    fontSize: 26,
    color: Colors.primaryText,
    marginBottom: 24,
  },
  input: {
    fontFamily: Typography.sans,
    fontSize: 15,
    color: Colors.primaryText,
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: Colors.primaryText,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  primaryBtnText: {
    fontFamily: Typography.sansMedium,
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.5,
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 16,
  },
  linkText: {
    fontFamily: Typography.sans,
    fontSize: 13,
    color: Colors.tertiaryText,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: Typography.sans,
    fontSize: 12,
    color: Colors.mutedText,
    marginHorizontal: 12,
  },
  oauthBtn: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  appleBtn: {
    backgroundColor: '#1A1815',
    borderColor: '#1A1815',
  },
  oauthBtnText: {
    fontFamily: Typography.sansMedium,
    fontSize: 15,
    color: Colors.primaryText,
  },
  guestBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  guestBtnText: {
    fontFamily: Typography.sans,
    fontSize: 14,
    color: Colors.tertiaryText,
    textDecorationLine: 'underline',
  },
  switchBtn: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  switchText: {
    fontFamily: Typography.sans,
    fontSize: 14,
    color: Colors.tertiaryText,
  },
  switchTextBold: {
    fontFamily: Typography.sansBold,
    color: Colors.primaryText,
  },
});

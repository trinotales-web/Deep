import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Colors, DarkColors, Shadow, BorderRadius } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  dark?: boolean;
  noPad?: boolean;
}

export function Card({ children, style, dark, noPad }: CardProps) {
  const { darkMode } = useApp();
  const bg = dark
    ? 'transparent'
    : darkMode
    ? DarkColors.cardBg
    : Colors.cardBg;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bg },
        !dark && Shadow.card,
        noPad && { padding: 0 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 12,
  },
});

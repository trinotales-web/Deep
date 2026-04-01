import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, DarkColors, Typography } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

interface SectionLabelProps {
  children: string;
  light?: boolean;
}

export function SectionLabel({ children, light }: SectionLabelProps) {
  const { darkMode } = useApp();
  const color = light
    ? 'rgba(255,255,255,0.35)'
    : darkMode
    ? DarkColors.mutedText
    : Colors.mutedText;

  return (
    <Text style={[styles.label, { color }]}>
      {children.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: Typography.sansMedium,
    fontSize: 11,
    letterSpacing: 3,
    marginBottom: 8,
  },
});

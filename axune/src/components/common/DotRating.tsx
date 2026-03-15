import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface DotRatingProps {
  value: number;
  onChange: (v: number) => void;
  color: string;
  size?: number;
  max?: number;
}

export function DotRating({ value, onChange, color, size = 14, max = 5 }: DotRatingProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onChange(i + 1)}
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: i < value ? color : 'rgba(0,0,0,0.1)',
              marginRight: i < max - 1 ? 8 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {},
});

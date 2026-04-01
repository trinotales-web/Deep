import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors, DarkColors, Typography } from '../../constants/theme';

const TAB_ICONS: Record<string, string> = {
  Home: '◯',
  Habits: '◈',
  Wellness: '❋',
  Journal: '✎',
};

export function CustomTabBar({ state, descriptors, navigation, darkMode, onVoidPress }: BottomTabBarProps & { darkMode: boolean; onVoidPress: () => void }) {
  const C = darkMode ? DarkColors : Colors;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkMode ? 'rgba(26,24,21,0.92)' : 'rgba(246,243,238,0.92)',
          borderTopColor: C.border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        if (route.name === 'VoidTab') {
          return (
            <TouchableOpacity
              key="void"
              style={styles.tab}
              onPress={onVoidPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabIcon, { color: C.navInactive }]}>◉</Text>
              <Text style={[styles.tabLabel, { color: C.navInactive }]}>VOID</Text>
            </TouchableOpacity>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icon = TAB_ICONS[route.name] || '○';
        const label = route.name.toUpperCase();

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabIcon,
                { color: isFocused ? C.navActive : C.navInactive },
              ]}
            >
              {icon}
            </Text>
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? C.navActive : C.navInactive },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontFamily: Typography.sansMedium,
    fontSize: 9.5,
    letterSpacing: 1,
  },
});

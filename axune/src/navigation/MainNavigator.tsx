import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { CustomTabBar } from '../components/navigation/TabBar';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import HabitsScreen from '../screens/habits/HabitsScreen';
import WellnessScreen from '../screens/wellness/WellnessScreen';
import JournalScreen from '../screens/journal/JournalScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AboutScreen from '../screens/about/AboutScreen';
import PrivacyScreen from '../screens/about/PrivacyScreen';
import DisclaimerScreen from '../screens/about/DisclaimerScreen';
import VoidScreen from '../screens/void/VoidScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator({ onVoidPress }: { onVoidPress: () => void }) {
  const { darkMode } = useApp();

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <CustomTabBar {...props} darkMode={darkMode} onVoidPress={onVoidPress} />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} openVoid={onVoidPress} />}
      </Tab.Screen>
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Wellness" component={WellnessScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="VoidTab" component={EmptyScreen} />
    </Tab.Navigator>
  );
}

function EmptyScreen() {
  return null;
}

export default function MainNavigator() {
  const [voidVisible, setVoidVisible] = useState(false);
  const { todayDate } = useApp();

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs">
          {() => <TabNavigator onVoidPress={() => setVoidVisible(true)} />}
        </Stack.Screen>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
      </Stack.Navigator>

      <VoidScreen
        visible={voidVisible}
        onClose={() => setVoidVisible(false)}
        todayDate={todayDate}
      />
    </>
  );
}

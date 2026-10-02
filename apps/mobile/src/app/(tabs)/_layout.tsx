import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import { Home, Search, Inbox, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  const { inboxCount, openAddSheet } = useDocly();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + Math.max(insets.bottom, 10),
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ],
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.ink,
        tabBarInactiveTintColor: '#A3B3AB',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={22} color={color} strokeWidth={focused ? 2.8 : 2.2} />
          ),
        }}
        listeners={{
          tabPress: () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {}
          },
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <Search size={22} color={color} strokeWidth={focused ? 2.8 : 2.2} />
          ),
        }}
        listeners={{
          tabPress: () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {}
          },
        }}
      />

      <Tabs.Screen
        name="add-placeholder"
        options={{
          title: '',
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.plusButton}
              onPress={openAddSheet}
            >
              <Plus size={28} color={Colors.ink} strokeWidth={3.5} />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Inbox size={22} color={color} strokeWidth={focused ? 2.8 : 2.2} />
              {inboxCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{inboxCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {}
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.card,
    borderTopWidth: 2,
    borderTopColor: Colors.line,
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  tabLabel: {
    fontFamily: Typography.displayBold,
    fontSize: 11,
    marginTop: 2,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: Colors.coral,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.coralDark,
  },
  badgeText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 10,
    color: '#FFF',
  },
  plusButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.marigold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    borderWidth: 2.5,
    borderColor: '#FFF',
    borderBottomWidth: 4.5,
    borderBottomColor: Colors.marigoldDark,
    shadowColor: Colors.marigoldDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});

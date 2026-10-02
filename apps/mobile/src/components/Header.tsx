import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Radii } from '@/constants/theme';
import { Settings } from 'lucide-react-native';

interface HeaderProps {
  greeting?: string;
  name?: string;
  subtitle?: string;
}

export function Header({
  greeting = 'Good evening',
  name = 'Anirudh',
  subtitle = '128 documents · all safe in your Drive ☁️',
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.avatar}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.greeting}>
            {greeting},{'\n'}{name} 👋
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.iconBtn}
          onPress={() => router.push('/settings')}
        >
          <Settings size={20} color={Colors.ink} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 14,
    paddingBottom: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.grape,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.18)',
  },
  avatarText: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: '#FFF',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  greeting: {
    fontFamily: Typography.displayBold,
    fontSize: 24,
    color: Colors.ink,
    lineHeight: 28,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.muted,
    marginTop: 2,
  },
});

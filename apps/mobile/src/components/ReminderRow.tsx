import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ExpiryReminder } from '@docly/shared';
import { Colors, Typography, Radii } from '@/constants/theme';

interface ReminderRowProps {
  reminder: ExpiryReminder;
  onPress: () => void;
}

export function ReminderRow({ reminder, onPress }: ReminderRowProps) {
  const isWarn = reminder.status === 'warn';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{reminder.emoji}</Text>
      
      <View style={styles.content}>
        <Text style={styles.title}>{reminder.title}</Text>
        <Text style={styles.expiry}>{reminder.expiryDate}</Text>
      </View>

      <View
        style={[
          styles.pill,
          isWarn ? styles.pillWarn : styles.pillOk,
        ]}
      >
        <Text
          style={[
            styles.pillText,
            isWarn ? styles.pillWarnText : styles.pillOkText,
          ]}
        >
          {reminder.pillText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  emoji: {
    fontSize: 22,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.displayBold,
    fontSize: 14.5,
    color: Colors.ink,
  },
  expiry: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radii.full,
  },
  pillWarn: {
    backgroundColor: Colors.yellowBg,
  },
  pillWarnText: {
    color: Colors.yellowText,
  },
  pillOk: {
    backgroundColor: Colors.mintLight,
  },
  pillOkText: {
    color: Colors.mintText,
  },
  pillText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
  },
});

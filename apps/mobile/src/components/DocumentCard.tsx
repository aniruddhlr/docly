import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DocumentItem } from '@docly/shared';
import { Colors, Typography, Radii } from '@/constants/theme';

interface DocumentCardProps {
  document: DocumentItem;
  onPress: () => void;
  showStatus?: boolean;
}

export function DocumentCard({
  document,
  onPress,
  showStatus = true,
}: DocumentCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={onPress}
    >
      <View style={[styles.emojiBox, { backgroundColor: document.bgColor }]}>
        <Text style={styles.emoji}>{document.emoji}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {document.title}
        </Text>
        <Text style={styles.path} numberOfLines={1}>
          {document.path}
        </Text>
      </View>

      <View style={styles.right}>
        {showStatus && (
          <Text style={styles.statusText}>✓ organised</Text>
        )}
        <Text style={styles.timeText}>{document.addedTime}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  emojiBox: {
    width: 42,
    height: 42,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: Colors.ink,
  },
  path: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11,
    color: Colors.mintDark,
  },
  timeText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    color: '#A3B3AB',
    marginTop: 2,
  },
});

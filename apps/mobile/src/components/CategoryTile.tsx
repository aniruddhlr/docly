import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CategoryInfo } from '@docly/shared';
import { Typography, Radii } from '@/constants/theme';

interface CategoryTileProps {
  category: CategoryInfo;
  onPress: () => void;
}

export function CategoryTile({ category, onPress }: CategoryTileProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.tile,
        {
          backgroundColor: category.bg,
          borderColor: category.borderColor,
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{category.emoji}</Text>
      <Text style={[styles.name, { color: category.color }]}>{category.name}</Text>
      <Text style={[styles.count, { color: category.color }]}>
        {category.count} documents
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: Radii.lg,
    padding: 14,
    borderWidth: 2,
    borderBottomWidth: 3.5,
    minHeight: 96,
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: 26,
  },
  name: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    marginTop: 4,
  },
  count: {
    fontFamily: Typography.bodyBold,
    fontSize: 12,
    opacity: 0.8,
  },
});

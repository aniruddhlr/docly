import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Radii } from '@/constants/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(150)}
      style={styles.container}
    >
      <View style={styles.bubble}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 96,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
    pointerEvents: 'none',
  },
  bubble: {
    backgroundColor: Colors.ink,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Radii.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  text: {
    color: Colors.cream,
    fontSize: 13.5,
    fontFamily: Typography.bodyBold,
    textAlign: 'center',
  },
});

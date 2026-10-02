import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const STEPS = [
  'Reading document',
  'Identifying document',
  'Extracting details',
  'Finding dates',
  'Organizing',
];

export default function ProcessingScreen() {
  const router = useRouter();
  const { setLatestProcessedDoc, documents } = useDocly();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);

  const progress = useSharedValue(0);

  useEffect(() => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex <= STEPS.length) {
        setCurrentStep(stepIndex);
        setCompletedSteps((prev) => [...prev, stepIndex - 1]);
        progress.value = withTiming(stepIndex / STEPS.length, { duration: 400 });

        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}

        if (stepIndex === STEPS.length) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch {}
          }, 350);
        }
      }
    }, 750);

    return () => clearInterval(interval);
  }, []);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  const handleFinish = () => {
    setLatestProcessedDoc(documents[0]);
    router.replace('/result');
  };

  const percentage = Math.round((completedSteps.length / STEPS.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.fileBadge}>
          <Text style={styles.fileBadgeText}>📄 scan_20261003_2016.pdf</Text>
        </View>

        <Text style={styles.sparkle}>✨</Text>
        <Text style={styles.title}>{isDone ? 'Done! 🎉' : 'Organising…'}</Text>

        {/* Steps List */}
        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isActive = currentStep === index && !isCompleted;

            return (
              <View key={index} style={styles.stepRow}>
                <View
                  style={[
                    styles.dot,
                    isCompleted && styles.dotCompleted,
                    isActive && styles.dotActive,
                  ]}
                >
                  {isCompleted ? (
                    <Text style={styles.checkText}>✓</Text>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.stepText,
                    isCompleted && styles.stepTextCompleted,
                    isActive && styles.stepTextActive,
                  ]}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, progressStyle]} />
        </View>

        <Text style={styles.percentageText}>{percentage}%</Text>

        {/* Action Button */}
        {isDone && (
          <Animated.View entering={FadeIn.duration(250)} style={{ width: '100%', marginTop: 20 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.doneBtn}
              onPress={handleFinish}
            >
              <Text style={styles.doneBtnText}>See what I found →</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  fileBadge: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  fileBadgeText: {
    fontFamily: Typography.bodyBold,
    fontSize: 13.5,
    color: Colors.ink,
  },
  sparkle: {
    fontSize: 34,
    marginBottom: 6,
  },
  title: {
    fontFamily: Typography.displayBold,
    fontSize: 26,
    color: Colors.ink,
    marginBottom: 20,
  },
  stepsContainer: {
    width: '100%',
    marginVertical: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: '#E3D5B6',
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dotActive: {
    borderColor: Colors.marigold,
    backgroundColor: Colors.marigold,
  },
  dotCompleted: {
    borderColor: Colors.mint,
    backgroundColor: Colors.mint,
  },
  checkText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 12,
    color: '#06301E',
  },
  stepText: {
    fontFamily: Typography.bodyBold,
    fontSize: 15,
    color: '#C4B691',
  },
  stepTextActive: {
    color: Colors.ink,
  },
  stepTextCompleted: {
    color: Colors.ink,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#F2E7CB',
    borderRadius: Radii.full,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.marigold,
    borderRadius: Radii.full,
  },
  percentageText: {
    fontFamily: Typography.bodyBold,
    fontSize: 13,
    color: Colors.muted,
    marginTop: 8,
  },
  doneBtn: {
    backgroundColor: Colors.mint,
    borderRadius: Radii.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.mintDark,
  },
  doneBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: '#06301E',
  },
});

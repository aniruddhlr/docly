import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

const SLIDES = [
  {
    art: '🗂️',
    title: 'Your documents,\nfinally organized.',
    desc: 'Keep everything in your own Google Drive. Docly just makes it findable.',
    buttonText: 'Continue',
    scopeNote: '',
  },
  {
    art: '📸 → ✨',
    title: 'Snap anything.',
    desc: 'We’ll read it, understand it, and organize it — bills, policies, IDs, invoices.',
    buttonText: 'Continue',
    scopeNote: '',
  },
  {
    art: '☁️',
    title: 'Connect Google Drive',
    desc: 'Your files stay in your Google Drive. Always.',
    buttonText: 'Connect Google Drive',
    scopeNote: '🔒 Only the files you give Docly — never your whole Drive.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { toast } = useDocly();
  const [slideIndex, setSlideIndex] = useState(0);

  const curSlide = SLIDES[slideIndex];

  const handleNext = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex((prev) => prev + 1);
    } else {
      toast('Google Drive connected ✓');
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.artContainer}>
          <Text style={styles.artText}>{curSlide.art}</Text>
        </View>

        <Text style={styles.title}>{curSlide.title}</Text>
        <Text style={styles.desc}>{curSlide.desc}</Text>

        <View style={styles.spacer} />

        {/* Dot Indicators */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                slideIndex === i && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.btn}
          onPress={handleNext}
        >
          <Text style={styles.btnText}>{curSlide.buttonText}</Text>
        </TouchableOpacity>

        {curSlide.scopeNote ? (
          <Text style={styles.scopeNote}>{curSlide.scopeNote}</Text>
        ) : (
          <View style={{ height: 20 }} />
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
    paddingHorizontal: 34,
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    alignItems: 'center',
  },
  artContainer: {
    marginTop: 60,
    marginBottom: 36,
  },
  artText: {
    fontSize: 70,
  },
  title: {
    fontFamily: Typography.displayBold,
    fontSize: 28,
    color: Colors.ink,
    textAlign: 'center',
    lineHeight: 34,
  },
  desc: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 22,
    maxWidth: 290,
  },
  spacer: {
    flex: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E3D5B6',
  },
  dotActive: {
    width: 24,
    borderRadius: 5,
    backgroundColor: Colors.marigold,
  },
  btn: {
    width: '100%',
    backgroundColor: Colors.marigold,
    borderRadius: Radii.lg,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.marigoldDark,
  },
  btnText: {
    fontFamily: Typography.displayBold,
    fontSize: 17,
    color: Colors.ink,
  },
  scopeNote: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 12,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

export default function ResultScreen() {
  const router = useRouter();
  const { latestProcessedDoc, documents, toast, resolveInboxItem } = useDocly();

  const doc = latestProcessedDoc || documents[0];

  const handleConfirm = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    toast('Nice! Saved to your documents ✓');
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 600);
  };

  const handleNotQuite = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
    toast('Moved to Inbox — tell me where it goes 📥');
    setTimeout(() => {
      router.replace('/(tabs)/inbox');
    }, 600);
  };

  const handleOpenDoc = () => {
    router.replace(`/document/${doc.id}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Got it! 🎉</Text>
        <Text style={styles.subtitle}>I know exactly what this is.</Text>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={[styles.heroEmoji, { backgroundColor: doc.bgColor }]}>
              <Text style={styles.emojiText}>{doc.emoji}</Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroTitle}>{doc.title}</Text>
              <Text style={styles.heroRename}>
                Tata AIG · renamed to “Tata AIG Car Insurance — 2026.pdf”
              </Text>
            </View>
          </View>

          <View style={styles.heroHighlightLine}>
            <Text style={styles.highlightText}>
              🗓️ 24 Sep 2026 → 23 Sep 2027
            </Text>
          </View>

          <View style={styles.heroHighlightLine}>
            <Text style={styles.highlightText}>
              🚙 23 BH 764 &nbsp;·&nbsp; 💰 ₹18,450
            </Text>
          </View>

          <View style={styles.savedToRow}>
            <Text style={styles.savedToLabel}>Saved to </Text>
            <View style={styles.folderPill}>
              <Text style={styles.folderPillText}>🛡 Insurance / Vehicle</Text>
            </View>
            <View style={styles.drivePill}>
              <Text style={styles.drivePillText}>☁️ in your Google Drive</Text>
            </View>
          </View>
        </View>

        {/* Confirmation Question */}
        <View style={styles.checkCard}>
          <Text style={styles.checkQuestion}>Everything looks right?</Text>
          <View style={styles.checkBtnsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.btn, styles.btnGreen]}
              onPress={handleConfirm}
            >
              <Text style={[styles.btnText, styles.btnGreenText]}>
                ✓ Yes, perfect
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.btn, styles.btnGhost]}
              onPress={handleNotQuite}
            >
              <Text style={styles.btnText}>Not quite…</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Open Document Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.openBtn}
          onPress={handleOpenDoc}
        >
          <Text style={styles.openBtnText}>Open document</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'ios' ? 36 : 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.displayBold,
    fontSize: 32,
    color: Colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.muted,
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  heroCard: {
    width: '100%',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 4.5,
    borderRadius: Radii.xl,
    padding: 20,
    marginBottom: 16,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroEmoji: {
    width: 52,
    height: 52,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emojiText: {
    fontSize: 26,
  },
  heroInfo: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: Colors.ink,
  },
  heroRename: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
    lineHeight: 16,
  },
  heroHighlightLine: {
    backgroundColor: Colors.marigoldLight,
    borderRadius: Radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  highlightText: {
    fontFamily: Typography.bodyBold,
    fontSize: 13.5,
    color: Colors.ink,
  },
  savedToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  savedToLabel: {
    fontFamily: Typography.bodyBold,
    fontSize: 12.5,
    color: Colors.muted,
  },
  folderPill: {
    backgroundColor: Colors.grapeLight,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: Radii.sm,
  },
  folderPillText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: Colors.grapeText,
  },
  drivePill: {
    backgroundColor: Colors.mintLight,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: Radii.sm,
  },
  drivePillText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: Colors.mintText,
  },
  checkCard: {
    width: '100%',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderStyle: 'dashed',
    borderRadius: Radii.lg,
    padding: 16,
    marginBottom: 16,
  },
  checkQuestion: {
    fontFamily: Typography.bodyBold,
    fontSize: 13.5,
    color: Colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  checkBtnsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGreen: {
    backgroundColor: Colors.mint,
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.mintDark,
  },
  btnGreenText: {
    color: '#06301E',
  },
  btnGhost: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
  },
  btnText: {
    fontFamily: Typography.displayBold,
    fontSize: 13.5,
    color: Colors.ink,
  },
  openBtn: {
    width: '100%',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    paddingVertical: 13,
    alignItems: 'center',
  },
  openBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 14.5,
    color: Colors.ink,
  },
});

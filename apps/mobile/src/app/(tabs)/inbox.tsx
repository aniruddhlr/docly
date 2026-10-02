import React, { useState } from 'react';
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
import { CATEGORY_PICK_LIST } from '@docly/shared';
import { Eye } from 'lucide-react-native';
import Animated, { FadeIn, FadeOutRight } from 'react-native-reanimated';

export default function InboxScreen() {
  const router = useRouter();
  const { inboxItems, inboxCount, resolveInboxItem, assignCategoryToInboxItem, triggerHaptic } = useDocly();
  const [activePickerId, setActivePickerId] = useState<string | null>(null);

  const togglePicker = (id: string) => {
    triggerHaptic('light');
    setActivePickerId((prev) => (prev === id ? null : id));
  };

  const handleOpenDoc = (id: string) => {
    triggerHaptic('light');
    router.push(`/document/${id}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Inbox 📥</Text>
        <Text style={styles.headerSub}>
          {inboxCount > 0
            ? `${inboxCount} thing${inboxCount > 1 ? 's' : ''} need${inboxCount > 1 ? '' : 's'} your attention`
            : 'All clear 🎉'}
        </Text>

        <View style={{ height: 16 }} />

        {inboxItems.length > 0 ? (
          inboxItems.map((item) => {
            const isHi = item.confidence >= 0.9;
            const isPickerOpen = activePickerId === item.id;

            return (
              <Animated.View
                key={item.id}
                entering={FadeIn.duration(250)}
                exiting={FadeOutRight.duration(300)}
                style={styles.card}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.cardTop}
                  onPress={() => handleOpenDoc(item.id)}
                >
                  <View style={[styles.cardEmoji, { backgroundColor: item.bgColor }]}>
                    <Text style={styles.emojiText}>{item.emoji}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardMeta}>{item.meta}</Text>
                  </View>
                  <View
                    style={[
                      styles.confBadge,
                      isHi ? styles.confHi : styles.confLo,
                    ]}
                  >
                    <Text
                      style={[
                        styles.confText,
                        isHi ? styles.confHiText : styles.confLoText,
                      ]}
                    >
                      {Math.round(item.confidence * 100)}%
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* AI Thought line */}
                <View style={styles.aiThought}>
                  <Text style={styles.sparkle}>
                    {item.type === 'duplicate' ? '👀' : item.confidence < 0.8 ? '🤔' : '✨'}
                  </Text>
                  <Text style={styles.aiThoughtText}>{item.reason}</Text>
                </View>

                {/* Open & Inspect prompt button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.inspectBtn}
                  onPress={() => handleOpenDoc(item.id)}
                >
                  <Eye size={15} color={Colors.skyText} strokeWidth={2.4} style={{ marginRight: 6 }} />
                  <Text style={styles.inspectBtnText}>View document & categorise</Text>
                  <Text style={styles.inspectBtnArrow}>→</Text>
                </TouchableOpacity>

                {/* Buttons */}
                <View style={styles.btnRow}>
                  {item.type === 'duplicate' ? (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.actionBtn, styles.btnGreen]}
                        onPress={() =>
                          resolveInboxItem(item.id, 'Kept both — linked together 🔗')
                        }
                      >
                        <Text style={[styles.btnText, styles.btnGreenText]}>
                          Keep both
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.actionBtn, styles.btnGhost]}
                        onPress={() =>
                          resolveInboxItem(item.id, 'Duplicate skipped 🗑️')
                        }
                      >
                        <Text style={styles.btnText}>Skip</Text>
                      </TouchableOpacity>
                    </>
                  ) : item.confidence >= 0.8 ? (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.actionBtn, styles.btnGreen]}
                        onPress={() =>
                          resolveInboxItem(
                            item.id,
                            `Saved to ${item.suggestedCategory} ✓`
                          )
                        }
                      >
                        <Text style={[styles.btnText, styles.btnGreenText]}>
                          ✓ Looks right
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.actionBtn, styles.btnGhost]}
                        onPress={() => togglePicker(item.id)}
                      >
                        <Text style={styles.btnText}>Change</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.actionBtn, styles.btnGhost]}
                      onPress={() => togglePicker(item.id)}
                    >
                      <Text style={styles.btnText}>Choose category</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Category Picker Dropdown */}
                {isPickerOpen && (
                  <View style={styles.pickerGrid}>
                    {CATEGORY_PICK_LIST.map(([emoji, cat]) => (
                      <TouchableOpacity
                        key={cat}
                        activeOpacity={0.8}
                        style={styles.pickerTile}
                        onPress={() => assignCategoryToInboxItem(item.id, cat)}
                      >
                        <Text style={styles.pickerEmoji}>{emoji}</Text>
                        <Text style={styles.pickerLabel}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </Animated.View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyBigEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>All clear!</Text>
            <Text style={styles.emptySub}>
              Nothing needs your attention right now. Go enjoy your evening.
            </Text>
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  headerTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 27,
    color: Colors.ink,
  },
  headerSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.muted,
    marginTop: 3,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardEmoji: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emojiText: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: Colors.ink,
  },
  cardMeta: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11.5,
    color: Colors.muted,
    marginTop: 2,
  },
  confBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  confHi: {
    backgroundColor: Colors.mintLight,
  },
  confHiText: {
    color: Colors.mintText,
  },
  confLo: {
    backgroundColor: Colors.yellowBg,
  },
  confLoText: {
    color: Colors.yellowText,
  },
  confText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 11,
  },
  aiThought: {
    flexDirection: 'row',
    backgroundColor: Colors.marigoldLight,
    borderRadius: Radii.md,
    padding: 11,
    marginTop: 11,
    marginBottom: 12,
    alignItems: 'center',
  },
  sparkle: {
    fontSize: 16,
    marginRight: 8,
  },
  aiThoughtText: {
    flex: 1,
    fontFamily: Typography.bodyBold,
    fontSize: 13,
    color: Colors.ink,
    lineHeight: 18,
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.skyLight,
    borderRadius: Radii.md,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#D4E8F8',
  },
  inspectBtnText: {
    flex: 1,
    fontFamily: Typography.bodyBold,
    fontSize: 12.5,
    color: Colors.skyText,
  },
  inspectBtnArrow: {
    fontFamily: Typography.displayBold,
    fontSize: 14,
    color: Colors.skyText,
    marginLeft: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 9,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGreen: {
    backgroundColor: Colors.mint,
    borderBottomWidth: 3,
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
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: Colors.line,
  },
  pickerTile: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: Radii.md,
    paddingVertical: 8,
  },
  pickerEmoji: {
    fontSize: 18,
  },
  pickerLabel: {
    fontFamily: Typography.bodyBold,
    fontSize: 11,
    color: Colors.ink,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyBigEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 22,
    color: Colors.ink,
  },
  emptySub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 260,
  },
});

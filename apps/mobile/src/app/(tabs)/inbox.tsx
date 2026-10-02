import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import { CATEGORY_PICK_LIST, InboxItem } from '@docly/shared';
import { Eye, X, Check, ExternalLink } from 'lucide-react-native';
import Animated, { FadeIn, FadeOutRight } from 'react-native-reanimated';

export default function InboxScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    inboxItems,
    inboxCount,
    categories,
    resolveInboxItem,
    assignCategoryToInboxItem,
    triggerHaptic,
  } = useDocly();
  const [activePickerId, setActivePickerId] = useState<string | null>(null);
  const [activeViewerItem, setActiveViewerItem] = useState<InboxItem | null>(null);
  const [viewerZoom, setViewerZoom] = useState<'1x' | '1.5x' | '2x'>('1x');
  const [isViewerPickerOpen, setIsViewerPickerOpen] = useState(false);

  const togglePicker = (id: string) => {
    triggerHaptic('light');
    setActivePickerId((prev) => (prev === id ? null : id));
  };

  const handleOpenDoc = (item: InboxItem) => {
    triggerHaptic('light');
    setActiveViewerItem(item);
    setIsViewerPickerOpen(false);
    setViewerZoom('1x');
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
                  onPress={() => handleOpenDoc(item)}
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
                  onPress={() => handleOpenDoc(item)}
                >
                  <Eye size={15} color={Colors.skyText} strokeWidth={2.4} style={{ marginRight: 6 }} />
                  <Text style={styles.inspectBtnText}>View document in-house</Text>
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
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.name}
                        activeOpacity={0.8}
                        style={styles.pickerTile}
                        onPress={() => assignCategoryToInboxItem(item.id, cat.name)}
                      >
                        <Text style={styles.pickerEmoji}>{cat.emoji}</Text>
                        <Text style={styles.pickerLabel} numberOfLines={1}>{cat.name}</Text>
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

      {/* FULL-SCREEN IN-HOUSE DOCUMENT VIEWER MODAL */}
      <Modal
        visible={!!activeViewerItem}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          setActiveViewerItem(null);
          setIsViewerPickerOpen(false);
        }}
      >
        {activeViewerItem && (
          <View style={[styles.viewerSafeArea, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 52 : 36) }]}>
            <StatusBar style="light" />

            {/* Viewer Top Bar */}
            <View style={styles.viewerTopBar}>
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                style={styles.viewerCloseBtn}
                onPress={() => {
                  setActiveViewerItem(null);
                  setIsViewerPickerOpen(false);
                }}
              >
                <X size={22} color="#FFF" strokeWidth={2.6} />
              </TouchableOpacity>

              <View style={styles.viewerTitleBox}>
                <Text style={styles.viewerDocTitle} numberOfLines={1}>
                  {activeViewerItem.title}
                </Text>
                <Text style={styles.viewerDocSub}>
                  {activeViewerItem.meta} · {activeViewerItem.imageUri ? 'Image' : 'PDF'}
                </Text>
              </View>

              {/* Zoom controls */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setViewerZoom((prev) => (prev === '1x' ? '1.5x' : prev === '1.5x' ? '2x' : '1x'))
                }
                style={styles.zoomBtn}
              >
                <Text style={styles.zoomBtnText}>{viewerZoom}</Text>
              </TouchableOpacity>
            </View>

            {/* Viewer Document Canvas */}
            <ScrollView
              style={styles.viewerCanvasScroll}
              contentContainerStyle={styles.viewerCanvasContent}
              maximumZoomScale={3}
              minimumZoomScale={1}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.viewerPageSheet,
                  {
                    transform: [
                      { scale: viewerZoom === '1.5x' ? 1.25 : viewerZoom === '2x' ? 1.5 : 1 },
                    ],
                  },
                ]}
              >
                {activeViewerItem.imageUri ? (
                  <Image
                    source={{ uri: activeViewerItem.imageUri }}
                    style={styles.viewerRealImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.viewerPdfPaper}>
                    {/* Simulated Document Header */}
                    <View style={styles.pdfHeaderRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pdfHeaderBadge}>IN-HOUSE INSPECTION</Text>
                        <Text style={styles.pdfMainTitle}>{activeViewerItem.title}</Text>
                      </View>
                      <Text style={{ fontSize: 34 }}>{activeViewerItem.emoji}</Text>
                    </View>

                    <View style={styles.pdfDivider} />

                    {/* Meta Table */}
                    <View style={styles.pdfMetaTable}>
                      <View style={styles.pdfMetaCol}>
                        <Text style={styles.pdfMetaLabel}>STATUS</Text>
                        <Text style={styles.pdfMetaValue}>Pending Categorisation</Text>
                      </View>
                      <View style={styles.pdfMetaCol}>
                        <Text style={styles.pdfMetaLabel}>SUGGESTION</Text>
                        <Text style={styles.pdfMetaValue}>
                          {activeViewerItem.suggestedCategory || 'Other'}
                        </Text>
                      </View>
                    </View>

                    {/* Summary Box */}
                    <View style={styles.pdfSummaryBox}>
                      <Text style={styles.pdfSummaryHeading}>AI EXTRACTION SUMMARY</Text>
                      <Text style={styles.pdfBodyText}>
                        {activeViewerItem.reason ||
                          'Document detected. Docly extracted facts and metadata from the document structure.'}
                      </Text>
                    </View>

                    {/* Content skeleton lines */}
                    <View style={styles.pdfLineSkeleton}>
                      <View style={[styles.skeletonLine, { width: '92%' }]} />
                      <View style={[styles.skeletonLine, { width: '84%' }]} />
                      <View style={[styles.skeletonLine, { width: '76%' }]} />
                      <View style={[styles.skeletonLine, { width: '90%' }]} />
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Bottom Actions Bar */}
            <View
              style={[
                styles.viewerBottomBar,
                { paddingBottom: Math.max(insets.bottom + 12, 24) },
              ]}
            >
              {/* AI Thought Banner */}
              <View style={styles.viewerAIBanner}>
                <Text style={styles.viewerAIEmoji}>✨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.viewerAITitle}>
                    AI Recommendation · {Math.round(activeViewerItem.confidence * 100)}%
                  </Text>
                  <Text style={styles.viewerAISub} numberOfLines={2}>
                    {activeViewerItem.reason}
                  </Text>
                </View>
              </View>

              {/* Category Picker Popover */}
              {isViewerPickerOpen && (
                <View style={styles.viewerPickerContainer}>
                  <Text style={styles.viewerPickerHeading}>File into category:</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.viewerPickerScroll}
                  >
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.name}
                        activeOpacity={0.8}
                        style={[
                          styles.viewerPickerChip,
                          activeViewerItem.suggestedCategory === cat.name &&
                            styles.viewerPickerChipActive,
                        ]}
                        onPress={() => {
                          const id = activeViewerItem.id;
                          assignCategoryToInboxItem(id, cat.name);
                          setActiveViewerItem(null);
                          setIsViewerPickerOpen(false);
                        }}
                      >
                        <Text style={{ fontSize: 16, marginRight: 6 }}>{cat.emoji}</Text>
                        <Text
                          style={[
                            styles.viewerPickerChipText,
                            activeViewerItem.suggestedCategory === cat.name &&
                              styles.viewerPickerChipTextActive,
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.viewerBtnRow}>
                {activeViewerItem.type === 'duplicate' ? (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.viewerActionBtn, styles.viewerBtnGreen]}
                      onPress={() => {
                        resolveInboxItem(activeViewerItem.id, 'Kept both — linked together 🔗');
                        setActiveViewerItem(null);
                      }}
                    >
                      <Text style={styles.viewerBtnGreenText}>Keep both documents</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.viewerActionBtn, styles.viewerBtnGhost]}
                      onPress={() => {
                        resolveInboxItem(activeViewerItem.id, 'Duplicate skipped 🗑️');
                        setActiveViewerItem(null);
                      }}
                    >
                      <Text style={styles.viewerBtnGhostText}>Skip duplicate</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.viewerActionBtn, styles.viewerBtnGreen]}
                      onPress={() => {
                        const targetCat = activeViewerItem.suggestedCategory || 'Other';
                        assignCategoryToInboxItem(activeViewerItem.id, targetCat);
                        setActiveViewerItem(null);
                        setIsViewerPickerOpen(false);
                      }}
                    >
                      <Check size={18} color="#06301E" strokeWidth={2.6} style={{ marginRight: 6 }} />
                      <Text style={styles.viewerBtnGreenText}>
                        Save to {activeViewerItem.suggestedCategory || 'Other'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.viewerActionBtn, styles.viewerBtnGhost]}
                      onPress={() => setIsViewerPickerOpen((v) => !v)}
                    >
                      <Text style={styles.viewerBtnGhostText}>
                        {isViewerPickerOpen ? 'Cancel' : 'Change'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        )}
      </Modal>
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
  /* In-house Viewer styles */
  viewerSafeArea: {
    flex: 1,
    backgroundColor: '#0E1915',
  },
  viewerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  viewerCloseBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerTitleBox: {
    flex: 1,
    marginHorizontal: 12,
  },
  viewerDocTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: '#FFF',
  },
  viewerDocSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11.5,
    color: '#8CA99F',
    marginTop: 2,
  },
  zoomBtn: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radii.sm,
  },
  zoomBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 12,
    color: '#FFF',
  },
  viewerCanvasScroll: {
    flex: 1,
  },
  viewerCanvasContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 460,
  },
  viewerPageSheet: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  viewerRealImage: {
    width: '100%',
    height: 440,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  viewerPdfPaper: {
    backgroundColor: '#FFFDF9',
    borderRadius: 8,
    padding: 22,
    minHeight: 400,
    borderWidth: 1,
    borderColor: '#E8E1D3',
  },
  pdfHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pdfHeaderBadge: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1,
    color: '#7A8C84',
    marginBottom: 4,
  },
  pdfMainTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: '#15241F',
  },
  pdfDivider: {
    height: 1.5,
    backgroundColor: '#EAE3D2',
    marginVertical: 12,
  },
  pdfMetaTable: {
    flexDirection: 'row',
    backgroundColor: '#F7F3E9',
    borderRadius: Radii.md,
    padding: 12,
    marginBottom: 16,
  },
  pdfMetaCol: {
    flex: 1,
  },
  pdfMetaLabel: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 9.5,
    color: '#84938B',
    marginBottom: 3,
  },
  pdfMetaValue: {
    fontFamily: Typography.bodyBold,
    fontSize: 12.5,
    color: '#182C24',
  },
  pdfSummaryBox: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#EFE7D8',
    borderRadius: Radii.md,
    padding: 12,
    marginBottom: 16,
  },
  pdfSummaryHeading: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 10,
    color: '#52665D',
    marginBottom: 4,
  },
  pdfBodyText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: '#34493F',
    lineHeight: 18,
  },
  pdfLineSkeleton: {
    gap: 8,
    marginTop: 8,
  },
  skeletonLine: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EFECE2',
  },
  viewerBottomBar: {
    backgroundColor: '#12221C',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  viewerAIBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radii.md,
    padding: 10,
    marginBottom: 12,
  },
  viewerAIEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  viewerAITitle: {
    fontFamily: Typography.displayBold,
    fontSize: 12.5,
    color: '#55E2A8',
  },
  viewerAISub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    color: '#C6DDD4',
    marginTop: 2,
  },
  viewerPickerContainer: {
    marginBottom: 12,
    paddingVertical: 4,
  },
  viewerPickerHeading: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: '#8CA99F',
    marginBottom: 8,
  },
  viewerPickerScroll: {
    gap: 8,
  },
  viewerPickerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radii.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewerPickerChipActive: {
    backgroundColor: Colors.mint,
    borderColor: Colors.mintDark,
  },
  viewerPickerChipText: {
    fontFamily: Typography.displayBold,
    fontSize: 12.5,
    color: '#FFF',
  },
  viewerPickerChipTextActive: {
    color: '#06301E',
  },
  viewerBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewerActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radii.md,
  },
  viewerBtnGreen: {
    backgroundColor: Colors.mint,
    borderBottomWidth: 3,
    borderBottomColor: Colors.mintDark,
  },
  viewerBtnGreenText: {
    fontFamily: Typography.displayBold,
    fontSize: 13.5,
    color: '#06301E',
  },
  viewerBtnGhost: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
    flex: 0.45,
  },
  viewerBtnGhostText: {
    fontFamily: Typography.displayBold,
    fontSize: 13,
    color: '#FFF',
  },
});


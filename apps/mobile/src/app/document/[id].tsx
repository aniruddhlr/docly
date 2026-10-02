import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  PanResponder,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { AskSheet } from '@/components/AskSheet';
import { Colors, Typography, Radii } from '@/constants/theme';
import {
  ArrowLeft,
  MoreVertical,
  Cloud,
  Share2,
  FolderEdit,
  Edit3,
  Trash2,
  ShieldAlert,
  Check,
  X,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, Easing } from 'react-native-reanimated';
import { CATEGORIES, DocumentCategory } from '@docly/shared';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    documents,
    toast,
    triggerHaptic,
    deleteDocument,
    renameDocument,
    updateDocumentCategory,
    deleteAIData,
  } = useDocly();

  const [isAskOpen, setIsAskOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameText, setRenameText] = useState('');
  const [isCatPickerOpen, setIsCatPickerOpen] = useState(false);

  const document = documents.find((d) => d.id === id);

  // Gesture handling for sliding down the 3-dots action sheet
  const menuPanY = useRef(new RNAnimated.Value(0)).current;
  const menuPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 6,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          menuPanY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 70 || gestureState.vy > 0.4) {
          RNAnimated.timing(menuPanY, {
            toValue: 400,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            menuPanY.setValue(0);
            setIsMenuOpen(false);
          });
        } else {
          RNAnimated.spring(menuPanY, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isMenuOpen) {
      menuPanY.setValue(0);
    }
  }, [isMenuOpen]);

  if (!document) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={Colors.ink} strokeWidth={2.4} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document Details</Text>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundEmoji}>📄</Text>
          <Text style={styles.notFoundTitle}>Document not found</Text>
          <Text style={styles.notFoundSub}>
            This document may have been deleted or moved.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.notFoundBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.notFoundBtnText}>Back to Documents</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleOpenDrive = () => {
    triggerHaptic('light');
    toast(`Opening "${document.fileName}" in Google Drive… ☁️`);
  };

  const handleMoreActions = () => {
    triggerHaptic('medium');
    setIsMenuOpen(true);
  };

  const handleShare = async () => {
    setIsMenuOpen(false);
    triggerHaptic('light');
    try {
      await Share.share({
        title: document.title,
        message: `Docly: ${document.title}\nCategory: ${document.path}\nFile: ${document.fileName}\nGoogle Drive: ${document.gdriveFolder}`,
      });
    } catch {}
  };

  const handleOpenRename = () => {
    setIsMenuOpen(false);
    setRenameText(document.title);
    setTimeout(() => {
      setIsRenameOpen(true);
    }, 150);
  };

  const handleSaveRename = () => {
    if (renameText.trim()) {
      renameDocument(document.id, renameText.trim());
      setIsRenameOpen(false);
    }
  };

  const handleOpenCatPicker = () => {
    setIsMenuOpen(false);
    setTimeout(() => {
      setIsCatPickerOpen(true);
    }, 150);
  };

  const handleSelectCategory = (cat: DocumentCategory) => {
    updateDocumentCategory(document.id, cat);
    setIsCatPickerOpen(false);
  };

  const handleClearAI = () => {
    setIsMenuOpen(false);
    deleteAIData();
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    triggerHaptic('warning');
    Alert.alert(
      'Delete Document?',
      `Are you sure you want to delete "${document.title}" from Docly?\n\nThe original file in your Google Drive will remain completely untouched.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDocument(document.id);
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={Colors.ink} strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {document.title}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.iconBtn}
          onPress={handleMoreActions}
        >
          <MoreVertical size={20} color={Colors.ink} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Visual Document Card */}
        <View style={styles.pdfPage}>
          <View style={styles.pHead}>
            <View style={styles.pLogo}>
              <Text style={styles.pLogoText}>TA</Text>
            </View>
            <View>
              <Text style={styles.pCompany}>
                {document.details.company || 'TATA AIG'}
              </Text>
              <Text style={styles.pSub}>OFFICIAL DOCUMENT SCHEDULE</Text>
            </View>
          </View>

          <Text style={styles.pTitle}>{document.title}</Text>
          <View style={[styles.pLine, { width: '92%' }]} />
          <View style={[styles.pLine, { width: '78%' }]} />
          <View style={[styles.pLine, { width: '86%' }]} />

          <View style={styles.pGrid}>
            <View style={styles.pCell}>
              <Text style={styles.pCellLabel}>POLICY / REF №</Text>
              <Text style={styles.pCellValue}>
                {document.details.policyNo || 'TAG-88231'}
              </Text>
            </View>
            <View style={styles.pCell}>
              <Text style={styles.pCellLabel}>SUBJECT / ITEM</Text>
              <Text style={styles.pCellValue}>
                {document.details.vehicleNo || '23 BH 764'}
              </Text>
            </View>
            <View style={styles.pCell}>
              <Text style={styles.pCellLabel}>PERIOD / DATE</Text>
              <Text style={styles.pCellValue}>
                {document.date || '24/09/26 – 23/09/27'}
              </Text>
            </View>
            <View style={styles.pCell}>
              <Text style={styles.pCellLabel}>VALUE / AMOUNT</Text>
              <Text style={styles.pCellValue}>
                {document.details.amount || '₹18,450'}
              </Text>
            </View>
          </View>

          <View style={styles.stamp}>
            <Text style={styles.stampText}>ACTIVE ✓</Text>
          </View>
        </View>

        {/* Title & Facts */}
        <Text style={styles.mainTitle}>{document.title}</Text>

        <View style={styles.factsRow}>
          {document.facts.map((fact, index) => (
            <View
              key={index}
              style={[styles.factPill, fact.highlight && styles.factPillHl]}
            >
              <Text
                style={[
                  styles.factPillText,
                  fact.highlight && styles.factPillHlText,
                ]}
              >
                {fact.label}: {fact.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Details Table */}
        <Text style={styles.sectionHeading}>Details</Text>
        <View style={styles.detailsList}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Company / Issuer</Text>
            <Text style={styles.detailValue}>
              {document.details.company || 'Tata AIG'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Document Type</Text>
            <Text style={styles.detailValue}>
              {document.details.type || 'Insurance'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{document.path}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>AI Confidence</Text>
            <Text style={styles.detailValue}>
              {document.details.confidenceLabel || '98% ✨'}
            </Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {document.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.askBtn}
          onPress={() => {
            triggerHaptic('medium');
            setIsAskOpen(true);
          }}
        >
          <Text style={styles.askBtnText}>✨ Ask this document</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.driveBtn}
          onPress={handleOpenDrive}
        >
          <Cloud size={18} color={Colors.ink} strokeWidth={2.4} style={{ marginRight: 8 }} />
          <Text style={styles.driveBtnText}>Open in Google Drive</Text>
        </TouchableOpacity>

        <Text style={styles.privacyReassurance}>
          🔒 The original file never leaves your Google Drive
        </Text>
      </ScrollView>

      {/* 3-Dots Action Sheet Modal */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
          <Animated.View
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(150)}
            style={styles.modalBackdrop}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          entering={SlideInDown.duration(260).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutDown.duration(180).easing(Easing.in(Easing.cubic))}
          style={[styles.actionSheet, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}
        >
          <RNAnimated.View
            {...menuPanResponder.panHandlers}
            style={{ transform: [{ translateY: menuPanY }] }}
          >
            <View style={styles.handleArea}>
              <View style={styles.handle} />
            </View>

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle} numberOfLines={1}>{document.title}</Text>
              <Text style={styles.sheetSub}>{document.fileName}</Text>
            </View>

            <View style={styles.menuItemsList}>
              {/* Share */}
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.menuRow}
                onPress={handleShare}
              >
                <View style={[styles.menuIconBox, { backgroundColor: Colors.skyLight }]}>
                  <Share2 size={18} color={Colors.skyText} strokeWidth={2.4} />
                </View>
                <Text style={styles.menuRowText}>Share document</Text>
              </TouchableOpacity>

              {/* Open in Drive */}
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.menuRow}
                onPress={handleOpenDrive}
              >
                <View style={[styles.menuIconBox, { backgroundColor: Colors.mintLight }]}>
                  <Cloud size={18} color={Colors.mintText} strokeWidth={2.4} />
                </View>
                <Text style={styles.menuRowText}>Open in Google Drive</Text>
              </TouchableOpacity>

              {/* Change Category */}
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.menuRow}
                onPress={handleOpenCatPicker}
              >
                <View style={[styles.menuIconBox, { backgroundColor: Colors.yellowBg }]}>
                  <FolderEdit size={18} color={Colors.yellowText} strokeWidth={2.4} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuRowText}>Change category</Text>
                  <Text style={styles.menuRowSub}>Currently: {document.category}</Text>
                </View>
              </TouchableOpacity>

              {/* Rename */}
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.menuRow}
                onPress={handleOpenRename}
              >
                <View style={[styles.menuIconBox, { backgroundColor: Colors.grapeLight }]}>
                  <Edit3 size={18} color={Colors.grapeText} strokeWidth={2.4} />
                </View>
                <Text style={styles.menuRowText}>Rename document</Text>
              </TouchableOpacity>

              {/* Clear AI Data */}
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.menuRow}
                onPress={handleClearAI}
              >
                <View style={[styles.menuIconBox, { backgroundColor: Colors.marigoldLight }]}>
                  <ShieldAlert size={18} color={Colors.marigoldDark} strokeWidth={2.4} />
                </View>
                <Text style={styles.menuRowText}>Clear AI data & embeddings</Text>
              </TouchableOpacity>

              {/* Delete Document */}
              <TouchableOpacity
                activeOpacity={0.75}
                style={[styles.menuRow, { borderBottomWidth: 0 }]}
                onPress={handleDelete}
              >
                <View style={[styles.menuIconBox, { backgroundColor: Colors.coralLight }]}>
                  <Trash2 size={18} color={Colors.coralDark} strokeWidth={2.4} />
                </View>
                <Text style={[styles.menuRowText, { color: Colors.coralDark }]}>
                  Delete from Docly
                </Text>
              </TouchableOpacity>
            </View>
          </RNAnimated.View>
        </Animated.View>
      </Modal>

      {/* Rename Dialog Modal */}
      <Modal
        visible={isRenameOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsRenameOpen(false)}
      >
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Rename Document</Text>
            <TextInput
              style={styles.dialogInput}
              value={renameText}
              onChangeText={setRenameText}
              placeholder="Enter document title"
              placeholderTextColor={Colors.muted}
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.dialogBtns}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.dialogCancelBtn}
                onPress={() => setIsRenameOpen(false)}
              >
                <Text style={styles.dialogCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.dialogSaveBtn}
                onPress={handleSaveRename}
              >
                <Text style={styles.dialogSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Category Sheet Modal */}
      <Modal
        visible={isCatPickerOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => setIsCatPickerOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsCatPickerOpen(false)}>
          <Animated.View
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(150)}
            style={styles.modalBackdrop}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          entering={SlideInDown.duration(260).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutDown.duration(180).easing(Easing.in(Easing.cubic))}
          style={[styles.actionSheet, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}
        >
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>
          <Text style={styles.catPickerTitle}>Select Category</Text>
          <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
            {CATEGORIES.map((cat) => {
              const isSelected = document.category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.75}
                  style={[styles.catPickRow, isSelected && styles.catPickRowSelected]}
                  onPress={() => handleSelectCategory(cat.id)}
                >
                  <Text style={styles.catPickEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.catPickName, isSelected && styles.catPickNameSelected]}>
                    {cat.name}
                  </Text>
                  {isSelected && (
                    <Check size={18} color={Colors.mintDark} strokeWidth={2.8} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
      </Modal>

      {/* Ask Overlay Sheet */}
      <AskSheet
        visible={isAskOpen}
        onClose={() => setIsAskOpen(false)}
        document={document}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: Colors.ink,
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
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pdfPage: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 4,
    borderRadius: Radii.lg,
    padding: 20,
    marginTop: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  pHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pLogo: {
    width: 34,
    height: 34,
    borderRadius: Radii.sm,
    backgroundColor: Colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pLogoText: {
    fontFamily: Typography.displayBold,
    color: '#FFF',
    fontSize: 13,
  },
  pCompany: {
    fontFamily: Typography.displayBold,
    fontSize: 13,
    color: '#B3401F',
    letterSpacing: 0.8,
  },
  pSub: {
    fontFamily: Typography.bodyBold,
    fontSize: 9,
    color: Colors.muted,
  },
  pTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: Colors.ink,
    marginTop: 14,
    marginBottom: 10,
  },
  pLine: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EFEAD9',
    marginBottom: 6,
  },
  pGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  pCell: {
    width: '48%',
    backgroundColor: '#FBF7EC',
    borderRadius: Radii.sm,
    padding: 8,
  },
  pCellLabel: {
    fontFamily: Typography.bodyBold,
    fontSize: 8.5,
    color: '#A79C7C',
    letterSpacing: 0.5,
  },
  pCellValue: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: Colors.ink,
    marginTop: 2,
  },
  stamp: {
    position: 'absolute',
    right: 14,
    bottom: 12,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(46,194,126,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-14deg' }],
  },
  stampText: {
    fontFamily: Typography.displayBold,
    fontSize: 10,
    color: 'rgba(31,161,101,0.8)',
    letterSpacing: 1,
  },
  mainTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 22,
    color: Colors.ink,
    marginTop: 18,
    marginBottom: 8,
  },
  factsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  factPill: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  factPillHl: {
    backgroundColor: Colors.yellowBg,
    borderColor: Colors.yellowBorder,
  },
  factPillText: {
    fontFamily: Typography.bodyBold,
    fontSize: 12,
    color: Colors.ink,
  },
  factPillHlText: {
    color: Colors.yellowText,
  },
  sectionHeading: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: Colors.ink,
    marginBottom: 8,
  },
  detailsList: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F7EFDC',
  },
  detailLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.muted,
  },
  detailValue: {
    fontFamily: Typography.bodyBold,
    fontSize: 13,
    color: Colors.ink,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 18,
  },
  tag: {
    backgroundColor: Colors.skyLight,
    paddingVertical: 4.5,
    paddingHorizontal: 10,
    borderRadius: Radii.sm,
  },
  tagText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: Colors.skyText,
  },
  askBtn: {
    backgroundColor: Colors.marigold,
    borderRadius: Radii.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.marigoldDark,
    marginBottom: 10,
  },
  askBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: Colors.ink,
  },
  driveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    paddingVertical: 13,
    marginBottom: 12,
  },
  driveBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 14,
    color: Colors.ink,
  },
  privacyReassurance: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'center',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  notFoundEmoji: {
    fontSize: 48,
    marginBottom: 14,
  },
  notFoundTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 22,
    color: Colors.ink,
    marginBottom: 6,
  },
  notFoundSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  notFoundBtn: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  notFoundBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 14,
    color: Colors.ink,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(13, 43, 37, 0.55)',
  },
  actionSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: Colors.line,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  handleArea: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E3D5B6',
  },
  sheetHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#EDE3CD',
    marginBottom: 10,
  },
  sheetTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: Colors.ink,
  },
  sheetSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  menuItemsList: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F7EFDC',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuRowText: {
    fontFamily: Typography.displayBold,
    fontSize: 14.5,
    color: Colors.ink,
  },
  menuRowSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11.5,
    color: Colors.muted,
    marginTop: 1,
  },
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(13, 43, 37, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialogBox: {
    width: '100%',
    backgroundColor: Colors.cream,
    borderRadius: Radii.xl,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 4.5,
  },
  dialogTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: Colors.ink,
    marginBottom: 14,
  },
  dialogInput: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: Typography.bodyBold,
    fontSize: 15,
    color: Colors.ink,
    marginBottom: 16,
  },
  dialogBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  dialogCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radii.md,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.line,
  },
  dialogCancelText: {
    fontFamily: Typography.bodyBold,
    fontSize: 13.5,
    color: Colors.muted,
  },
  dialogSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Radii.md,
    backgroundColor: Colors.marigold,
    borderBottomWidth: 3,
    borderBottomColor: Colors.marigoldDark,
  },
  dialogSaveText: {
    fontFamily: Typography.displayBold,
    fontSize: 13.5,
    color: Colors.ink,
  },
  catPickerTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: Colors.ink,
    marginBottom: 12,
  },
  catPickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.line,
    borderRadius: Radii.md,
    marginBottom: 8,
  },
  catPickRowSelected: {
    backgroundColor: Colors.mintLight,
    borderColor: Colors.mint,
  },
  catPickEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  catPickName: {
    flex: 1,
    fontFamily: Typography.displayBold,
    fontSize: 14.5,
    color: Colors.ink,
  },
  catPickNameSelected: {
    color: Colors.mintText,
  },
});

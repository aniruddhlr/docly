import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import { ArrowLeft, Plus, X, Trash2, Sparkles, ChevronRight, Tag, Smile } from 'lucide-react-native';



export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    autoOrganizeEnabled,
    setAutoOrganizeEnabled,
    remindersEnabled,
    setRemindersEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    triggerHaptic,
    deleteAIData,
    loadSampleData,
    clearAllData,
    toast,
    categories,
    addCustomCategory,
    deleteCustomCategory,
  } = useDocly();

  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('📁');
  const [newCatPrompt, setNewCatPrompt] = useState('');
  const emojiInputRef = useRef<TextInput>(null);

  const customCount = categories.filter((c) => c.isCustom).length;
  const defaultCount = categories.length - customCount;

  const handleOpenCategories = () => {
    triggerHaptic('light');
    setIsCategoriesModalOpen(true);
  };

  const handleCreateCategory = () => {
    const trimmedName = newCatName.trim();
    const trimmedPrompt = newCatPrompt.trim();

    if (!trimmedName) {
      toast('Please enter a category name');
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast(`Category "${trimmedName}" already exists`);
      return;
    }
    if (!trimmedPrompt) {
      toast('Please provide AI instructions for this category');
      return;
    }

    addCustomCategory({
      name: trimmedName,
      emoji: newCatEmoji || '📁',
      aiPrompt: trimmedPrompt,
    });

    setNewCatName('');
    setNewCatPrompt('');
    setNewCatEmoji('📁');
    setIsAddCustomOpen(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    triggerHaptic('warning');
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${name}"? Documents in this category will move to "Other".`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCustomCategory(id),
        },
      ]
    );
  };

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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Google Drive Account */}
        <View style={styles.row}>
          <Text style={styles.rowEmoji}>☁️</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Google Drive</Text>
            <Text style={styles.rowSub}>anirudh@gmail.com</Text>
          </View>
          <View style={styles.okPill}>
            <Text style={styles.okPillText}>Connected ✓</Text>
          </View>
        </View>

        {/* Storage Location */}
        <View style={styles.row}>
          <Text style={styles.rowEmoji}>📁</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Storage Location</Text>
            <Text style={styles.rowSub}>My Drive / Docly</Text>
          </View>
        </View>

        {/* Vibration / Haptics Toggle */}
        <View style={styles.row}>
          <Text style={styles.rowEmoji}>📳</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Vibration & Haptics</Text>
            <Text style={styles.rowSub}>
              {vibrationEnabled ? 'Vibrating on taps & scans' : 'Vibrations disabled'}
            </Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={(val) => {
              setVibrationEnabled(val);
            }}
            trackColor={{ false: '#E3D5B6', true: Colors.mint }}
            thumbColor="#FFF"
          />
        </View>

        {/* Auto-organize Toggle */}
        <View style={styles.row}>
          <Text style={styles.rowEmoji}>🤖</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Auto-organise</Text>
            <Text style={styles.rowSub}>
              High confidence → filed automatically
            </Text>
          </View>
          <Switch
            value={autoOrganizeEnabled}
            onValueChange={(val) => {
              triggerHaptic('light');
              setAutoOrganizeEnabled(val);
            }}
            trackColor={{ false: '#E3D5B6', true: Colors.mint }}
            thumbColor="#FFF"
          />
        </View>

        {/* Expiry Reminders Toggle */}
        <View style={styles.row}>
          <Text style={styles.rowEmoji}>🔔</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Expiry reminders</Text>
            <Text style={styles.rowSub}>30 days before a date hits</Text>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={(val) => {
              triggerHaptic('light');
              setRemindersEnabled(val);
            }}
            trackColor={{ false: '#E3D5B6', true: Colors.mint }}
            thumbColor="#FFF"
          />
        </View>

        {/* Delete AI Data */}
        <View style={styles.row}>
          <Text style={styles.rowEmoji}>🔐</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Delete AI data</Text>
            <Text style={styles.rowSub}>
              Clears OCR text, embeddings & summaries
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={deleteAIData}
          >
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Manager Entry */}
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.row}
          onPress={handleOpenCategories}
        >
          <Text style={styles.rowEmoji}>🏷️</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Categories</Text>
            <Text style={styles.rowSub}>
              {defaultCount} defaults · {customCount} custom
            </Text>
          </View>
          <View style={styles.categoryCountBadge}>
            <Text style={styles.categoryCountBadgeText}>{categories.length}</Text>
          </View>
          <ChevronRight size={18} color="#A3B3AB" strokeWidth={2.4} />
        </TouchableOpacity>

        {/* Developer / Data Management */}
        <View style={styles.sectionDivider}>
          <Text style={styles.sectionDividerText}>Database & Testing</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowEmoji}>📦</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Sample demo documents</Text>
            <Text style={styles.rowSub}>Load preview documents for testing</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={loadSampleData}
          >
            <Text style={styles.clearBtnText}>Load</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowEmoji}>🧹</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Clear all local documents</Text>
            <Text style={styles.rowSub}>Reset to 0 documents for real DB</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={clearAllData}
          >
            <Text style={[styles.clearBtnText, { color: Colors.coralDark }]}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyBox}>
          <Text style={styles.privacyText}>
            🔒 <Text style={{ fontWeight: '800' }}>Privacy by design:</Text> Docly uses the narrow{' '}
            <Text style={{ fontWeight: '800' }}>drive.file</Text> scope — it can only ever see the files{' '}
            <Text style={{ fontStyle: 'italic' }}>you</Text> hand it. Nothing else in your Google Drive is touched.
          </Text>
        </View>

        {/* Walkthrough link */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.walkthroughBtn}
          onPress={() => router.push('/onboarding')}
        >
          <Text style={styles.walkthroughBtnText}>Replay Onboarding Tour ✨</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CATEGORIES MANAGEMENT MODAL */}
      <Modal
        visible={isCategoriesModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsCategoriesModalOpen(false)}
      >
        <View style={[styles.catModalSafeArea, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 24 : 32) }]}>
          {/* Categories Modal Header */}
          <View style={styles.catModalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.catModalTitle}>Document Categories 🏷️</Text>
              <Text style={styles.catModalSub}>
                Manage folders and train AI on how to classify files
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
              style={styles.catModalCloseBtn}
              onPress={() => setIsCategoriesModalOpen(false)}
            >
              <X size={20} color={Colors.ink} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          {/* Add Category Button */}
          <View style={styles.catModalAddBar}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.addCategoryBtn}
              onPress={() => {
                triggerHaptic('light');
                setIsAddCustomOpen(true);
              }}
            >
              <Plus size={18} color={Colors.ink} strokeWidth={3} style={{ marginRight: 6 }} />
              <Text style={styles.addCategoryBtnText}>Add Custom Category</Text>
            </TouchableOpacity>
          </View>

          {/* Categories List */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.catModalListContent}
            showsVerticalScrollIndicator={false}
          >
            {categories.map((cat) => (
              <View key={cat.name} style={styles.catCard}>
                <View style={styles.catCardTop}>
                  <View style={[styles.catCardEmojiBox, { backgroundColor: cat.bg || '#E8F5E9' }]}>
                    <Text style={styles.catCardEmoji}>{cat.emoji}</Text>
                  </View>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.catCardName}>{cat.name}</Text>
                      {cat.isCustom ? (
                        <View style={styles.customBadge}>
                          <Sparkles size={11} color="#0B7A50" strokeWidth={2.5} style={{ marginRight: 3 }} />
                          <Text style={styles.customBadgeText}>Custom AI</Text>
                        </View>
                      ) : (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {cat.isCustom && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.catDeleteBtn}
                      onPress={() => handleDeleteCategory(cat.id, cat.name)}
                    >
                      <Trash2 size={16} color={Colors.coralDark} strokeWidth={2.2} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* AI Guidance Detail */}
                <View style={styles.catAIGuidanceBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={styles.catAILabel}>🤖 How AI identifies this:</Text>
                  </View>
                  <Text style={styles.catAIText}>
                    {cat.aiPrompt || 'Standard document structure and vendor analysis.'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* In-Modal Add Custom Category Sheet */}
          {isAddCustomOpen && (
            <View style={StyleSheet.absoluteFill}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.addSheetBackdrop}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.addSheetBackdropDismissArea} />
                </TouchableWithoutFeedback>

                <View
                  style={[
                    styles.addSheetCard,
                    { paddingBottom: Math.max(insets.bottom + 12, 22) },
                  ]}
                >
                  <View style={styles.addSheetHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.addSheetTitle}>New Custom Category</Text>
                      <Text style={styles.addSheetSub}>
                        Train Docly AI to classify your custom documents
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      onPress={() => {
                        Keyboard.dismiss();
                        setIsAddCustomOpen(false);
                      }}
                      style={styles.addSheetClose}
                    >
                      <X size={18} color={Colors.muted} strokeWidth={2.4} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.addSheetScrollContent}
                  >
                    {/* Category Emoji Selector */}
                    <Text style={styles.inputLabel}>Category Emoji</Text>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => emojiInputRef.current?.focus()}
                      style={styles.emojiCard}
                    >
                      <View style={styles.emojiAvatar}>
                        <Text style={{ fontSize: 32 }}>{newCatEmoji || '📁'}</Text>
                      </View>
                      <View style={styles.emojiCardContent}>
                        <Text style={styles.emojiCardLabel}>Emoji</Text>
                        <TextInput
                          ref={emojiInputRef}
                          style={styles.emojiInputField}
                          placeholder="Type emoji from keyboard (e.g. 🩺, 🚗, ✈️)"
                          placeholderTextColor="#A0AFA7"
                          value={newCatEmoji}
                          onChangeText={(val) => {
                            if (!val.trim()) {
                              setNewCatEmoji('📁');
                            } else {
                              const chars = Array.from(val.trim());
                              setNewCatEmoji(chars[chars.length - 1]);
                            }
                          }}
                          maxLength={6}
                        />
                      </View>
                    </TouchableOpacity>

                    {/* Category Name */}
                    <Text style={[styles.inputLabel, { marginTop: 16 }]}>Category Name</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Medical, Travel, Pets, Taxes"
                      placeholderTextColor="#A0AFA7"
                      value={newCatName}
                      onChangeText={setNewCatName}
                      maxLength={30}
                      returnKeyType="next"
                    />

                    {/* AI Instructions */}
                    <Text style={[styles.inputLabel, { marginTop: 16 }]}>AI Instructions</Text>
                    <Text style={styles.inputHelp}>
                      Tell Docly AI what documents belong here so it can auto-classify them:
                    </Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      placeholder="e.g. Prescriptions, hospital bills, doctor reports, blood tests..."
                      placeholderTextColor="#A0AFA7"
                      value={newCatPrompt}
                      onChangeText={setNewCatPrompt}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />

                    {/* Buttons */}
                    <View style={styles.addSheetBtnRow}>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.saveCategoryBtn}
                        onPress={handleCreateCategory}
                      >
                        <Sparkles size={16} color="#06301E" strokeWidth={2.6} style={{ marginRight: 6 }} />
                        <Text style={styles.saveCategoryBtnText}>Save Category</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.cancelCategoryBtn}
                        onPress={() => {
                          Keyboard.dismiss();
                          setIsAddCustomOpen(false);
                        }}
                      >
                        <Text style={styles.cancelCategoryBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </KeyboardAvoidingView>
            </View>
          )}
        </View>
      </Modal>
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
    fontFamily: Typography.displayBold,
    fontSize: 22,
    color: Colors.ink,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  rowEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  rowInfo: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: Colors.ink,
  },
  rowSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  okPill: {
    backgroundColor: Colors.mintLight,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
  },
  okPillText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 11.5,
    color: Colors.mintText,
  },
  clearBtn: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 12.5,
    color: Colors.ink,
  },
  privacyBox: {
    backgroundColor: Colors.marigoldLight,
    borderRadius: Radii.lg,
    padding: 15,
    marginTop: 10,
    marginBottom: 16,
  },
  sectionDivider: {
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionDividerText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 12,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  privacyText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12.5,
    color: Colors.ink,
    lineHeight: 18,
  },
  walkthroughBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  walkthroughBtnText: {
    fontFamily: Typography.bodyBold,
    fontSize: 13.5,
    color: Colors.skyDark,
  },
  categoryCountBadge: {
    backgroundColor: '#E8E1D3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    marginRight: 6,
  },
  categoryCountBadgeText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 11,
    color: Colors.ink,
  },
  /* Categories Management Modal styles */
  catModalSafeArea: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  catModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.line,
  },
  catModalTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 20,
    color: Colors.ink,
  },
  catModalSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  catModalCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catModalAddBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.marigold,
    borderRadius: Radii.lg,
    paddingVertical: 13,
    borderWidth: 2,
    borderColor: '#FFF',
    borderBottomWidth: 3.5,
    borderBottomColor: Colors.marigoldDark,
  },
  addCategoryBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 14.5,
    color: Colors.ink,
  },
  catModalListContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  catCard: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    padding: 14,
  },
  catCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  catCardEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catCardEmoji: {
    fontSize: 22,
  },
  catCardName: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: Colors.ink,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#F3EEDB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  defaultBadgeText: {
    fontFamily: Typography.bodyBold,
    fontSize: 10.5,
    color: '#7C8A84',
  },
  customBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  customBadgeText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 10.5,
    color: '#0B7A50',
  },
  catDeleteBtn: {
    padding: 6,
  },
  catAIGuidanceBox: {
    backgroundColor: '#FDFBF7',
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: '#EFE8D8',
    padding: 10,
  },
  catAILabel: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 11,
    color: Colors.ink,
  },
  catAIText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: '#4B5E55',
    lineHeight: 17,
  },
  /* Add Custom Category Form Modal */
  addSheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(13, 43, 37, 0.65)',
    justifyContent: 'flex-end',
  },
  addSheetBackdropDismissArea: {
    flex: 1,
  },
  addSheetCard: {
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 18,
    maxHeight: '92%',
  },
  addSheetScrollContent: {
    paddingBottom: 28,
  },
  addSheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addSheetTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: Colors.ink,
  },
  addSheetSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  addSheetClose: {
    padding: 6,
  },
  inputLabel: {
    fontFamily: Typography.displayBold,
    fontSize: 13,
    color: Colors.ink,
    marginBottom: 6,
    marginTop: 6,
  },
  inputHelp: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11.5,
    color: Colors.muted,
    marginBottom: 8,
  },
  emojiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: Radii.lg,
    padding: 12,
  },
  emojiAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFEBB8',
    borderWidth: 2,
    borderColor: Colors.marigoldDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  emojiCardLabel: {
    fontFamily: Typography.displayBold,
    fontSize: 11.5,
    color: Colors.muted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emojiInputField: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: Colors.line,
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.ink,
  },
  textInput: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.ink,
  },
  textArea: {
    height: 78,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  addSheetBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  saveCategoryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mint,
    borderRadius: Radii.md,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: Colors.mintDark,
  },
  saveCategoryBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 14,
    color: '#06301E',
  },
  cancelCategoryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radii.md,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelCategoryBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 13.5,
    color: Colors.muted,
  },
});

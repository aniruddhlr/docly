import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  PanResponder,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import { X, Cloud, Check, Sparkles, Folder, CheckSquare, Square } from 'lucide-react-native';

interface DriveItem {
  id: string;
  name: string;
  size: string;
  folder: string;
  category: string;
  emoji: string;
}

const GOOGLE_DRIVE_SAMPLE_FILES: DriveItem[] = [
  { id: '1', name: 'Tata_AIG_Car_Insurance_2026.pdf', size: '1.2 MB', folder: 'Insurance', category: 'Insurance', emoji: '🛡️' },
  { id: '2', name: 'HDFC_Bank_Statement_Sep2026.pdf', size: '480 KB', folder: 'Finance', category: 'Finance', emoji: '🏦' },
  { id: '3', name: 'Passport_Front_Scan.jpg', size: '2.1 MB', folder: 'Identity', category: 'Identity', emoji: '🪪' },
  { id: '4', name: 'Electricity_Bill_Aug2026.pdf', size: '320 KB', folder: 'Bills', category: 'Bills', emoji: '⚡' },
  { id: '5', name: 'Apollo_Prescription_DrRao.pdf', size: '640 KB', folder: 'Medical', category: 'Medical', emoji: '🩺' },
  { id: '6', name: 'ITR_V_Acknowledgement_2025-26.pdf', size: '890 KB', folder: 'Taxes', category: 'Finance', emoji: '🧾' },
];

const DRIVE_FOLDERS = ['All', 'Insurance', 'Finance', 'Identity', 'Bills', 'Medical', 'Taxes'];

export function AddSheet() {
  const { isAddSheetOpen, closeAddSheet, toast, setScannedPages, processDocument, triggerHaptic } = useDocly();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const panY = useRef(new Animated.Value(450)).current;
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);
  const [selectedDriveFolder, setSelectedDriveFolder] = useState<string>('All');
  const [selectedDriveFileIds, setSelectedDriveFileIds] = useState<Set<string>>(new Set());
  const [isAutoScanning, setIsAutoScanning] = useState<boolean>(false);
  const [sheetHeight, setSheetHeight] = useState(440);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (isAddSheetOpen) {
      panY.setValue(450);
      Animated.timing(panY, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }).start();
    }
  }, [isAddSheetOpen]);

  const dismissSheet = (callback?: () => void) => {
    Animated.timing(panY, {
      toValue: 480,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      closeAddSheet();
      setIsDrivePickerOpen(false);
      callback?.();
    });
  };

  // Full-screen gesture: dragging down from modal top, handle, or content smoothly slides down
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 3,
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        gestureState.dy > 3 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderGrant: (evt) => {
        touchStartY.current = evt.nativeEvent.pageY;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (evt, gestureState) => {
        const windowHeight = Dimensions.get('window').height;
        const sheetTop = windowHeight - sheetHeight;

        // If dragged down enough or flicked down -> dismiss
        if (gestureState.dy > 45 || gestureState.vy > 0.3) {
          dismissSheet();
          return;
        }

        // If it was a tap (movement < 8px) outside the sheet (modal top / backdrop) -> dismiss
        if (Math.abs(gestureState.dy) < 8 && Math.abs(gestureState.dx) < 8) {
          if (touchStartY.current < sheetTop) {
            dismissSheet();
            return;
          }
        }

        // Otherwise smoothly spring back to 0
        Animated.spring(panY, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(panY, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  if (!isAddSheetOpen) return null;

  const handleTakePhoto = () => {
    triggerHaptic('light');
    dismissSheet(() => {
      setScannedPages(0);
      router.push('/scanner');
    });
  };

  const handlePickImage = async () => {
    triggerHaptic('light');
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast('Please grant photo library access to choose images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        dismissSheet(async () => {
          await processDocument({
            imageUri: asset.uri,
            fileName: asset.fileName || 'photo_upload.jpg',
            mimeType: asset.mimeType || 'image/jpeg',
          });
          router.push('/processing');
        });
      }
    } catch (e) {
      console.log('Image pick error:', e);
      toast('Failed to choose image');
    }
  };

  const handlePickFile = async () => {
    triggerHaptic('light');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        dismissSheet(async () => {
          await processDocument({
            imageUri: asset.mimeType?.startsWith('image/') ? asset.uri : undefined,
            fileName: asset.name || 'document.pdf',
            mimeType: asset.mimeType || 'application/pdf',
          });
          router.push('/processing');
        });
      }
    } catch (e) {
      console.log('Document pick error:', e);
      toast('Failed to select file');
    }
  };

  const handleOpenDrivePicker = () => {
    triggerHaptic('light');
    setIsDrivePickerOpen(true);
  };

  const toggleDriveFileSelection = (id: string) => {
    triggerHaptic('light');
    setSelectedDriveFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAutoScanDrive = () => {
    triggerHaptic('medium');
    setIsAutoScanning(true);
    setSelectedDriveFolder('All');
    setSelectedDriveFileIds(new Set(GOOGLE_DRIVE_SAMPLE_FILES.map((f) => f.id)));
    toast('🔍 Auto-scanned all folders: Found 6 documents');
  };

  const handleBrowseDriveNative = async () => {
    triggerHaptic('light');
    try {
      const res = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ['application/pdf', 'image/*'],
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        dismissSheet(async () => {
          toast(`Importing "${asset.name}" from Drive… ☁️`);
          await processDocument({
            imageUri: asset.uri,
            fileName: asset.name,
            mimeType: asset.mimeType || 'application/pdf',
          });
          router.push('/processing');
        });
      }
    } catch {
      toast('Error selecting file from Drive');
    }
  };

  const handleImportSelectedDriveFiles = () => {
    if (selectedDriveFileIds.size === 0) return;
    triggerHaptic('success');
    const filesToImport = GOOGLE_DRIVE_SAMPLE_FILES.filter((f) => selectedDriveFileIds.has(f.id));
    dismissSheet(async () => {
      toast(`Importing ${filesToImport.length} documents from Google Drive… ☁️`);
      for (const file of filesToImport) {
        await processDocument({
          fileName: file.name,
          mimeType: file.name.endsWith('.jpg') ? 'image/jpeg' : 'application/pdf',
        });
      }
      router.push('/processing');
    });
  };

  const handleSelectDriveFile = (file: DriveItem) => {
    triggerHaptic('success');
    dismissSheet(async () => {
      toast(`Importing "${file.name}" from Google Drive… ☁️`);
      await processDocument({
        fileName: file.name,
        mimeType: file.name.endsWith('.jpg') ? 'image/jpeg' : 'application/pdf',
      });
      router.push('/processing');
    });
  };

  const filteredDriveFiles = selectedDriveFolder === 'All'
    ? GOOGLE_DRIVE_SAMPLE_FILES
    : GOOGLE_DRIVE_SAMPLE_FILES.filter((f) => f.folder === selectedDriveFolder);

  const backdropOpacity = panY.interpolate({
    inputRange: [0, 400],
    outputRange: [0.55, 0],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      visible={isAddSheetOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => dismissSheet()}
    >
      <View style={styles.modalOverlay} {...panResponder.panHandlers}>
        {/* Dimmed backdrop tracking drag */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />

        {/* Entire modal sheet with unified slide and pan gesture anywhere on sheet */}
        <Animated.View
          onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom + 16, 28),
              transform: [{ translateY: panY }],
            },
          ]}
        >
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

        {isDrivePickerOpen ? (
          /* Google Drive In-sheet File Browser */
          <View>
            <View style={styles.driveHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Cloud size={20} color={Colors.ink} strokeWidth={2.4} style={{ marginRight: 8 }} />
                <Text style={styles.title}>Google Drive</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsDrivePickerOpen(false)}
                style={styles.driveBackBtn}
              >
                <X size={18} color={Colors.muted} strokeWidth={2.4} />
              </TouchableOpacity>
            </View>

            {/* Action Bar: Auto-Scan & Browse Native Drive */}
            <View style={styles.driveActionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.driveActionBtn, isAutoScanning && styles.driveActionBtnActive]}
                onPress={handleAutoScanDrive}
              >
                <Sparkles size={14} color={isAutoScanning ? '#0B7A50' : Colors.ink} strokeWidth={2.5} style={{ marginRight: 6 }} />
                <Text style={[styles.driveActionBtnText, isAutoScanning && styles.driveActionBtnTextActive]}>
                  {isAutoScanning ? 'Auto-Scan Active (All Folders)' : 'Auto-Scan All Folders'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.driveBrowseBtn}
                onPress={handleBrowseDriveNative}
              >
                <Folder size={14} color={Colors.ink} strokeWidth={2.4} style={{ marginRight: 5 }} />
                <Text style={styles.driveBrowseBtnText}>Browse Other Folders</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.driveSub}>
              {isAutoScanning
                ? 'Found 6 documents across all folders in your Drive. Select which to import:'
                : 'Select files below, or browse other folders in Google Drive:'}
            </Text>

            {/* Folder Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.driveFolderPills}>
              {DRIVE_FOLDERS.map((folder) => {
                const isActive = selectedDriveFolder === folder;
                const count = folder === 'All'
                  ? GOOGLE_DRIVE_SAMPLE_FILES.length
                  : GOOGLE_DRIVE_SAMPLE_FILES.filter((f) => f.folder === folder).length;
                return (
                  <TouchableOpacity
                    key={folder}
                    activeOpacity={0.75}
                    style={[styles.folderPill, isActive && styles.folderPillActive]}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedDriveFolder(folder);
                    }}
                  >
                    <Text style={[styles.folderPillText, isActive && styles.folderPillTextActive]}>
                      {folder === 'All' ? '📂 All Folders' : `📁 ${folder}`} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
              {filteredDriveFiles.map((file) => {
                const isSelected = selectedDriveFileIds.has(file.id);
                return (
                  <View
                    key={file.id}
                    style={[styles.driveFileRow, isSelected && styles.driveFileRowSelected]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ marginRight: 10, padding: 4 }}
                      onPress={() => toggleDriveFileSelection(file.id)}
                    >
                      {isSelected ? (
                        <CheckSquare size={19} color={Colors.mintDark} strokeWidth={2.4} />
                      ) : (
                        <Square size={19} color={Colors.muted} strokeWidth={2} />
                      )}
                    </TouchableOpacity>

                    <Text style={styles.driveFileEmoji}>{file.emoji}</Text>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      activeOpacity={0.8}
                      onPress={() => toggleDriveFileSelection(file.id)}
                    >
                      <Text style={styles.driveFileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.driveFileMeta}>
                        📁 {file.folder} · {file.size}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.importPillBtn}
                      onPress={() => handleSelectDriveFile(file)}
                    >
                      <Text style={styles.importPill}>Import</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>

            {/* Bottom Batch Import Bar if files are selected */}
            {selectedDriveFileIds.size > 0 && (
              <View style={styles.driveBatchBar}>
                <Text style={styles.driveBatchCount}>
                  {selectedDriveFileIds.size} of {GOOGLE_DRIVE_SAMPLE_FILES.length} selected
                </Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.driveBatchImportBtn}
                  onPress={handleImportSelectedDriveFiles}
                >
                  <Sparkles size={14} color="#06301E" strokeWidth={2.5} style={{ marginRight: 6 }} />
                  <Text style={styles.driveBatchImportBtnText}>
                    Import Selected ({selectedDriveFileIds.size})
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          /* Default Add Options */
          <>
            <Text style={styles.title}>What do you want to add?</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.option}
              onPress={handleTakePhoto}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.skyLight }]}>
                <Text style={styles.emoji}>📷</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Take photo</Text>
                <Text style={styles.optionSubtitle}>Multi-page scanner with auto-crop</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.option}
              onPress={handlePickImage}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.grapeLight }]}>
                <Text style={styles.emoji}>🖼️</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Choose image</Text>
                <Text style={styles.optionSubtitle}>From your photo library</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.option}
              onPress={handlePickFile}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.yellowBg }]}>
                <Text style={styles.emoji}>📄</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Choose file</Text>
                <Text style={styles.optionSubtitle}>PDF, DOCX, anything</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.option}
              onPress={handleOpenDrivePicker}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.mintLight }]}>
                <Text style={styles.emoji}>☁️</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Google Drive</Text>
                <Text style={styles.optionSubtitle}>Import a file that’s already there</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                💡 Tip: From WhatsApp, Chrome or Gmail — hit <Text style={{ fontWeight: '800' }}>Share → Docly</Text>
              </Text>
            </View>
          </>
        )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0D2B25',
  },
  sheet: {
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
    marginBottom: 4,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E3D5B6',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: Typography.displayBold,
    color: Colors.ink,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: Radii.lg,
    padding: 14,
    marginBottom: 10,
    borderBottomWidth: 3.5,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 22,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: Typography.displayBold,
    color: Colors.ink,
  },
  optionSubtitle: {
    fontSize: 12,
    fontFamily: Typography.bodyMedium,
    color: Colors.muted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: '#C9BB99',
    fontWeight: '800',
    marginLeft: 6,
  },
  tipBox: {
    marginTop: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  tipText: {
    fontSize: 12,
    fontFamily: Typography.bodyMedium,
    color: Colors.muted,
    textAlign: 'center',
  },
  driveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  driveBackBtn: {
    padding: 6,
  },
  driveSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.muted,
    marginBottom: 14,
  },
  driveFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.lg,
    padding: 12,
    marginBottom: 8,
  },
  driveFileEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  driveFileName: {
    fontFamily: Typography.displayBold,
    fontSize: 14,
    color: Colors.ink,
  },
  driveFileMeta: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11.5,
    color: Colors.muted,
    marginTop: 2,
  },
  driveActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  driveActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: Radii.md,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  driveActionBtnActive: {
    backgroundColor: '#BBF7D0',
    borderColor: '#4ADE80',
  },
  driveActionBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 11.5,
    color: '#0B7A50',
  },
  driveActionBtnTextActive: {
    color: '#064E3B',
  },
  driveBrowseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.line,
    borderRadius: Radii.md,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  driveBrowseBtnText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: Colors.ink,
  },
  driveFolderPills: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 6,
    marginBottom: 6,
  },
  folderPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.card,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.line,
  },
  folderPillActive: {
    backgroundColor: Colors.marigold,
    borderColor: Colors.marigoldDark,
  },
  folderPillText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11,
    color: Colors.muted,
  },
  folderPillTextActive: {
    color: Colors.ink,
    fontFamily: Typography.bodyExtraBold,
  },
  driveFileRowSelected: {
    borderColor: Colors.mintDark,
    backgroundColor: '#F0FDF4',
  },
  importPillBtn: {
    paddingLeft: 6,
  },
  driveBatchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 8,
  },
  driveBatchCount: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: '#065F46',
  },
  driveBatchImportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mint,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderBottomWidth: 2,
    borderBottomColor: Colors.mintDark,
  },
  driveBatchImportBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 11.5,
    color: '#06301E',
  },
  importPill: {
    backgroundColor: Colors.mintLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
    fontFamily: Typography.bodyExtraBold,
    fontSize: 11.5,
    color: Colors.mintText,
  },
});

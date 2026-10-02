import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  PanResponder,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import { X, Cloud, Check } from 'lucide-react-native';

const GOOGLE_DRIVE_SAMPLE_FILES = [
  { name: 'Tata_AIG_Car_Insurance_2026.pdf', size: '1.2 MB', category: 'Insurance', emoji: '🛡️' },
  { name: 'HDFC_Bank_Statement_Sep2026.pdf', size: '480 KB', category: 'Finance', emoji: '🏦' },
  { name: 'Passport_Front_Scan.jpg', size: '2.1 MB', category: 'Identity', emoji: '🪪' },
  { name: 'Electricity_Bill_Aug2026.pdf', size: '320 KB', category: 'Bills', emoji: '⚡' },
];

export function AddSheet() {
  const { isAddSheetOpen, closeAddSheet, toast, setScannedPages, processDocument, triggerHaptic } = useDocly();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const panY = useRef(new Animated.Value(450)).current;
  const [isDrivePickerOpen, setIsDrivePickerOpen] = useState(false);

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

  // Capture gesture so dragging down works starting from ANYWHERE (buttons, text, handle)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 6,
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        gestureState.dy > 6 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 70 || gestureState.vy > 0.4) {
          dismissSheet();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }
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

  const handleSelectDriveFile = (file: typeof GOOGLE_DRIVE_SAMPLE_FILES[0]) => {
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
        <TouchableWithoutFeedback onPress={() => dismissSheet()}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Entire modal sheet with unified slide and pan gesture anywhere on sheet */}
        <Animated.View
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
            <Text style={styles.driveSub}>
              Select a document from your Google Drive (Docly folder):
            </Text>

            <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
              {GOOGLE_DRIVE_SAMPLE_FILES.map((file, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  style={styles.driveFileRow}
                  onPress={() => handleSelectDriveFile(file)}
                >
                  <Text style={styles.driveFileEmoji}>{file.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.driveFileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.driveFileMeta}>
                      {file.category} · {file.size}
                    </Text>
                  </View>
                  <Text style={styles.importPill}>Import</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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

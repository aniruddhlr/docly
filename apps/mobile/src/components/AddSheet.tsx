import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  PanResponder,
  Animated as RNAnimated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, Easing } from 'react-native-reanimated';

export function AddSheet() {
  const { isAddSheetOpen, closeAddSheet, toast, setScannedPages } = useDocly();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const panY = useRef(new RNAnimated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 6,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.4) {
          RNAnimated.timing(panY, {
            toValue: 500,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            panY.setValue(0);
            closeAddSheet();
          });
        } else {
          RNAnimated.spring(panY, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isAddSheetOpen) {
      panY.setValue(0);
    }
  }, [isAddSheetOpen]);

  if (!isAddSheetOpen) return null;

  const handleTakePhoto = () => {
    closeAddSheet();
    setScannedPages(0);
    router.push('/scanner');
  };

  const handlePickImage = async () => {
    closeAddSheet();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        router.push('/processing');
      }
    } catch {
      router.push('/processing');
    }
  };

  const handlePickFile = async () => {
    closeAddSheet();
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        router.push('/processing');
      }
    } catch {
      router.push('/processing');
    }
  };

  const handleImportDrive = () => {
    closeAddSheet();
    toast('Picking from Google Drive… ☁️');
    setTimeout(() => {
      router.push('/processing');
    }, 700);
  };

  return (
    <Modal
      visible={isAddSheetOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeAddSheet}
    >
      <TouchableWithoutFeedback onPress={closeAddSheet}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(160)}
          style={styles.backdrop}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        entering={SlideInDown.duration(260).easing(Easing.out(Easing.cubic))}
        exiting={SlideOutDown.duration(180).easing(Easing.in(Easing.cubic))}
        style={[
          styles.sheet,
          {
            paddingBottom: Math.max(insets.bottom + 16, 28),
          },
        ]}
      >
        <RNAnimated.View
          {...panResponder.panHandlers}
          style={{ transform: [{ translateY: panY }] }}
        >
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>
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
          onPress={handleImportDrive}
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
        </RNAnimated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(13, 43, 37, 0.55)',
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
});

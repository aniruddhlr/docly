import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import { ArrowLeft, Zap, ZapOff, Camera as CameraIcon } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  SlideInDown,
} from 'react-native-reanimated';

export default function ScannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scannedPages, setScannedPages, toast, triggerHaptic, processDocument } = useDocly();

  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [flash, setFlash] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  // Laser scanning animation
  const laserY = useSharedValue(0.15);

  useEffect(() => {
    laserY.value = withRepeat(
      withTiming(0.8, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const laserStyle = useAnimatedStyle(() => {
    return {
      top: `${laserY.value * 100}%`,
    };
  });

  const handleSnap = async () => {
    triggerHaptic('success');

    setFlash(true);
    setTimeout(() => setFlash(false), 220);

    let photoUri: string | null = null;
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          skipProcessing: true,
        });
        if (photo?.uri) {
          photoUri = photo.uri;
        }
      } catch (err) {
        console.log('Error snapping photo:', err);
      }
    }

    setScannedPages((prev) => prev + 1);
    if (photoUri) {
      setCapturedPhotos((prev) => [...prev, photoUri]);
    }

    setTimeout(() => {
      setShowReview(true);
    }, 450);
  };

  const handleAddAnotherPage = () => {
    setShowReview(false);
    toast('Ready for next page 📄');
  };

  const handleDone = async () => {
    triggerHaptic('light');
    const firstPhoto = capturedPhotos[0];
    if (firstPhoto) {
      await processDocument({
        imageUri: firstPhoto,
        fileName: `scan_${Date.now()}.jpg`,
        mimeType: 'image/jpeg',
      });
    }
    router.replace('/processing');
  };

  // If permissions are still loading or not granted
  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing camera…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
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
          <Text style={styles.headerTitle}>Scan document</Text>
        </View>

        <View style={styles.permissionCard}>
          <View style={styles.permIconBox}>
            <CameraIcon size={36} color={Colors.marigoldDark} strokeWidth={2.4} />
          </View>
          <Text style={styles.permTitle}>Camera access needed</Text>
          <Text style={styles.permDesc}>
            Docly uses your phone's camera to scan policies, bills, receipts, and IDs with automatic edge detection and cropping.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.grantBtn}
            onPress={requestPermission}
          >
            <Text style={styles.grantBtnText}>Enable Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.skipBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.skipBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Scan document</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.torchBtn, torch && styles.torchBtnActive]}
          onPress={() => {
            triggerHaptic('light');
            setTorch((prev) => !prev);
          }}
        >
          {torch ? (
            <Zap size={20} color={Colors.ink} strokeWidth={2.5} />
          ) : (
            <ZapOff size={20} color={Colors.muted} strokeWidth={2.2} />
          )}
        </TouchableOpacity>
      </View>

      {/* Camera Viewfinder */}
      <View style={styles.viewfinder}>
        {/* Live Camera View */}
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
        />

        {flash && <View style={styles.flashOverlay} />}

        {/* 4 Corner brackets */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        {/* Ghost Document Outline */}
        <View style={styles.ghostDoc}>
          <Text style={styles.ghostText}>ALIGN DOCUMENT</Text>
        </View>

        {/* Animated Laser Line */}
        <Animated.View style={[styles.laser, laserStyle]} />

        <View style={styles.detectBadge}>
          <Text style={styles.detectText}>✨ Auto detect · Auto crop</Text>
        </View>
      </View>

      {/* Shutter Bar */}
      <View style={[styles.shutterRow, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.thumbsBox}>
          {scannedPages > 0 && (
            <View style={styles.thumbPill}>
              <Text style={styles.thumbPillText}>{scannedPages} {scannedPages === 1 ? 'page' : 'pages'}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.shutterOuter}
          onPress={handleSnap}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <View style={styles.doneBox}>
          {scannedPages > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.doneBtn}
              onPress={handleDone}
            >
              <Text style={styles.doneBtnText}>Done →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Review Bottom Sheet */}
      {showReview && (
        <Animated.View
          entering={SlideInDown.duration(260).easing(Easing.out(Easing.cubic))}
          style={[styles.reviewSheet, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}
        >
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewTitle}>Looks good! 🎉</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.reviewCloseBtn}
              onPress={() => {
                setShowReview(false);
                router.back();
              }}
            >
              <Text style={styles.reviewCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pageList}>
            {Array.from({ length: scannedPages }).map((_, i) => (
              <View key={i} style={styles.pageItem}>
                {capturedPhotos[i] ? (
                  <Image source={{ uri: capturedPhotos[i] }} style={styles.pageThumbImg} />
                ) : (
                  <View style={styles.pageMiniIcon} />
                )}
                <Text style={styles.pageItemText}>Page {i + 1}</Text>
                <Text style={styles.pageCheck}>✓</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.ghostBtn}
            onPress={handleAddAnotherPage}
          >
            <Text style={styles.ghostBtnText}>＋ Add another page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.primaryBtn}
            onPress={handleDone}
          >
            <Text style={styles.primaryBtnText}>Save document</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
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
    paddingTop: 10,
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
    fontSize: 20,
    color: Colors.ink,
  },
  torchBtn: {
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
  torchBtnActive: {
    backgroundColor: Colors.marigold,
    borderColor: Colors.marigoldDark,
  },
  viewfinder: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: Colors.pineSurface,
    borderRadius: Radii.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    zIndex: 99,
  },
  corner: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderColor: Colors.marigold,
    zIndex: 10,
  },
  cornerTL: {
    top: 24,
    left: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    top: 24,
    right: 24,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  cornerBL: {
    bottom: 24,
    left: 24,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    bottom: 24,
    right: 24,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  ghostDoc: {
    position: 'absolute',
    top: 48,
    bottom: 48,
    left: 40,
    right: 40,
    borderWidth: 2,
    borderColor: 'rgba(255,246,230,0.3)',
    borderStyle: 'dashed',
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  ghostText: {
    fontFamily: Typography.displayBold,
    color: 'rgba(255,246,230,0.4)',
    fontSize: 13,
    letterSpacing: 2.5,
  },
  laser: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 3,
    backgroundColor: Colors.mint,
    borderRadius: 2,
    shadowColor: Colors.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 12,
  },
  detectBadge: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(13,43,37,0.7)',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255,246,230,0.2)',
    zIndex: 10,
  },
  detectText: {
    fontFamily: Typography.bodyBold,
    fontSize: 12,
    color: Colors.cream,
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  thumbsBox: {
    width: 70,
  },
  thumbPill: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: Radii.sm,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  thumbPillText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11,
    color: Colors.ink,
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF',
    borderWidth: 5,
    borderColor: Colors.ink,
    borderBottomWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.marigold,
  },
  doneBox: {
    width: 70,
    alignItems: 'flex-end',
  },
  doneBtn: {
    backgroundColor: Colors.mint,
    borderRadius: Radii.md,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderBottomWidth: 3,
    borderBottomColor: Colors.mintDark,
  },
  doneBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 13.5,
    color: '#06301E',
  },
  reviewSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    borderWidth: 2,
    borderTopWidth: 3,
    borderColor: Colors.line,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 90,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  reviewTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 20,
    color: Colors.ink,
  },
  reviewCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCloseText: {
    fontFamily: Typography.bodyBold,
    fontSize: 14,
    color: Colors.muted,
  },
  pageList: {
    marginBottom: 14,
    gap: 8,
  },
  pageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.md,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  pageThumbImg: {
    width: 26,
    height: 34,
    borderRadius: 4,
    marginRight: 10,
  },
  pageMiniIcon: {
    width: 26,
    height: 34,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: Colors.line,
    borderRadius: 4,
    marginRight: 10,
  },
  pageItemText: {
    flex: 1,
    fontFamily: Typography.bodyBold,
    fontSize: 13.5,
    color: Colors.ink,
  },
  pageCheck: {
    fontFamily: Typography.bodyBold,
    fontSize: 14,
    color: Colors.mintDark,
  },
  ghostBtn: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  ghostBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 14.5,
    color: Colors.ink,
  },
  primaryBtn: {
    backgroundColor: Colors.marigold,
    borderRadius: Radii.lg,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.marigoldDark,
  },
  primaryBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 15.5,
    color: Colors.ink,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: Typography.bodyBold,
    fontSize: 15,
    color: Colors.muted,
  },
  permissionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permIconBox: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: Colors.marigoldLight,
    borderWidth: 2,
    borderColor: Colors.marigold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  permTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 22,
    color: Colors.ink,
    textAlign: 'center',
  },
  permDesc: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    maxWidth: 290,
  },
  grantBtn: {
    width: '100%',
    backgroundColor: Colors.marigold,
    borderRadius: Radii.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: Colors.marigoldDark,
    marginTop: 26,
  },
  grantBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: Colors.ink,
  },
  skipBtn: {
    marginTop: 14,
    paddingVertical: 8,
  },
  skipBtnText: {
    fontFamily: Typography.bodyBold,
    fontSize: 14,
    color: Colors.muted,
  },
});

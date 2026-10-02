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
  Image,
  Linking,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
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
  Eye,
  ZoomIn,
  CheckCircle2,
} from 'lucide-react-native';
import { DocumentCategory } from '@docly/shared';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    documents,
    inboxItems,
    categories,
    toast,
    triggerHaptic,
    deleteDocument,
    renameDocument,
    updateDocumentCategory,
    assignCategoryToInboxItem,
    getDocumentOrInboxItem,
    deleteAIData,
  } = useDocly();

  const [isAskOpen, setIsAskOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameText, setRenameText] = useState('');
  const [isCatPickerOpen, setIsCatPickerOpen] = useState(false);
  const [isInhouseViewerOpen, setIsInhouseViewerOpen] = useState(false);
  const [viewerZoom, setViewerZoom] = useState<'1x' | '1.5x' | '2x'>('1x');
  const [viewerPage, setViewerPage] = useState(1);

  // Look up either in documents or in inbox items
  const lookup = getDocumentOrInboxItem(id || '');
  const document = lookup.doc;
  const isInboxItem = lookup.isInboxItem;
  const inboxItem = lookup.inboxItem;

  // Unified smooth gesture handling for 3-dots sheet
  const menuPanY = useRef(new RNAnimated.Value(450)).current;

  useEffect(() => {
    if (isMenuOpen) {
      menuPanY.setValue(450);
      RNAnimated.timing(menuPanY, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuOpen]);

  const dismissMenu = (callback?: () => void) => {
    RNAnimated.timing(menuPanY, {
      toValue: 480,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuOpen(false);
      callback?.();
    });
  };

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
          dismissMenu();
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

  const handleOpenDrive = async () => {
    triggerHaptic('light');
    toast(`Opening "${document.fileName}" in Google Drive… ☁️`);
    const driveDeepLink = 'googledrive://';
    const driveWebLink = 'https://drive.google.com/drive/my-drive';
    try {
      const canOpen = await Linking.canOpenURL(driveDeepLink);
      if (canOpen) {
        await Linking.openURL(driveDeepLink);
      } else {
        await Linking.openURL(driveWebLink);
      }
    } catch {
      await Linking.openURL(driveWebLink);
    }
  };

  const handleMoreActions = () => {
    triggerHaptic('medium');
    setIsMenuOpen(true);
  };

  const doShare = async () => {
    triggerHaptic('light');
    try {
      await Share.share({
        title: document.title,
        message: `Docly: ${document.title}\nCategory: ${document.path}\nFile: ${document.fileName}\nGoogle Drive: ${document.gdriveFolder}`,
        url: document.imageUri || undefined,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  };

  const handleShareFromMenu = () => {
    dismissMenu(() => {
      // Delay allows iOS UIViewController transition to complete before presenting share sheet
      setTimeout(() => {
        doShare();
      }, 350);
    });
  };

  const handleOpenRename = () => {
    dismissMenu(() => {
      setRenameText(document.title);
      setTimeout(() => {
        setIsRenameOpen(true);
      }, 100);
    });
  };

  const handleSaveRename = () => {
    if (renameText.trim()) {
      renameDocument(document.id, renameText.trim());
      setIsRenameOpen(false);
    }
  };

  const handleOpenCatPicker = () => {
    dismissMenu(() => {
      setTimeout(() => {
        setIsCatPickerOpen(true);
      }, 100);
    });
  };

  const handleSelectCategory = (cat: DocumentCategory) => {
    if (isInboxItem && inboxItem) {
      assignCategoryToInboxItem(inboxItem.id, cat);
      setIsCatPickerOpen(false);
      toast(`Categorised as ${cat} ✓`);
    } else {
      updateDocumentCategory(document.id, cat);
      setIsCatPickerOpen(false);
    }
  };

  const handleConfirmInboxCategory = () => {
    if (isInboxItem && inboxItem) {
      triggerHaptic('success');
      assignCategoryToInboxItem(inboxItem.id, document.category);
      toast(`Saved to ${document.category} ✓`);
    }
  };

  const handleClearAI = () => {
    dismissMenu(() => {
      deleteAIData();
    });
  };

  const handleDelete = () => {
    dismissMenu(() => {
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
    });
  };

  const menuBackdropOpacity = menuPanY.interpolate({
    inputRange: [0, 400],
    outputRange: [0.55, 0],
    extrapolate: 'clamp',
  });

  const zoomScale = viewerZoom === '2x' ? 2 : viewerZoom === '1.5x' ? 1.5 : 1;

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
        {/* Inbox Pending Categorisation Alert Banner */}
        {isInboxItem && inboxItem && (
          <View style={styles.inboxBanner}>
            <View style={styles.inboxBannerTop}>
              <View style={styles.inboxBadgeIcon}>
                <Text style={{ fontSize: 20 }}>📥</Text>
              </View>
              <View style={styles.inboxBannerTextContainer}>
                <Text style={styles.inboxBannerHeading}>Needs Categorisation</Text>
                <Text style={styles.inboxBannerSub}>{inboxItem.reason}</Text>
              </View>
              <View style={styles.confPill}>
                <Text style={styles.confPillText}>
                  {Math.round(inboxItem.confidence * 100)}%
                </Text>
              </View>
            </View>

            <View style={styles.inboxActionButtons}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.confirmInboxBtn}
                onPress={handleConfirmInboxCategory}
              >
                <CheckCircle2 size={17} color="#06301E" strokeWidth={2.8} style={{ marginRight: 6 }} />
                <Text style={styles.confirmInboxBtnText}>
                  Save to {inboxItem.suggestedCategory}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.changeInboxCatBtn}
                onPress={() => setIsCatPickerOpen(true)}
              >
                <Text style={styles.changeInboxCatBtnText}>Change Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Visual Document Card (Clickable to open in-house viewer) */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.pdfPage}
          onPress={() => {
            triggerHaptic('light');
            setIsInhouseViewerOpen(true);
          }}
        >
          {document.imageUri ? (
            <View style={styles.imageCardWrapper}>
              <Image source={{ uri: document.imageUri }} style={styles.docCardImage} resizeMode="cover" />
              <View style={styles.imageOverlayBadge}>
                <Eye size={13} color="#FFF" strokeWidth={2.5} style={{ marginRight: 4 }} />
                <Text style={styles.imageOverlayText}>Tap for in-house viewer</Text>
              </View>
            </View>
          ) : (
            <>
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
                <View style={styles.inhouseTapPill}>
                  <Eye size={12} color={Colors.skyText} strokeWidth={2.5} style={{ marginRight: 3 }} />
                  <Text style={styles.inhouseTapText}>View Document</Text>
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
            </>
          )}
        </TouchableOpacity>

        {/* Dedicated In-house Viewer Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.openInhouseBtn}
          onPress={() => {
            triggerHaptic('light');
            setIsInhouseViewerOpen(true);
          }}
        >
          <Eye size={17} color={Colors.ink} strokeWidth={2.5} style={{ marginRight: 8 }} />
          <Text style={styles.openInhouseBtnText}>
            Open In-house Document Viewer ({document.fileType})
          </Text>
        </TouchableOpacity>

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

      {/* FULL-SCREEN IN-HOUSE DOCUMENT VIEWER (PDF & IMAGES) */}
      <Modal
        visible={isInhouseViewerOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsInhouseViewerOpen(false)}
      >
        <View style={[styles.viewerSafeArea, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 52 : 36) }]}>
          <StatusBar style="light" />
          {/* Viewer Top Bar */}
          <View style={styles.viewerTopBar}>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              style={styles.viewerCloseBtn}
              onPress={() => setIsInhouseViewerOpen(false)}
            >
              <X size={22} color="#FFF" strokeWidth={2.6} />
            </TouchableOpacity>

            <View style={styles.viewerTitleBox}>
              <Text style={styles.viewerDocTitle} numberOfLines={1}>
                {document.title}
              </Text>
              <Text style={styles.viewerDocSub}>
                {document.fileName} · {document.fileType}
              </Text>
            </View>

            {/* Zoom toggles */}
            <View style={styles.zoomControls}>
              <TouchableOpacity
                onPress={() =>
                  setViewerZoom((prev) => (prev === '1x' ? '1.5x' : prev === '1.5x' ? '2x' : '1x'))
                }
                style={styles.zoomBtn}
              >
                <Text style={styles.zoomBtnText}>{viewerZoom}</Text>
              </TouchableOpacity>
            </View>
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
                styles.viewerPagePaper,
                { transform: [{ scale: zoomScale }] },
              ]}
            >
              {document.imageUri ? (
                <Image
                  source={{ uri: document.imageUri }}
                  style={styles.viewerFullImage}
                  resizeMode="contain"
                />
              ) : (
                /* High-fidelity in-house rendered document schedule */
                <View style={styles.inhousePdfSheet}>
                  <View style={styles.inhousePdfHeader}>
                    <View style={styles.inhouseLogo}>
                      <Text style={styles.inhouseLogoText}>TA</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.inhousePdfOrg}>
                        {document.details.company || 'TATA AIG GENERAL INSURANCE'}
                      </Text>
                      <Text style={styles.inhousePdfSchedule}>
                        CERTIFICATE OF INSURANCE & POLICY SCHEDULE
                      </Text>
                    </View>
                    <View style={styles.inhouseVerifiedPill}>
                      <Text style={styles.inhouseVerifiedText}>VERIFIED</Text>
                    </View>
                  </View>

                  <View style={styles.inhouseDivider} />

                  <Text style={styles.inhouseDocHeading}>{document.title}</Text>

                  {/* Document Meta Grid */}
                  <View style={styles.inhouseGrid}>
                    <View style={styles.inhouseGridCell}>
                      <Text style={styles.inhouseCellLabel}>POLICY NUMBER</Text>
                      <Text style={styles.inhouseCellValue}>
                        {document.details.policyNo || 'TAG-88231-2026'}
                      </Text>
                    </View>
                    <View style={styles.inhouseGridCell}>
                      <Text style={styles.inhouseCellLabel}>IDENTIFIER / REG</Text>
                      <Text style={styles.inhouseCellValue}>
                        {document.details.vehicleNo || '23 BH 764'}
                      </Text>
                    </View>
                    <View style={styles.inhouseGridCell}>
                      <Text style={styles.inhouseCellLabel}>VALID FROM</Text>
                      <Text style={styles.inhouseCellValue}>
                        {document.date || '24 Sep 2026'}
                      </Text>
                    </View>
                    <View style={styles.inhouseGridCell}>
                      <Text style={styles.inhouseCellLabel}>EXPIRY DATE</Text>
                      <Text style={[styles.inhouseCellValue, { color: Colors.coralDark }]}>
                        {document.expiryDate || '23 Sep 2027'}
                      </Text>
                    </View>
                  </View>

                  {/* Itemized Table */}
                  <View style={styles.inhouseTable}>
                    <View style={styles.inhouseTableHeader}>
                      <Text style={[styles.inhouseCol, { flex: 2 }]}>SECTION / COVERAGE</Text>
                      <Text style={[styles.inhouseCol, { textAlign: 'right' }]}>SUM INSURED</Text>
                    </View>
                    <View style={styles.inhouseTableRow}>
                      <Text style={[styles.inhouseRowText, { flex: 2 }]}>Own Damage Protection (Comprehensive)</Text>
                      <Text style={[styles.inhouseRowText, { textAlign: 'right' }]}>₹6,40,000</Text>
                    </View>
                    <View style={styles.inhouseTableRow}>
                      <Text style={[styles.inhouseRowText, { flex: 2 }]}>Third Party Legal Liability</Text>
                      <Text style={[styles.inhouseRowText, { textAlign: 'right' }]}>₹7,50,000</Text>
                    </View>
                    <View style={styles.inhouseTableRow}>
                      <Text style={[styles.inhouseRowText, { flex: 2 }]}>24x7 Roadside Assistance Add-on</Text>
                      <Text style={[styles.inhouseRowText, { textAlign: 'right' }]}>INCLUDED</Text>
                    </View>
                    <View style={[styles.inhouseTableRow, styles.inhouseTableTotal]}>
                      <Text style={[styles.inhouseTotalLabel, { flex: 2 }]}>TOTAL PREMIUM PAID</Text>
                      <Text style={[styles.inhouseTotalValue, { textAlign: 'right' }]}>
                        {document.details.amount || '₹18,450'}
                      </Text>
                    </View>
                  </View>

                  {/* Stamp and Security Watermark */}
                  <View style={styles.inhouseWatermark}>
                    <Text style={styles.watermarkText}>DOCLY VERIFIED 🔒</Text>
                  </View>

                  <View style={styles.inhouseFooterNotice}>
                    <Text style={styles.inhouseFooterText}>
                      Digitally preserved in Google Drive · Verified by Docly AI Extraction
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Viewer Bottom Bar */}
          <View style={styles.viewerBottomBar}>
            {isInboxItem && inboxItem ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.viewerCategoriseBtn}
                onPress={() => {
                  setIsInhouseViewerOpen(false);
                  setTimeout(() => {
                    handleConfirmInboxCategory();
                  }, 200);
                }}
              >
                <CheckCircle2 size={18} color="#06301E" strokeWidth={2.8} style={{ marginRight: 6 }} />
                <Text style={styles.viewerCategoriseBtnText}>
                  Save to {inboxItem.suggestedCategory}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.viewerShareBtn}
                onPress={doShare}
              >
                <Share2 size={18} color="#FFF" strokeWidth={2.4} style={{ marginRight: 6 }} />
                <Text style={styles.viewerShareBtnText}>Share Document</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* 3-Dots Action Sheet Modal */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => dismissMenu()}
      >
        <TouchableWithoutFeedback onPress={() => dismissMenu()}>
          <RNAnimated.View
            style={[styles.modalBackdrop, { opacity: menuBackdropOpacity }]}
          />
        </TouchableWithoutFeedback>

        <RNAnimated.View
          {...menuPanResponder.panHandlers}
          style={[
            styles.actionSheet,
            {
              paddingBottom: Math.max(insets.bottom + 16, 24),
              transform: [{ translateY: menuPanY }],
            },
          ]}
        >
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} numberOfLines={1}>{document.title}</Text>
            <Text style={styles.sheetSub}>{document.fileName}</Text>
          </View>

          <View style={styles.menuItemsList}>
            {/* View In-House */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.menuRow}
              onPress={() => {
                dismissMenu(() => {
                  setIsInhouseViewerOpen(true);
                });
              }}
            >
              <View style={[styles.menuIconBox, { backgroundColor: Colors.skyLight }]}>
                <Eye size={18} color={Colors.skyText} strokeWidth={2.4} />
              </View>
              <Text style={styles.menuRowText}>View document in-house</Text>
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.menuRow}
              onPress={handleShareFromMenu}
            >
              <View style={[styles.menuIconBox, { backgroundColor: Colors.yellowBg }]}>
                <Share2 size={18} color={Colors.yellowText} strokeWidth={2.4} />
              </View>
              <Text style={styles.menuRowText}>Share document</Text>
            </TouchableOpacity>

            {/* Open in Drive */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.menuRow}
              onPress={() => {
                dismissMenu(() => {
                  setTimeout(() => {
                    handleOpenDrive();
                  }, 150);
                });
              }}
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
              <View style={[styles.menuIconBox, { backgroundColor: Colors.grapeLight }]}>
                <FolderEdit size={18} color={Colors.grapeText} strokeWidth={2.4} />
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
              <View style={[styles.menuIconBox, { backgroundColor: '#FFE6DC' }]}>
                <Edit3 size={18} color="#C2471F" strokeWidth={2.4} />
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
        animationType="slide"
        onRequestClose={() => setIsCatPickerOpen(false)}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.catPickerModalBox}>
            <View style={styles.catPickerHeader}>
              <Text style={styles.catPickerTitle}>Choose Category</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.catPickerCloseBtn}
                onPress={() => setIsCatPickerOpen(false)}
              >
                <X size={20} color={Colors.ink} strokeWidth={2.4} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
              {categories.map((cat) => {
                const isSelected = document.category === cat.name;
                return (
                  <TouchableOpacity
                    key={cat.name}
                    activeOpacity={0.75}
                    style={[styles.catPickRow, isSelected && styles.catPickRowSelected]}
                    onPress={() => handleSelectCategory(cat.name)}
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
          </View>
        </SafeAreaView>
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
  inboxBanner: {
    backgroundColor: Colors.marigoldLight,
    borderWidth: 2,
    borderColor: Colors.marigold,
    borderRadius: Radii.lg,
    padding: 14,
    marginBottom: 14,
  },
  inboxBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inboxBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  inboxBannerTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  inboxBannerHeading: {
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: Colors.ink,
  },
  inboxBannerSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: '#5C4300',
    marginTop: 1,
  },
  confPill: {
    backgroundColor: '#FFF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  confPillText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 11,
    color: Colors.ink,
  },
  inboxActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmInboxBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mint,
    borderRadius: Radii.md,
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: Colors.mintDark,
  },
  confirmInboxBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 13,
    color: '#06301E',
  },
  changeInboxCatBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.line,
    borderBottomWidth: 2.5,
  },
  changeInboxCatBtnText: {
    fontFamily: Typography.bodyBold,
    fontSize: 12.5,
    color: Colors.ink,
  },
  pdfPage: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 4,
    borderRadius: Radii.lg,
    padding: 18,
    marginTop: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  imageCardWrapper: {
    height: 180,
    borderRadius: Radii.md,
    overflow: 'hidden',
    position: 'relative',
  },
  docCardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13,43,37,0.85)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.full,
  },
  imageOverlayText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11,
    color: '#FFF',
  },
  pHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pLogo: {
    width: 32,
    height: 32,
    borderRadius: Radii.sm,
    backgroundColor: Colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pLogoText: {
    fontFamily: Typography.displayBold,
    color: '#FFF',
    fontSize: 12,
  },
  pCompany: {
    fontFamily: Typography.displayBold,
    fontSize: 13,
    color: '#B3401F',
    letterSpacing: 0.8,
  },
  pSub: {
    fontFamily: Typography.bodyBold,
    fontSize: 8.5,
    color: Colors.muted,
  },
  inhouseTapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    backgroundColor: Colors.skyLight,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: Radii.sm,
  },
  inhouseTapText: {
    fontFamily: Typography.bodyBold,
    fontSize: 10,
    color: Colors.skyText,
  },
  pTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: Colors.ink,
    marginTop: 12,
    marginBottom: 8,
  },
  pLine: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EFEAD9',
    marginBottom: 6,
  },
  pGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: 'rgba(46,194,126,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-14deg' }],
  },
  stampText: {
    fontFamily: Typography.displayBold,
    fontSize: 9.5,
    color: 'rgba(31,161,101,0.8)',
    letterSpacing: 1,
  },
  openInhouseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 14,
  },
  openInhouseBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 14,
    color: Colors.ink,
  },
  mainTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 22,
    color: Colors.ink,
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
    backgroundColor: '#0D2B25',
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
  catPickerModalBox: {
    flex: 1,
    backgroundColor: Colors.cream,
    paddingTop: 12,
  },
  catPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.line,
    marginBottom: 12,
  },
  catPickerTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 20,
    color: Colors.ink,
  },
  catPickerCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catPickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderRadius: Radii.lg,
    borderBottomWidth: 3.5,
    marginBottom: 10,
  },
  catPickRowSelected: {
    backgroundColor: Colors.mintLight,
    borderColor: Colors.mint,
  },
  catPickEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  catPickName: {
    flex: 1,
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: Colors.ink,
  },
  catPickNameSelected: {
    color: Colors.mintText,
  },
  /* In-house Document Viewer styles */
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
    backgroundColor: 'rgba(255,255,255,0.16)',
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
  zoomControls: {
    flexDirection: 'row',
  },
  zoomBtn: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radii.sm,
  },
  zoomBtnText: {
    fontFamily: Typography.bodyExtraBold,
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
  },
  viewerPagePaper: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  viewerFullImage: {
    width: '100%',
    height: 480,
  },
  inhousePdfSheet: {
    padding: 24,
    backgroundColor: '#FFF',
  },
  inhousePdfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  inhouseLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inhouseLogoText: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: '#FFF',
  },
  inhousePdfOrg: {
    fontFamily: Typography.displayBold,
    fontSize: 13.5,
    color: '#B3401F',
    letterSpacing: 0.6,
  },
  inhousePdfSchedule: {
    fontFamily: Typography.bodyBold,
    fontSize: 9,
    color: Colors.muted,
    marginTop: 1,
  },
  inhouseVerifiedPill: {
    backgroundColor: Colors.mintLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radii.sm,
  },
  inhouseVerifiedText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 9.5,
    color: Colors.mintDark,
  },
  inhouseDivider: {
    height: 2,
    backgroundColor: '#EDE4CD',
    marginBottom: 14,
  },
  inhouseDocHeading: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: Colors.ink,
    marginBottom: 14,
  },
  inhouseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  inhouseGridCell: {
    width: '48%',
    backgroundColor: '#FBF8EF',
    padding: 9,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: '#EFE6CE',
  },
  inhouseCellLabel: {
    fontFamily: Typography.bodyBold,
    fontSize: 8.5,
    color: '#9E8F6A',
  },
  inhouseCellValue: {
    fontFamily: Typography.bodyBold,
    fontSize: 12,
    color: Colors.ink,
    marginTop: 2,
  },
  inhouseTable: {
    borderWidth: 1,
    borderColor: '#EDE4CD',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  inhouseTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5EFE0',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  inhouseCol: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 9,
    color: '#7D6D47',
  },
  inhouseTableRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE0',
  },
  inhouseRowText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11.5,
    color: Colors.ink,
  },
  inhouseTableTotal: {
    backgroundColor: '#FCFAF4',
    borderTopWidth: 2,
    borderTopColor: '#EDE4CD',
  },
  inhouseTotalLabel: {
    fontFamily: Typography.bodyBold,
    fontSize: 11,
    color: Colors.ink,
  },
  inhouseTotalValue: {
    fontFamily: Typography.displayBold,
    fontSize: 13,
    color: '#06301E',
  },
  inhouseWatermark: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE0',
    marginTop: 6,
  },
  watermarkText: {
    fontFamily: Typography.displayBold,
    fontSize: 11,
    color: 'rgba(46,194,126,0.7)',
    letterSpacing: 1.5,
  },
  inhouseFooterNotice: {
    marginTop: 6,
    alignItems: 'center',
  },
  inhouseFooterText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 9.5,
    color: Colors.muted,
  },
  viewerBottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  viewerCategoriseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mint,
    borderRadius: Radii.lg,
    paddingVertical: 14,
  },
  viewerCategoriseBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: '#06301E',
  },
  viewerShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radii.lg,
    paddingVertical: 13,
  },
  viewerShareBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 14,
    color: '#FFF',
  },
});

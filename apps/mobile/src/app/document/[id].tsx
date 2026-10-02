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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { AskSheet } from '@/components/AskSheet';
import { Colors, Typography, Radii } from '@/constants/theme';
import { ArrowLeft, MoreVertical, Cloud } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { documents, toast } = useDocly();
  const [isAskOpen, setIsAskOpen] = useState(false);

  const document = documents.find((d) => d.id === id) || documents[0];

  const handleOpenDrive = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    toast('Opening in Google Drive… ☁️');
  };

  const handleMoreActions = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    toast('Share · Download · Move to Archive…');
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
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch {}
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
});

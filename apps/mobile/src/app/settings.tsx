import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import { ArrowLeft } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
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
  } = useDocly();

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

        {/* Categories */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.row}
          onPress={() => toast('Categories customisation — coming soon')}
        >
          <Text style={styles.rowEmoji}>🏷️</Text>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Categories</Text>
            <Text style={styles.rowSub}>7 defaults · 0 custom</Text>
          </View>
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
});

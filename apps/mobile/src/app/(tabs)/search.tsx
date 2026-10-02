import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { Colors, Typography, Radii } from '@/constants/theme';
import { Search, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const SEARCH_CHIPS = ['expiring', 'HDFC statement', 'Amazon', 'passport', 'car insurance'];

export default function SearchScreen() {
  const router = useRouter();
  const { documents, searchQuery, setSearchQuery } = useDocly();

  const filteredDocs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const tokens = q.split(/\s+/);
    return documents.filter((doc) => {
      const haystack = (
        doc.title +
        ' ' +
        doc.category +
        ' ' +
        doc.path +
        ' ' +
        doc.tags.join(' ') +
        ' ' +
        (doc.expiryNotice || '') +
        ' ' +
        (doc.date || '')
      ).toLowerCase();

      return tokens.some((token) => haystack.includes(token));
    });
  }, [documents, searchQuery]);

  const handleChipPress = (chipText: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setSearchQuery(chipText);
  };

  const handleDocumentPress = (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push(`/document/${id}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.muted} strokeWidth={2.4} />
          <TextInput
            style={styles.searchInput}
            placeholder="Try “documents expiring soon”…"
            placeholderTextColor={Colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
            >
              <X size={16} color={Colors.muted} strokeWidth={2.6} />
            </TouchableOpacity>
          )}
        </View>

        {/* Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
        >
          {SEARCH_CHIPS.map((chip, index) => {
            const isActive = searchQuery.toLowerCase() === chip.toLowerCase();
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => handleChipPress(chip)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results Counter */}
        <Text style={styles.resultCount}>
          {searchQuery.trim()
            ? filteredDocs.length > 0
              ? `✨ ${filteredDocs.length} result${filteredDocs.length > 1 ? 's' : ''}`
              : 'No matches — yet'
            : 'Natural search'}
        </Text>

        <ScrollView
          style={styles.resultsScroll}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        >
          {searchQuery.trim() ? (
            filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  activeOpacity={0.8}
                  style={styles.resCard}
                  onPress={() => handleDocumentPress(doc.id)}
                >
                  <View style={styles.resCardTop}>
                    <View style={[styles.resCardEmoji, { backgroundColor: doc.bgColor }]}>
                      <Text style={styles.emojiText}>{doc.emoji}</Text>
                    </View>
                    <View style={styles.resCardInfo}>
                      <Text style={styles.resCardTitle}>{doc.title}</Text>
                      <Text style={styles.resCardMeta}>
                        {doc.path} · {doc.addedTime}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resCardFoot}>
                    <View
                      style={[
                        styles.fileTypeBadge,
                        doc.fileType === 'PDF' ? styles.pdfBadge : styles.imgBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fileTypeText,
                          doc.fileType === 'PDF' ? styles.pdfText : styles.imgText,
                        ]}
                      >
                        {doc.fileType}
                      </Text>
                    </View>

                    {doc.expiryNotice && (
                      <Text style={styles.resCardExp}>{doc.expiryNotice}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.aiTipBox}>
                <Text style={styles.aiTipEmoji}>🤷</Text>
                <Text style={styles.aiTipText}>
                  Nothing found. Docly searches OCR text, Drive and document meanings in real-time.
                </Text>
              </View>
            )
          ) : (
            <View style={styles.aiTipBox}>
              <Text style={styles.aiTipEmoji}>💡</Text>
              <Text style={styles.aiTipText}>
                Try <Text style={{ fontWeight: '800' }}>“car insurance”</Text>,{' '}
                <Text style={{ fontWeight: '800' }}>“expiring”</Text> or{' '}
                <Text style={{ fontWeight: '800' }}>“Amazon”</Text> — no folders, no filters, just natural words.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
    paddingTop: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.bodyBold,
    fontSize: 15,
    color: Colors.ink,
    marginLeft: 10,
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  chipsScroll: {
    maxHeight: 52,
    marginTop: 14,
  },
  chipsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.full,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  chipActive: {
    backgroundColor: Colors.ink,
    borderColor: Colors.ink,
  },
  chipText: {
    fontFamily: Typography.bodyBold,
    fontSize: 12.5,
    color: Colors.ink,
  },
  chipTextActive: {
    color: Colors.cream,
  },
  resultCount: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 13,
    color: Colors.muted,
    marginHorizontal: 22,
    marginTop: 14,
    marginBottom: 8,
  },
  resultsScroll: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  resCard: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    padding: 15,
    marginBottom: 11,
  },
  resCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resCardEmoji: {
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
  resCardInfo: {
    flex: 1,
  },
  resCardTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: Colors.ink,
  },
  resCardMeta: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 3,
  },
  resCardFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  fileTypeBadge: {
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
  },
  pdfBadge: {
    backgroundColor: Colors.yellowBg,
  },
  imgBadge: {
    backgroundColor: Colors.skyLight,
  },
  fileTypeText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 11,
  },
  pdfText: {
    color: Colors.yellowText,
  },
  imgText: {
    color: Colors.skyText,
  },
  resCardExp: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: Colors.coralDark,
    marginLeft: 'auto',
  },
  aiTipBox: {
    flexDirection: 'row',
    backgroundColor: Colors.marigoldLight,
    borderRadius: Radii.md,
    padding: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  aiTipEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  aiTipText: {
    flex: 1,
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: '#3F5A51',
    lineHeight: 18,
  },
});

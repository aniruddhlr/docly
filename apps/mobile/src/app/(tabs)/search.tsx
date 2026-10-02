import React, { useState, useMemo } from 'react';
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
import { Search, X, Plus, Sparkles } from 'lucide-react-native';
export default function DocumentsScreen() {
  const router = useRouter();
  const {
    documents,
    categories,
    searchQuery,
    setSearchQuery,
    triggerHaptic,
    openAddSheet,
    loadSampleData,
  } = useDocly();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filterChips = useMemo(() => {
    return [
      { id: 'All', name: 'All', emoji: '📂' },
      ...categories.map((c) => ({ id: c.id, name: c.name, emoji: c.emoji })),
    ];
  }, [categories]);

  const filteredDocs = useMemo(() => {
    let result = documents;

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (doc) =>
          doc.category.toLowerCase() === selectedCategory.toLowerCase() ||
          doc.path.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const tokens = q.split(/\s+/);
      result = result.filter((doc) => {
        const haystack = (
          doc.title +
          ' ' +
          doc.category +
          ' ' +
          doc.path +
          ' ' +
          doc.fileName +
          ' ' +
          doc.tags.join(' ') +
          ' ' +
          (doc.expiryNotice || '') +
          ' ' +
          (doc.date || '') +
          ' ' +
          (doc.details.company || '') +
          ' ' +
          (doc.details.type || '')
        ).toLowerCase();

        return tokens.every((token) => haystack.includes(token));
      });
    }

    return result;
  }, [documents, searchQuery, selectedCategory]);

  const handleChipPress = (chipId: string) => {
    triggerHaptic('light');
    setSelectedCategory((prev) => (prev === chipId && chipId !== 'All' ? 'All' : chipId));
  };

  const handleDocumentPress = (id: string) => {
    triggerHaptic('light');
    router.push(`/document/${id}` as any);
  };

  const handleClearFilters = () => {
    triggerHaptic('light');
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Documents</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {documents.length} {documents.length === 1 ? 'file' : 'files'}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.muted} strokeWidth={2.4} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents, tags, details…"
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

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
        >
          {filterChips.map((chip) => {
            const isActive = selectedCategory === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                activeOpacity={0.8}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => handleChipPress(chip.id)}
              >
                <Text style={styles.chipEmoji}>{chip.emoji}</Text>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {chip.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Status / Results Subheader */}
        <View style={styles.subHeader}>
          <Text style={styles.resultCount}>
            {searchQuery.trim() || selectedCategory !== 'All'
              ? `${filteredDocs.length} ${filteredDocs.length === 1 ? 'match' : 'matches'}`
              : `All documents (${filteredDocs.length})`}
          </Text>
          {(searchQuery.trim().length > 0 || selectedCategory !== 'All') && (
            <TouchableOpacity onPress={handleClearFilters}>
              <Text style={styles.resetText}>Reset filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Documents List or Empty State */}
        <ScrollView
          style={styles.resultsScroll}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                activeOpacity={0.8}
                style={styles.docCard}
                onPress={() => handleDocumentPress(doc.id)}
              >
                <View style={styles.docCardTop}>
                  <View style={[styles.docCardEmoji, { backgroundColor: doc.bgColor }]}>
                    <Text style={styles.emojiText}>{doc.emoji}</Text>
                  </View>
                  <View style={styles.docCardInfo}>
                    <Text style={styles.docCardTitle} numberOfLines={1}>
                      {doc.title}
                    </Text>
                    <Text style={styles.docCardMeta} numberOfLines={1}>
                      {doc.path} · {doc.addedTime}
                    </Text>
                  </View>
                </View>

                <View style={styles.docCardFoot}>
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

                  {doc.tags && doc.tags.length > 0 && (
                    <Text style={styles.docCardTag} numberOfLines={1}>
                      {doc.tags.slice(0, 2).join(' ')}
                    </Text>
                  )}

                  {doc.expiryNotice && (
                    <Text style={styles.docCardExp}>{doc.expiryNotice}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : documents.length === 0 ? (
            // Clean empty state when starting with real DB
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Text style={{ fontSize: 44 }}>📁</Text>
              </View>
              <Text style={styles.emptyTitle}>No documents yet</Text>
              <Text style={styles.emptySub}>
                All files you scan or import are safely stored in your Google Drive and organized by AI.
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addBtn}
                onPress={openAddSheet}
              >
                <Plus size={18} color="#06301E" strokeWidth={3} style={{ marginRight: 6 }} />
                <Text style={styles.addBtnText}>Add your first document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.demoBtn}
                onPress={loadSampleData}
              >
                <Sparkles size={16} color={Colors.ink} strokeWidth={2.4} style={{ marginRight: 6 }} />
                <Text style={styles.demoBtnText}>Load demo sample data</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Empty state when filters return 0 results
            <View style={styles.emptyFilterBox}>
              <Text style={styles.emptyFilterEmoji}>🔍</Text>
              <Text style={styles.emptyFilterTitle}>No documents match</Text>
              <Text style={styles.emptyFilterSub}>
                Try adjusting your search terms or selecting another category.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.clearFilterBtn}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearFilterBtnText}>Clear filters</Text>
              </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 26,
    color: Colors.ink,
  },
  countBadge: {
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.line,
    borderBottomWidth: 2.5,
    borderRadius: Radii.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  countBadgeText: {
    fontFamily: Typography.bodyBold,
    fontSize: 12,
    color: Colors.muted,
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
    marginTop: 12,
  },
  chipsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.full,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  chipActive: {
    backgroundColor: Colors.ink,
    borderColor: Colors.ink,
  },
  chipEmoji: {
    fontSize: 13,
    marginRight: 6,
  },
  chipText: {
    fontFamily: Typography.bodyBold,
    fontSize: 12.5,
    color: Colors.ink,
  },
  chipTextActive: {
    color: Colors.cream,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginTop: 12,
    marginBottom: 8,
  },
  resultCount: {
    fontFamily: Typography.bodyBold,
    fontSize: 13,
    color: Colors.muted,
  },
  resetText: {
    fontFamily: Typography.bodyBold,
    fontSize: 12.5,
    color: Colors.skyDark,
  },
  resultsScroll: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  docCard: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    padding: 14,
    marginBottom: 10,
  },
  docCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docCardEmoji: {
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
  docCardInfo: {
    flex: 1,
  },
  docCardTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: Colors.ink,
  },
  docCardMeta: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 3,
  },
  docCardFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  fileTypeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pdfBadge: {
    backgroundColor: Colors.yellowBg,
  },
  imgBadge: {
    backgroundColor: Colors.skyLight,
  },
  fileTypeText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 10.5,
  },
  pdfText: {
    color: Colors.yellowText,
  },
  imgText: {
    color: Colors.skyText,
  },
  docCardTag: {
    fontFamily: Typography.bodyBold,
    fontSize: 11,
    color: Colors.muted,
    marginLeft: 8,
  },
  docCardExp: {
    fontFamily: Typography.bodyBold,
    fontSize: 11.5,
    color: Colors.coralDark,
    marginLeft: 'auto',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: Radii.xl,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 20,
    color: Colors.ink,
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13.5,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 290,
    marginBottom: 20,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mint,
    borderRadius: Radii.lg,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderBottomWidth: 4,
    borderBottomColor: Colors.mintDark,
    marginBottom: 12,
  },
  addBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: '#06301E',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.lg,
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  demoBtnText: {
    fontFamily: Typography.bodyBold,
    fontSize: 13.5,
    color: Colors.ink,
  },
  emptyFilterBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyFilterEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyFilterTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 18,
    color: Colors.ink,
    marginBottom: 4,
  },
  emptyFilterSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFilterBtn: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3,
    borderRadius: Radii.md,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearFilterBtnText: {
    fontFamily: Typography.displayBold,
    fontSize: 13,
    color: Colors.ink,
  },
});

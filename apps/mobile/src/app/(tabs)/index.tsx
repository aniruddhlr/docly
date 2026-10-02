import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDocly } from '@/context/DoclyContext';
import { Header } from '@/components/Header';
import { CategoryTile } from '@/components/CategoryTile';
import { DocumentCard } from '@/components/DocumentCard';
import { ReminderRow } from '@/components/ReminderRow';
import { Colors, Typography, Radii } from '@/constants/theme';
import { DocumentCategory } from '@docly/shared';
import { Search } from 'lucide-react-native';
export default function HomeScreen() {
  const router = useRouter();
  const {
    documents,
    categories,
    inboxCount,
    reminders,
    openAddSheet,
    setSearchQuery,
    triggerHaptic,
    toast,
  } = useDocly();

  const handleSearchPress = () => {
    triggerHaptic('light');
    router.push('/(tabs)/search');
  };

  const handleCategoryPress = (category: DocumentCategory) => {
    triggerHaptic('light');
    setSearchQuery(category);
    router.push('/(tabs)/search');
  };

  const handleDocumentPress = (id: string) => {
    triggerHaptic('light');
    router.push(`/document/${id}` as any);
  };

  const homeCategories = categories.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        {/* Search Pill */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.searchPill}
          onPress={handleSearchPress}
        >
          <Search size={18} color={Colors.muted} strokeWidth={2.4} />
          <Text style={styles.searchPlaceholder}>What are you looking for?</Text>
        </TouchableOpacity>

        {/* Big Add Hero Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.addHero}
          onPress={openAddSheet}
        >
          <Text style={styles.sparkle}>✨</Text>
          <View style={styles.addHeroLeft}>
            <View style={styles.plusIconBox}>
              <Text style={styles.plusSign}>＋</Text>
            </View>
            <View style={styles.addHeroText}>
              <Text style={styles.addHeroTitle}>Add anything</Text>
              <Text style={styles.addHeroSub}>
                Photo, PDF, file — or share from any app
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.addHint}>
          💡 In WhatsApp? <Text style={{ fontWeight: '800' }}>Share → Docly</Text>. That’s it.
        </Text>

        {/* Inbox Row */}
        {inboxCount > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.inboxRow}
            onPress={() => router.push('/(tabs)/inbox')}
          >
            <Text style={styles.inboxEmoji}>📥</Text>
            <View style={styles.inboxTextContainer}>
              <Text style={styles.inboxTitle}>Inbox</Text>
              <Text style={styles.inboxSubtitle}>needs your attention</Text>
            </View>
            <View style={styles.inboxBadge}>
              <Text style={styles.inboxBadgeText}>{inboxCount}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Your Documents Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your documents</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
            <Text style={styles.sectionAction}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.catGrid}>
          <View style={styles.catRow}>
            <CategoryTile
              category={homeCategories[0]}
              onPress={() => handleCategoryPress(homeCategories[0].id)}
            />
            <View style={{ width: 11 }} />
            <CategoryTile
              category={homeCategories[1]}
              onPress={() => handleCategoryPress(homeCategories[1].id)}
            />
          </View>
          <View style={[styles.catRow, { marginTop: 11 }]}>
            <CategoryTile
              category={homeCategories[2]}
              onPress={() => handleCategoryPress(homeCategories[2].id)}
            />
            <View style={{ width: 11 }} />
            <CategoryTile
              category={homeCategories[3]}
              onPress={() => handleCategoryPress(homeCategories[3].id)}
            />
          </View>
        </View>

        {/* Coming Up (Only if reminders exist) */}
        {reminders.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 24 }]}>
              <Text style={styles.sectionTitle}>Coming up</Text>
            </View>

            {reminders.slice(0, 2).map((item) => (
              <ReminderRow
                key={item.id}
                reminder={item}
                onPress={() => handleDocumentPress(item.docId)}
              />
            ))}
          </>
        )}

        {/* Recently Added */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Recently added</Text>
          {documents.length > 0 && (
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={styles.sectionAction}>View all ({documents.length})</Text>
            </TouchableOpacity>
          )}
        </View>

        {documents.length > 0 ? (
          documents.slice(0, 4).map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onPress={() => handleDocumentPress(doc.id)}
            />
          ))
        ) : (
          <View style={styles.emptyRecentBox}>
            <Text style={styles.emptyRecentEmoji}>📂</Text>
            <Text style={styles.emptyRecentTitle}>No documents yet</Text>
            <Text style={styles.emptyRecentSub}>
              Tap ＋ Add anything above to scan or upload your first document.
            </Text>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: Colors.cream,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  searchPlaceholder: {
    fontFamily: Typography.bodyBold,
    fontSize: 15,
    color: Colors.muted,
    marginLeft: 10,
  },
  addHero: {
    position: 'relative',
    marginTop: 14,
    backgroundColor: Colors.marigold,
    borderRadius: Radii.xl,
    padding: 18,
    borderBottomWidth: 5,
    borderBottomColor: Colors.marigoldDark,
  },
  sparkle: {
    position: 'absolute',
    top: 12,
    right: 14,
    fontSize: 20,
  },
  addHeroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  plusSign: {
    fontFamily: Typography.displayBold,
    fontSize: 26,
    color: Colors.marigold,
    marginTop: -2,
  },
  addHeroText: {
    flex: 1,
  },
  addHeroTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 20,
    color: Colors.ink,
  },
  addHeroSub: {
    fontFamily: Typography.bodyBold,
    fontSize: 12.5,
    color: '#6B4E00',
    marginTop: 2,
  },
  addHint: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  inboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderBottomWidth: 3.5,
    borderRadius: Radii.lg,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  inboxEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  inboxTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inboxTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 16,
    color: Colors.ink,
  },
  inboxSubtitle: {
    fontFamily: Typography.bodyBold,
    fontSize: 12,
    color: Colors.muted,
  },
  inboxBadge: {
    backgroundColor: Colors.coral,
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    borderBottomWidth: 2,
    borderBottomColor: Colors.coralDark,
  },
  inboxBadgeText: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 13,
    color: '#FFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 22,
    marginBottom: 11,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 17,
    color: Colors.ink,
  },
  sectionAction: {
    fontFamily: Typography.bodyExtraBold,
    fontSize: 12,
    color: Colors.skyDark,
  },
  catGrid: {
    marginTop: 2,
  },
  catRow: {
    flexDirection: 'row',
  },
  emptyRecentBox: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.line,
    borderStyle: 'dashed',
    borderRadius: Radii.lg,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  emptyRecentEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  emptyRecentTitle: {
    fontFamily: Typography.displayBold,
    fontSize: 15,
    color: Colors.ink,
    marginBottom: 4,
  },
  emptyRecentSub: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12.5,
    color: Colors.muted,
    textAlign: 'center',
  },
});

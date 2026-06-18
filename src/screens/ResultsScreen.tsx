import React, { useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import GlassCard from '../components/GlassCard';
import BottomNav from '../components/BottomNav';
import { Colors } from '../theme/colors';
import { deriveArchetypes, deriveLifestyleTraits } from '../utils/tasteProfile';
import { Food } from '../data/foods';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH / 3 - 24;

type ResultsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Results'>;
  route: RouteProp<RootStackParamList, 'Results'>;
};

export default function ResultsScreen({
  navigation,
  route,
}: ResultsScreenProps): React.ReactElement {
  // Safe destructure
  const { liked, disliked, notSure } = route.params ?? {};

  // Safety guard at the top
  if (!liked || !disliked) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0d0d0d', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white' }}>Loading results...</Text>
      </View>
    );
  }

  const safeLiked = liked ?? [];
  const safeDisliked = disliked ?? [];
  const safeNotSure = notSure ?? [];

  const archetypes = deriveArchetypes(safeLiked);
  const traits = deriveLifestyleTraits(safeLiked);

  const [archetypePage, setArchetypePage] = useState(0);
  const archetypeScrollRef = useRef<ScrollView>(null);

  const archetypePages = [archetypes.slice(0, 3), archetypes.slice(3, 6)].filter(
    (p) => p.length > 0,
  );

  return (
    <LinearGradient colors={Colors.bgGradient} style={styles.fill}>
      <SafeAreaView style={styles.safeArea}>
        {/* Fixed header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <GlassCard style={styles.backButton}>
              <Ionicons name="chevron-back" size={18} color={Colors.white} />
            </GlassCard>
          </TouchableOpacity>

          <Text style={styles.title}>Your Taste Profile</Text>
          <Text style={styles.subtitle}>
            Tailored to your unique needs. We'll use this for recommendations and meals plans
          </Text>
          <Text style={styles.keyHighlights}>Key Highlights:</Text>
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Card 1 — Taste Archetypes */}
          <GlassCard style={styles.card}>
            <ScrollView
              ref={archetypeScrollRef}
              horizontal
              pagingEnabled={false}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const page = Math.round(
                  e.nativeEvent.contentOffset.x /
                    (SCREEN_WIDTH - 32 - 40),
                );
                setArchetypePage(page);
              }}
            >
              {archetypePages.map((page, pageIdx) => (
                <View key={`archetype-page-${pageIdx}`} style={styles.archetypePage}>
                  {page.map((item, idx) => (
                    <React.Fragment key={`archetype-item-${item.label}-${idx}`}>
                      <View style={styles.archetypeItem}>
                        <Text style={styles.archetypeEmoji}>{item.emoji}</Text>
                        <Text style={styles.archetypeLabel}>{item.label}</Text>
                      </View>
                      {idx < page.length - 1 && (
                        <View style={styles.archetypeDivider} />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              ))}
            </ScrollView>

            {/* Pagination dots */}
            {archetypePages.length > 1 && (
              <View style={styles.dotsRow}>
                {archetypePages.map((_, idx) => (
                  <View
                    key={`archetype-dot-${idx}`}
                    style={[
                      styles.dot,
                      idx === archetypePage ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>
            )}
          </GlassCard>

          {/* Card 2 — Lifestyle & Goals */}
          <GlassCard style={[styles.card, styles.cardPadded]}>
            <Text style={styles.cardHeader}>💪 Lifestyle &amp; Goals</Text>
            <Text style={styles.cardSubheader}>
              We'll use this to tailor our advice &amp; meal plan
            </Text>

            <View style={styles.divider} />

            {(traits ?? []).map((trait, idx) => (
              <React.Fragment key={`trait-${idx}`}>
                <View style={styles.traitRow}>
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={16} color="#0a0a0a" />
                  </View>
                  <Text style={styles.traitLabel}>{trait}</Text>
                </View>
                {idx < (traits ?? []).length - 1 && <View style={styles.rowDivider} />}
              </React.Fragment>
            ))}
          </GlassCard>

          {/* Card 3 — Foods You Love */}
          <GlassCard style={[styles.card, styles.cardPadded, styles.lastCard]}>
            <Text style={styles.cardHeader}>❤️ Foods You Love</Text>
            <Text style={styles.cardSubheader}>We'll Recommend These</Text>

            <View style={styles.divider} />

            {(safeLiked ?? []).length === 0 ? (
              <Text style={styles.emptyText}>No foods liked yet.</Text>
            ) : (
              (safeLiked ?? []).map((food: Food, idx: number) => (
                <React.Fragment key={`liked-${food.id}-${idx}`}>
                  <View style={styles.foodRow}>
                    <View style={styles.heartCircle}>
                      <Ionicons name="heart" size={16} color={Colors.white} />
                    </View>
                    <Text style={styles.foodName}>{food.name}</Text>
                  </View>
                  {idx < (safeLiked ?? []).length - 1 && <View style={styles.rowDivider} />}
                </React.Fragment>
              ))
            )}

            {/* Pagination dots */}
            <View style={styles.dotsRow}>
              {[0, 1, 2, 3].map((idx) => (
                <View
                  key={`food-dot-${idx}`}
                  style={[
                    styles.dot,
                    idx === 0 ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          </GlassCard>

          {/* Bottom padding for nav */}
          <View style={styles.navSpacer} />
        </ScrollView>

        {/* Bottom Nav — absolute, outside scroll */}
        <BottomNav activeTab={2} onTabPress={() => {}} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  keyHighlights: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  cardPadded: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  lastCard: {
    marginBottom: 20,
  },
  archetypePage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH - 32 - 40,
    paddingHorizontal: 8,
  },
  archetypeItem: {
    alignItems: 'center',
    width: ITEM_WIDTH,
  },
  archetypeEmoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  archetypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    marginTop: 12,
  },
  archetypeDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.white,
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  cardSubheader: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 0,
  },
  traitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  traitLabel: {
    fontSize: 15,
    color: Colors.white,
    marginLeft: 14,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  heartCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 15,
    color: Colors.white,
    marginLeft: 14,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingVertical: 16,
    textAlign: 'center',
  },
  navSpacer: {
    height: 90,
  },
});

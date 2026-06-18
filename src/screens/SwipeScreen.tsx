import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSharedValue } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { foods, Food } from '../data/foods';
import { Colors } from '../theme/colors';
import FoodCard, { FoodCardRef } from '../components/FoodCard';
import GlassCard from '../components/GlassCard';

type SwipeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Swipe'>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SwipeResult = {
  liked: Food[];
  disliked: Food[];
  notSure: Food[];
};

export default function SwipeScreen({
  navigation,
}: SwipeScreenProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult>({
    liked: [],
    disliked: [],
    notSure: [],
  });

  const topCardRef = useRef<FoodCardRef | null>(null);
  const isSuperLikeRef = useRef(false);

  // Drive shared progress for coordinated second card scaling animation
  const swipeProgress = useSharedValue(0);

  const progress = currentIndex / foods.length;

  const handleSwipeComplete = useCallback(
    (
      direction: 'like' | 'dislike' | 'notSure' | 'superlike',
      idx: number,
    ) => {
      const food = foods[idx];
      if (!food) return;

      let nextResults: SwipeResult = {
        liked: [],
        disliked: [],
        notSure: [],
      };

      setResults((prev) => {
        const next = { ...prev };
        if (direction === 'like' || direction === 'superlike') {
          next.liked = [...(prev.liked ?? []), food];
        } else if (direction === 'dislike') {
          next.disliked = [...(prev.disliked ?? []), food];
        } else {
          next.notSure = [...(prev.notSure ?? []), food];
        }
        nextResults = next;
        return next;
      });

      // Shift stack after fly-off animation completes to avoid flashes
      setTimeout(() => {
        const nextIndex = idx + 1;
        swipeProgress.value = 0; // reset progress value
        setCurrentIndex(nextIndex);

        if (nextIndex >= foods.length) {
          navigation.navigate('Results', {
            liked: nextResults.liked ?? [],
            disliked: nextResults.disliked ?? [],
            notSure: nextResults.notSure ?? [],
          });
        }
      }, 50);
    },
    [navigation, swipeProgress],
  );

  const handleNotSure = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleSwipeComplete('notSure', currentIndex);
  };

  const handleSuperLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    isSuperLikeRef.current = true;
    topCardRef.current?.swipe('like');
  };

  const currentFood = foods[currentIndex];

  if (!currentFood) {
    return (
      <View style={styles.container}>
        <Text style={{ color: Colors.textPrimary }}>Done!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ambient glows */}
      <View style={styles.glowTopLeft} />
      <View style={styles.glowBottomRight} />

      {/* Progress bar */}
      <SafeAreaView edges={['top']} style={styles.progressBarWrapper}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress * 100, 100)}%` },
            ]}
          />
        </View>
      </SafeAreaView>

      {/* Card stack — pre-render cards with stable keys */}
      <View style={styles.cardStack}>
        {foods.map((food, index) => {
          const stackPosition = index - currentIndex;
          // Render only current and the next 2 cards
          if (stackPosition < 0 || stackPosition > 2) return null;

          return (
            <FoodCard
              key={food.id} // key never changes = no remount pop
              ref={stackPosition === 0 ? topCardRef : undefined}
              food={food}
              isTop={stackPosition === 0}
              stackIndex={stackPosition}
              swipeProgress={swipeProgress}
              onSwipe={(dir) => {
                const finalDir = isSuperLikeRef.current ? 'superlike' : dir;
                isSuperLikeRef.current = false;
                handleSwipeComplete(finalDir, index);
              }}
            />
          );
        })}
      </View>

      {/* Action buttons — glass card variant */}
      <GlassCard variant="card" borderRadius={36} style={styles.buttonsCard}>
        <View style={styles.buttonsRow}>

          {/* Swipe Left — red */}
          <View style={styles.btnCol}>
            <TouchableOpacity
              style={[styles.btn, styles.btnLarge, { backgroundColor: Colors.dislike }]}
              onPress={() => topCardRef.current?.swipe('dislike')}
              activeOpacity={0.85}
            >
              <Ionicons name="close" size={34} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.btnLabel}>Swipe Left</Text>
          </View>

          {/* Not Sure — glass gray */}
          <View style={styles.btnCol}>
            <TouchableOpacity
              style={[styles.btn, styles.btnSmall, {
                backgroundColor: Colors.glassPrimary,  // #7878805C
                borderWidth: 1,
                borderColor: Colors.borderStrong,
              }]}
              onPress={() => handleNotSure()}
              activeOpacity={0.85}
            >
              <Ionicons name="help" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.btnLabel}>Not Sure</Text>
          </View>

          {/* Super Like — purple→blue gradient via LinearGradient */}
          <View style={styles.btnCol}>
            <TouchableOpacity
              style={[styles.btn, styles.btnSmall, { overflow: 'hidden' }]}
              onPress={() => handleSuperLike()}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={Colors.gradientPurpleBlue}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="star" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.btnLabel}>Super Like</Text>
          </View>

          {/* Swipe Right — CalorAI green */}
          <View style={styles.btnCol}>
            <TouchableOpacity
              style={[styles.btn, styles.btnLarge, { backgroundColor: Colors.green }]}
              onPress={() => topCardRef.current?.swipe('like')}
              activeOpacity={0.85}
            >
              <Ionicons name="heart" size={34} color="#0d0d0d" />
            </TouchableOpacity>
            <Text style={styles.btnLabel}>Swipe Right</Text>
          </View>

        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
  },
  glowTopLeft: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(75,216,131,0.08)',
    top: -80,
    left: -80,
  },
  glowBottomRight: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(120,67,255,0.08)',
    bottom: 100,
    right: -60,
  },
  progressBarWrapper: {
    width: '100%',
    zIndex: 10,
    paddingTop: 10,
  },
  progressTrack: {
    width: SCREEN_WIDTH - 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.glassPrimary, // rgba(120,120,128,0.36)
    alignSelf: 'center',
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.green, // #4BD883
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
    position: 'relative',
  },
  cardWrapper: {
    position: 'absolute',
  },
  buttonsCard: {
    marginHorizontal: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 40,
    width: SCREEN_WIDTH - 32,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnCol: {
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  btnLarge: {
    width: 68,
    height: 68,
  },
  btnSmall: {
    width: 52,
    height: 52,
  },
  btnLabel: {
    fontSize: 11,
    color: Colors.textSecondary, // #D9D9D9
    fontWeight: '500',
  },
});

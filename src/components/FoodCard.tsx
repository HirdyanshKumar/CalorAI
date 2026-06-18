import React, { useEffect, useImperativeHandle, forwardRef } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated'
import { Colors } from '../theme/colors'
import { Food } from '../data/foods'

const Extrapolate = Extrapolation;

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28   // 28% of screen width
const FLY_DISTANCE = SCREEN_WIDTH * 1.5

const SPRING_CONFIG = {
  damping: 28,        // higher = less bounce
  stiffness: 200,     // higher = snappier
  mass: 0.8,          // lower = lighter feel
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
}

const SNAP_BACK_CONFIG = {
  damping: 22,
  stiffness: 180,
  mass: 0.7,
  overshootClamping: false,
}

export type FoodCardRef = {
  swipe: (direction: 'like' | 'dislike') => void
}

interface FoodCardProps {
  food: Food
  onSwipe: (direction: 'like' | 'dislike') => void
  isTop: boolean
  stackIndex: number   // 0 = top, 1 = second, 2 = third
  swipeProgress?: SharedValue<number>
}

const FoodCard = forwardRef<FoodCardRef, FoodCardProps>(({
  food,
  onSwipe,
  isTop,
  stackIndex,
  swipeProgress,
}, ref) => {

  // ── 1. Shared values ──────────────────────────────
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const cardScale = useSharedValue(stackIndex === 0 ? 1 : stackIndex === 1 ? 0.94 : 0.88)
  const cardOffsetY = useSharedValue(stackIndex === 0 ? 0 : stackIndex === 1 ? 14 : 24)
  const cardOpacity = useSharedValue(stackIndex <= 2 ? 1 : 0)

  // ── 2. Animated styles ────────────────────────────
  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-14, 0, 14],
      Extrapolate.CLAMP
    )
    return {
      opacity: cardOpacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + cardOffsetY.value },
        { rotate: `${rotate}deg` },
        { scale: cardScale.value },
      ],
    }
  })

  const likeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP),
  }))

  const dislikeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP),
  }))

  // Like border glow
  const likeGlowStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(75,216,131,${interpolate(
      translateX.value, [0, SWIPE_THRESHOLD], [0, 0.9], Extrapolate.CLAMP
    )})`,
    borderWidth: interpolate(
      translateX.value, [0, SWIPE_THRESHOLD], [1, 3], Extrapolate.CLAMP
    ),
  }))

  const dislikeGlowStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(255,59,48,${interpolate(
      translateX.value, [-SWIPE_THRESHOLD, 0], [0.9, 0], Extrapolate.CLAMP
    )})`,
    borderWidth: interpolate(
      translateX.value, [-SWIPE_THRESHOLD, 0], [3, 1], Extrapolate.CLAMP
    ),
  }))

  // Second card responds to top card drag
  const secondCardStyle = useAnimatedStyle(() => {
    if (stackIndex !== 1 || !swipeProgress) return {}
    return {
      transform: [
        { scale: interpolate(swipeProgress.value, [0, 1], [0.94, 1]) },
        { translateY: interpolate(swipeProgress.value, [0, 1], [14, 0]) },
      ],
    }
  })

  // ── 3. useImperativeHandle ────────────────────────
  useImperativeHandle(ref, () => ({
    swipe: (direction: 'like' | 'dislike') => {
      const toX = direction === 'like' ? FLY_DISTANCE : -FLY_DISTANCE
      if (swipeProgress) {
        swipeProgress.value = 1
      }
      translateX.value = withSpring(toX, SPRING_CONFIG, () => {
        runOnJS(onSwipe)(direction)
      })
      translateY.value = withTiming(-30, { duration: 200 })
    },
  }))

  // ── 4. useEffect ──────────────────────────────────
  useEffect(() => {
    const targetScale = stackIndex === 0 ? 1 : stackIndex === 1 ? 0.94 : 0.88
    const targetY = stackIndex === 0 ? 0 : stackIndex === 1 ? 14 : 24

    cardScale.value = withSpring(targetScale, {
      damping: 22,
      stiffness: 180,
      mass: 0.6,
    })
    cardOffsetY.value = withSpring(targetY, {
      damping: 22,
      stiffness: 180,
      mass: 0.6,
    })
    cardOpacity.value = withTiming(stackIndex <= 2 ? 1 : 0, { duration: 150 })
  }, [stackIndex])

  // ── 5. Gesture ────────────────────────────────────
  const panGesture = Gesture.Pan()
    .enabled(isTop)
    .activeOffsetX([-8, 8])           // only activate on clear horizontal intent
    .failOffsetY([-20, 20])           // fail if mostly vertical (allow scrolling)
    .onUpdate((e) => {
      translateX.value = e.translationX
      translateY.value = e.translationY * 0.25
      if (swipeProgress) {
        swipeProgress.value = Math.min(
          Math.abs(e.translationX) / SWIPE_THRESHOLD, 1
        )
      }
    })
    .onEnd((e) => {
      const velocityBoost = e.velocityX * 0.08
      const effectiveX = translateX.value + velocityBoost

      if (Math.abs(effectiveX) > SWIPE_THRESHOLD || Math.abs(e.velocityX) > 800) {
        const direction = effectiveX > 0 ? 'like' : 'dislike'
        const targetX = effectiveX > 0 ? FLY_DISTANCE : -FLY_DISTANCE
        if (swipeProgress) {
          swipeProgress.value = 1
        }
        translateX.value = withSpring(targetX, SPRING_CONFIG, () => {
          runOnJS(onSwipe)(direction)
        })
        translateY.value = withTiming(-40, { duration: 200 })
      } else {
        // Snap back smoothly
        if (swipeProgress) {
          swipeProgress.value = withSpring(0)
        }
        translateX.value = withSpring(0, SNAP_BACK_CONFIG)
        translateY.value = withSpring(0, SNAP_BACK_CONFIG)
      }
    })

  // ── 6. Guard (after all hooks) ────────────────────
  if (!food) return null

  // ── 7. JSX ───────────────────────────────────────
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[
        styles.cardContainer,
        { zIndex: 100 - stackIndex },
        cardStyle,
        stackIndex === 1 && secondCardStyle,
      ]}>
        {/* Glass card base with dynamic border glow */}
        <Animated.View style={[
          styles.card,
          likeGlowStyle,
          // Override border when disliking
          translateX.value < 0 && dislikeGlowStyle,
        ]}>

          {/* Rich glass layers */}
          {/* Layer 1: dark background */}
          <View style={styles.cardBgLayer} />

          {/* Layer 2: subtle gradient shimmer */}
          <View style={styles.cardShimmerLayer} />

          {/* LIKE badge overlay */}
          <Animated.View style={[styles.likeBadge, likeOverlayStyle]}>
            <View style={styles.badgeInner}>
              <Text style={styles.likeText}>LIKE</Text>
              <Text style={styles.badgeIcon}>✓</Text>
            </View>
          </Animated.View>

          {/* NOPE badge overlay */}
          <Animated.View style={[styles.nopeBadge, dislikeOverlayStyle]}>
            <View style={styles.badgeInnerRed}>
              <Text style={styles.nopeText}>NOPE</Text>
              <Text style={styles.badgeIcon}>✗</Text>
            </View>
          </Animated.View>

          {/* Card content */}
          <View style={styles.content}>
            {/* Emoji in glass circle */}
            <View style={styles.emojiWrapper}>
              <View style={styles.emojiGlassRing} />
              <Text style={styles.emoji}>{food.emoji}</Text>
            </View>

            <Text style={styles.tagline}>{food.tagline}</Text>
          </View>

        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
})

FoodCard.displayName = 'FoodCard'

const CARD_WIDTH = SCREEN_WIDTH - 44
const CARD_HEIGHT = 460

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardBgLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28,28,32,0.93)',
    borderRadius: 28,
  },
  cardShimmerLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    // Top-left to bottom-right subtle shine
    borderTopWidth: 1.5,
    borderLeftWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.18)',
    borderLeftColor: 'rgba(255,255,255,0.08)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  likeBadge: {
    position: 'absolute',
    top: 36,
    left: 24,
    zIndex: 10,
    transform: [{ rotate: '-22deg' }],
  },
  nopeBadge: {
    position: 'absolute',
    top: 36,
    right: 24,
    zIndex: 10,
    transform: [{ rotate: '22deg' }],
  },
  badgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(75,216,131,0.20)',
    borderWidth: 2.5,
    borderColor: Colors.green,
  },
  badgeInnerRed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,59,48,0.20)',
    borderWidth: 2.5,
    borderColor: Colors.dislike,
  },
  likeText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.green,
    letterSpacing: 1.5,
  },
  nopeText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.dislike,
    letterSpacing: 1.5,
  },
  badgeIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emojiWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    width: 120,
    height: 120,
  },
  emojiGlassRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(120,120,128,0.36)',  // Fills-Primary
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  emoji: {
    fontSize: 72,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,    // #FFFFFF
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
})

export default FoodCard

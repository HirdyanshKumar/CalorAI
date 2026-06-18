import React from 'react'
import { View, StyleSheet, Platform, ViewStyle } from 'react-native'
import { BlurView } from 'expo-blur'
import { Colors } from '../theme/colors'

type GlassVariant = 'dark' | 'light' | 'green' | 'card' | 'purple'

interface GlassCardProps {
  children: React.ReactNode
  style?: ViewStyle | ViewStyle[]
  variant?: GlassVariant
  intensity?: number
  borderRadius?: number
}

// Per-variant config
const VARIANT_CONFIG: Record<GlassVariant, {
  bgColor: string
  borderColor: string
  blurTint: 'dark' | 'light' | 'default'
  shinOpacity: number
}> = {
  dark: {
    bgColor: 'rgba(30,30,35,0.72)',
    borderColor: 'rgba(255,255,255,0.14)',
    blurTint: 'dark',
    shinOpacity: 0.06,
  },
  light: {
    bgColor: 'rgba(247,247,247,0.18)',
    borderColor: 'rgba(255,255,255,0.30)',
    blurTint: 'light',
    shinOpacity: 0.12,
  },
  green: {
    bgColor: 'rgba(75,216,131,0.14)',
    borderColor: 'rgba(75,216,131,0.38)',
    blurTint: 'dark',
    shinOpacity: 0.08,
  },
  card: {
    bgColor: 'rgba(51,51,51,0.88)',       // #333333 at 88%
    borderColor: 'rgba(255,255,255,0.12)',
    blurTint: 'dark',
    shinOpacity: 0.05,
  },
  purple: {
    bgColor: 'rgba(120,67,255,0.22)',
    borderColor: 'rgba(76,198,255,0.35)',
    blurTint: 'dark',
    shinOpacity: 0.10,
  },
}

export default function GlassCard({
  children,
  style,
  variant = 'dark',
  intensity = 40,
  borderRadius = 20,
}: GlassCardProps) {
  const config = VARIANT_CONFIG[variant]

  if (Platform.OS === 'ios') {
    return (
      <View style={[
        styles.wrapper,
        { borderRadius, borderColor: config.borderColor },
        style,
      ]}>
        {/* Layer 1: base color fill so blur has something to show */}
        <View style={[
          StyleSheet.absoluteFill,
          { backgroundColor: config.bgColor, borderRadius }
        ]} />

        {/* Layer 2: actual blur */}
        <BlurView
          intensity={intensity}
          tint={config.blurTint}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />

        {/* Layer 3: top shine (simulates light hitting glass) */}
        <View style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            // Top half gets a subtle white gradient shine
            borderTopWidth: 1,
            borderTopColor: `rgba(255,255,255,${config.shinOpacity * 3})`,
          }
        ]} />

        {/* Layer 4: content */}
        <View style={{ position: 'relative' }}>
          {children}
        </View>
      </View>
    )
  }

  // Android — no BlurView, simulate glass with layered semi-transparent views
  return (
    <View style={[
      styles.wrapper,
      { borderRadius, borderColor: config.borderColor },
      style,
    ]}>
      {/* Layer 1: dark base */}
      <View style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: config.bgColor,
          borderRadius,
        }
      ]} />

      {/* Layer 2: inner glow at top (shine simulation) */}
      <View style={[
        StyleSheet.absoluteFill,
        {
          borderRadius,
          borderWidth: 1,
          borderColor: `rgba(255,255,255,${config.shinOpacity * 2})`,
          // Top border brighter than sides
          borderTopColor: `rgba(255,255,255,${config.shinOpacity * 5})`,
        }
      ]} />

      {/* Content */}
      <View style={{ position: 'relative' }}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
  },
})

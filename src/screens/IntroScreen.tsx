import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GlassCard from '../components/GlassCard';
import BottomNav from '../components/BottomNav';
import { Colors } from '../theme/colors';

type IntroScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Intro'>;
};

export default function IntroScreen({
  navigation,
}: IntroScreenProps): React.ReactElement {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <LinearGradient colors={Colors.bgGradient} style={styles.fill}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity activeOpacity={0.7}>
              <GlassCard style={styles.backButton}>
                <Ionicons name="chevron-back" size={18} color={Colors.textPrimary} />
              </GlassCard>
            </TouchableOpacity>
          </View>

          <Text style={styles.headerTitle}>Design Your Food Plan</Text>

          {/* Main Card — Rich glassmorphic card */}
          <GlassCard variant="dark" intensity={45} borderRadius={24} style={styles.mainCard}>
            <View style={styles.innerContent}>
              <Text style={styles.emoji}>😋</Text>
              <Text style={styles.cardTitle}>Build Your Taste Profile</Text>
              <Text style={styles.primaryInstruction}>
                Swipe right on foods you love, left on foods you don't.
              </Text>
              <Text style={styles.secondaryText}>
                This helps us recommend meals you'll love eating.
              </Text>

              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate('Swipe')}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaButtonText}>Start Swiping</Text>
              </TouchableOpacity>

              <Text style={styles.hintText}>Takes about 2 minutes.</Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Bottom Nav */}
        <BottomNav activeTab={0} onTabPress={() => {}} />
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
  content: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
    marginLeft: 4,
    paddingHorizontal: 20,
  },
  mainCard: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  innerContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  primaryInstruction: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  secondaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  ctaButton: {
    backgroundColor: Colors.green,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 16,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d0d0d',
  },
  hintText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

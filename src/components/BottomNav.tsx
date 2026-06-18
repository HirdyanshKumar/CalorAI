import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

type TabItem = {
  icon: 'home' | 'help-circle' | 'leaf';
  iconOutline: 'home-outline' | 'help-circle-outline' | 'leaf-outline';
  label: string;
};

const TABS: TabItem[] = [
  { icon: 'home', iconOutline: 'home-outline', label: 'Start' },
  { icon: 'help-circle', iconOutline: 'help-circle-outline', label: 'FAQ' },
  { icon: 'leaf', iconOutline: 'leaf-outline', label: 'Taste Profile' },
];

type BottomNavProps = {
  activeTab: 0 | 1 | 2 | 3;
  onTabPress: (index: number) => void;
};

export default function BottomNav({
  activeTab,
  onTabPress,
}: BottomNavProps): React.ReactElement {
  const PillContainer = ({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactElement => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          intensity={50}
          tint="dark"
          style={styles.pillContainer}
        >
          {children}
        </BlurView>
      );
    }
    return (
      <View style={[styles.pillContainer, styles.pillAndroid]}>
        {children}
      </View>
    );
  };

  const SearchCircle = (): React.ReactElement => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity onPress={() => onTabPress(3)} activeOpacity={0.7}>
          <BlurView intensity={50} tint="dark" style={styles.searchCircle}>
            <Ionicons
              name="search-outline"
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </BlurView>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => onTabPress(3)}
        activeOpacity={0.7}
        style={[styles.searchCircle, styles.searchCircleAndroid]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="rgba(255,255,255,0.7)"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.row}>
      <PillContainer>
        {TABS.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onTabPress(index)}
              activeOpacity={0.7}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
            >
              <Ionicons
                name={isActive ? tab.icon : tab.iconOutline}
                size={22}
                color={isActive ? '#4ade80' : 'rgba(255,255,255,0.55)'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </PillContainer>
      <SearchCircle />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  pillContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(30,30,30,0.97)',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  pillAndroid: {
    backgroundColor: '#1e1e1e',
  },
  tabItem: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: 'rgba(74,222,128,0.18)',
    borderRadius: 40,
  },
  tabLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '400',
  },
  tabLabelActive: {
    color: '#4ade80',
    fontWeight: '600',
  },
  searchCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(30,30,30,0.97)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  searchCircleAndroid: {
    backgroundColor: '#1e1e1e',
  },
});

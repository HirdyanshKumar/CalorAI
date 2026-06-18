import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import IntroScreen from './src/screens/IntroScreen';
import SwipeScreen from './src/screens/SwipeScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { Food } from './src/data/foods';

export type RootStackParamList = {
  Intro: undefined;
  Swipe: undefined;
  Results: { liked: Food[]; disliked: Food[]; notSure: Food[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.ReactElement {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false, animation: 'fade' }}
          >
            <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="Swipe" component={SwipeScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

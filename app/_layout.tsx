// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { useOrientation } from '../hooks/useOrientation';
import { Audio } from 'expo-av';

// Global music manager
class MusicManager {
  private static instance: MusicManager;
  private backgroundSound: Audio.Sound | null = null;
  private isPlaying: boolean = false;

  static getInstance(): MusicManager {
    if (!MusicManager.instance) {
      MusicManager.instance = new MusicManager();
    }
    return MusicManager.instance;
  }

  async startBackgroundMusic() {
    if (!this.backgroundSound && !this.isPlaying) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/background.mp3'),
          { 
            isLooping: true,
            volume: 0.3 
          }
        );
        this.backgroundSound = sound;
        await sound.playAsync();
        this.isPlaying = true;
      } catch (error) {
        console.log('Error loading background music:', error);
      }
    }
  }

  async stopBackgroundMusic() {
    if (this.backgroundSound) {
      await this.backgroundSound.stopAsync();
      await this.backgroundSound.unloadAsync();
      this.backgroundSound = null;
      this.isPlaying = false;
    }
  }

  async playEffectSound(correct: boolean) {
    try {
      const soundFile = correct 
        ? require('../assets/sounds/correct.mp3')
        : require('../assets/sounds/wrong.mp3');
      
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      setTimeout(() => sound.unloadAsync(), 2000);
    } catch (error) {
      console.log('Error playing effect sound:', error);
    }
  }

  getPlayingStatus(): boolean {
    return this.isPlaying;
  }
}

// Export for use in other components
export const musicManager = MusicManager.getInstance();

function useLandscape() {
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      const dim = Dimensions.get('screen');
      if (dim.width < dim.height) {
        // Optional: Alert users to rotate device
      }
    });

    return () => subscription?.remove();
  }, []);
}

export default function RootLayout() {
  useOrientation('LANDSCAPE');
  useLandscape();

  // Start background music when app loads
  useEffect(() => {
    musicManager.startBackgroundMusic();
    
    return () => {
      musicManager.stopBackgroundMusic();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="gameSelect" />
      <Stack.Screen name="numbersGame" />
      <Stack.Screen name="wordGame" />
      <Stack.Screen name="quizGame" />
    </Stack>
  );
}
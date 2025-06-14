// utils/soundManager.ts
import { Audio } from 'expo-av';

let backgroundSound: Audio.Sound | null = null;
let soundEnabled = true;

export const SoundManager = {
  async init() {
    if (!backgroundSound) {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/background.mp3'),
        { isLooping: true, isMuted: false }
      );
      backgroundSound = sound;
    }
  },

  async playBackground() {
    if (backgroundSound && soundEnabled) {
      await backgroundSound.playAsync();
    }
  },

  async pauseBackground() {
    if (backgroundSound) {
      await backgroundSound.pauseAsync();
    }
  },

  async stopBackground() {
    if (backgroundSound) {
      await backgroundSound.stopAsync();
    }
  },

  async playEffect(soundFile: any) {
    if (!soundEnabled) return;
    
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if ('isLoaded' in status && status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  },

  toggleSound(enable: boolean) {
    soundEnabled = enable;
    if (!enable) {
      this.pauseBackground();
    } else {
      this.playBackground();
    }
  }
};
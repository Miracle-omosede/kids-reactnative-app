// hooks/useOrientation.ts
import { useEffect } from 'react';
// import { Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export const useOrientation = (orientation: 'PORTRAIT' | 'LANDSCAPE') => {
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        orientation === 'LANDSCAPE' 
          ? ScreenOrientation.OrientationLock.LANDSCAPE 
          : ScreenOrientation.OrientationLock.PORTRAIT
      );
    };

    lockOrientation();
    
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [orientation]);
};
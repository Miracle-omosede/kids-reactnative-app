import { Text, View } from 'react-native';
import useFonts from '../hooks/useFonts';

export default function GameButton() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return <View />; // Or a loading indicator
  }

  return (
    <Text style={{ fontFamily: 'Fredoka-Bold', fontSize: 24 }}>
      Let&apos;s Play!
    </Text>
  );
}
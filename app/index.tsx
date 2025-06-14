import { ImageBackground, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import useFonts from '../hooks/useFonts';

export default function SplashScreen() {
  const router = useRouter();
  const fontsLoaded = useFonts();

  if (!fontsLoaded) return null;

  return (
    <ImageBackground 
      source={require('../assets/images/splashBg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/gameSelect')}
      >
        <Text style={styles.buttonText}>TAP TO PLAY!</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  button: {
    backgroundColor: 'rgba(255, 215, 0, 0.8)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#fff',
  },
  buttonText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
});
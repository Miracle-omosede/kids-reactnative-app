// components/GameHeader.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useFonts from '../hooks/useFonts';
import { Ionicons } from '@expo/vector-icons';

export default function GameHeader({ title, backgroundColor }: { title: string; backgroundColor: string }) {
  const router = useRouter();
  const fontsLoaded = useFonts();

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
});
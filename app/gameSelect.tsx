import { ScrollView, ImageBackground, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import useFonts from '../hooks/useFonts';

const games = [
  {
    id: 'numbers',
    title: 'Numbers Fun',
    image: require('../assets/images/numbersFun.jpg'),
  },
  {
    id: 'word',
    title: 'Word Wizard',
    image: require('../assets/images/wordWizard.jpg'),
  },
  {
    id: 'quiz',
    title: "What's This?",
    image: require('../assets/images/whatsThis.jpg'),
  },
];

export default function GameSelect() {
  const router = useRouter();
  const fontsLoaded = useFonts();

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require('../assets/images/selectGameBg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView 
        horizontal 
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => {
              if (game.id === 'numbers') router.push('/numbersGame');
              else if (game.id === 'word') router.push('/wordGame');
              else if (game.id === 'quiz') router.push('/quizGame');
            }}
          >
            <ImageBackground
              source={game.image}
              style={styles.gameImage}
              resizeMode="cover"
            >
              <View style={styles.titleContainer}>
                <Text style={styles.gameTitle}>{game.title}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gameCard: {
    width: 300,
    height: '80%',
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  gameImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
  },
  gameTitle: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
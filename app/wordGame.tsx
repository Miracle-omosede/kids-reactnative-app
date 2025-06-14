import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, ScrollView } from 'react-native';
import useFonts from '../hooks/useFonts';
import GameHeader from '../components/GameHeader';
import FeedbackModal from '../components/FeedbackModal';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { musicManager } from '../app/_layout'; // Import the global music manager

interface WordQuiz {
  image: { uri: string };
  word: string;
  options: string[];
  missingIndices: number[];
}

const wordQuizzes: WordQuiz[] = [
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2025/05/26/15/14/ai-generated-9623580_1280.png' },
    word: 'cat',
    options: ['a', 'b', 'c', 't'],
    missingIndices: [1]
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2022/04/13/16/56/puppy-7130692_1280.png' },
    word: 'dog',
    options: ['d', 'i', 'g', 'b'],
    missingIndices: [0]
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2016/03/31/23/34/emote-1297695_1280.png' },
    word: 'sun',
    options: ['m', 'w', 'n', 'e'],
    missingIndices: [2]
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2023/10/17/03/23/child-8320341_1280.png' },
    word: 'bee',
    options: ['b', 'e', 'a', 'd'],
    missingIndices: [1]
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2023/03/12/09/46/fish-7846269_1280.png' },
    word: 'fish',
    options: ['f', 'a', 'p', 'h'],
    missingIndices: [0, 3]
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2013/07/12/12/12/christmas-145319_1280.png' },
    word: 'tree',
    options: ['p', 'r', 'e', 'a'],
    missingIndices: [1, 2]
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2012/04/25/00/03/dove-41260_1280.png' },
    word: 'bird',
    options: ['b', 'i', 'r', 'o'],
    missingIndices: [2]
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2021/02/18/05/02/frog-6026117_1280.png' },
    word: 'frog',
    options: ['s', 'g', 'o', 'r'],
    missingIndices: [3]
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2015/04/20/11/51/baby-bottles-731029_1280.png' },
    word: 'milk',
    options: ['m', 'i', 'y', 'k'],
    missingIndices: [0]
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2022/05/20/12/26/duck-7209354_1280.png' },
    word: 'duck',
    options: ['d', 'u', 'c', 'e'],
    missingIndices: [1, 2]
  }
];

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export default function WordGame() {
  const [shuffledQuizzes, setShuffledQuizzes] = useState<WordQuiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const fontsLoaded = useFonts();

  useEffect(() => {
    setShuffledQuizzes(shuffleArray(wordQuizzes));
    setCompleted(new Array(wordQuizzes.length).fill(false));
    
    // Ensure background music is playing using the global manager
    if (!musicManager.getPlayingStatus()) {
      musicManager.startBackgroundMusic();
    }
  }, []);

  const selectLetter = (letter: string) => {
    if (selectedLetters.length < shuffledQuizzes[currentQuiz].missingIndices.length) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const checkAnswer = () => {
    const currentWord = shuffledQuizzes[currentQuiz].word;
    const correctLetters = shuffledQuizzes[currentQuiz].missingIndices.map(i => currentWord[i]);
    const isAnswerCorrect = selectedLetters.every((letter, i) => letter === correctLetters[i]);
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    // Play the appropriate sound effect using the global music manager
    musicManager.playEffectSound(isAnswerCorrect);

    if (isAnswerCorrect) {
      const newCompleted = [...completed];
      newCompleted[currentQuiz] = true;
      setCompleted(newCompleted);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (isAnswerCorrect && currentQuiz < shuffledQuizzes.length - 1) {
        setTimeout(() => {
          setCurrentQuiz(currentQuiz + 1);
          setSelectedLetters([]);
          setIsCorrect(null);
        }, 500);
      } else if (!isAnswerCorrect) {
        setSelectedLetters([]);
        setIsCorrect(null);
      }
    }, 1500);
  };

  const nextQuiz = () => {
    if (currentQuiz < shuffledQuizzes.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedLetters([]);
      setIsCorrect(null);
    }
  };

  const prevQuiz = () => {
    if (currentQuiz > 0) {
      setCurrentQuiz(currentQuiz - 1);
      setSelectedLetters([]);
      setIsCorrect(null);
    }
  };

  const renderWord = () => {
    const currentWord = shuffledQuizzes[currentQuiz].word;
    return currentWord.split('').map((letter, index) => {
      if (shuffledQuizzes[currentQuiz].missingIndices.includes(index)) {
        const selectedIndex = shuffledQuizzes[currentQuiz].missingIndices.indexOf(index);
        const selectedLetter = selectedLetters[selectedIndex];
        
        return (
          <View 
            key={index} 
            style={[
              styles.letterBox,
              selectedLetter && {
                backgroundColor: isCorrect ? '#4CAF50' : '#FF5252'
              }
            ]}
          >
            <Text style={styles.letterText}>{selectedLetter || "_"}</Text>
          </View>
        );
      }
      return (
        <View key={index} style={styles.letterBox}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
      );
    });
  };

  if (!fontsLoaded || shuffledQuizzes.length === 0) return null;

  return (
    <ImageBackground 
      source={require('../assets/images/gameBg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <GameHeader title="Word Wizard" backgroundColor="#FF9F43" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gameContainer}>
          <View style={styles.quizContent}>
            <Image 
              source={shuffledQuizzes[currentQuiz].image}
              style={styles.quizImage}
              resizeMode="contain"
            />
            
            <Text style={styles.title}>Complete the word!</Text>
            
            <View style={styles.wordDisplay}>
              {renderWord()}
            </View>
            
            <View style={styles.optionsContainer}>
              {shuffledQuizzes[currentQuiz].options.map((letter) => (
                <TouchableOpacity
                  key={letter}
                  style={[
                    styles.letterButton,
                    selectedLetters.includes(letter) && {
                      backgroundColor: isCorrect ? '#4CAF50' : '#FF5252'
                    }
                  ]}
                  onPress={() => isCorrect === null && selectLetter(letter)}
                  disabled={selectedLetters.includes(letter) || isCorrect !== null}
                >
                  <Text style={styles.letterText}>{letter}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.checkButton}
              onPress={checkAnswer}
              disabled={selectedLetters.length < shuffledQuizzes[currentQuiz].missingIndices.length || isCorrect !== null}
            >
              <Text style={styles.checkButtonText}>Check Answer</Text>
            </TouchableOpacity>
            
            <View style={styles.navigation}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={prevQuiz}
                disabled={currentQuiz === 0}
              >
                <Ionicons name="arrow-back" size={24} color={currentQuiz === 0 ? '#ccc' : '#fff'} />
                <Text style={[styles.navText, { color: currentQuiz === 0 ? '#ccc' : '#fff' }]}>
                  Previous
                </Text>
              </TouchableOpacity>
              
              <View style={styles.progress}>
                {shuffledQuizzes.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      {
                        backgroundColor: completed[index] 
                          ? '#4CAF50' 
                          : currentQuiz === index 
                            ? '#A55EEA' 
                            : '#ccc'
                      }
                    ]}
                  />
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.navButton}
                onPress={nextQuiz}
                disabled={currentQuiz === shuffledQuizzes.length - 1}
              >
                <Text style={[styles.navText, { color: currentQuiz === shuffledQuizzes.length - 1 ? '#ccc' : '#fff' }]}>
                  Next
                </Text>
                <Ionicons name="arrow-forward" size={24} color={currentQuiz === shuffledQuizzes.length - 1 ? '#ccc' : '#fff'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <FeedbackModal
        visible={showFeedback}
        correct={isCorrect || false}
        onClose={() => setShowFeedback(false)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quizContent: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: '#4ECDC4',
    marginVertical: 20,
    textAlign: 'center',
  },
  quizImage: {
    width: 200,
    height: 200,
    marginVertical: 15,
  },
  wordDisplay: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'center',
  },
  letterBox: {
    width: 50,
    height: 60,
    backgroundColor: '#A1D8FF',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  letterButton: {
    backgroundColor: '#A55EEA',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 5,
  },
  letterText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
  },
  checkButton: {
    backgroundColor: '#6EC5FF',
    padding: 15,
    borderRadius: 20,
    marginVertical: 20,
    alignItems: 'center',
    elevation: 5,
    width: '100%',
  },
  checkButtonText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    minWidth: 100,
    justifyContent: 'center',
  },
  navText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    marginHorizontal: 5,
    color: 'white',
  },
  progress: {
    flexDirection: 'row',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
});
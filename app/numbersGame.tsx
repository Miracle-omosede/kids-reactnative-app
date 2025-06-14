// screens/NumbersGame.tsx
import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import useFonts from '../hooks/useFonts';
import GameHeader from '../components/GameHeader';
import FeedbackModal from '../components/FeedbackModal';
import { Ionicons } from '@expo/vector-icons';
import { musicManager } from '../app/_layout';

interface NumberPuzzle {
  question: string;
  items?: number;
  options: number[];
  answer: number;
}

const puzzles: NumberPuzzle[] = [
  {
    question: "How many apples?",
    items: 3,
    options: [2, 3, 4, 5],
    answer: 3
  },
  {
    question: "What comes after 4?",
    options: [3, 5, 6, 7],
    answer: 5
  },
  {
    question: "2 + 1 = ?",
    options: [2, 3, 4, 5],
    answer: 3
  },
  {
    question: "5 - 2 = ?",
    options: [1, 2, 3, 4],
    answer: 3
  },
  {
    question: "2 × 3 = ?",
    options: [4, 5, 6, 7],
    answer: 6
  },
  {
    question: "6 ÷ 2 = ?",
    options: [2, 3, 4, 5],
    answer: 3
  }
];

// Helper function to shuffle array
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function NumbersGame() {
  const [shuffledPuzzles, setShuffledPuzzles] = useState<NumberPuzzle[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const fontsLoaded = useFonts();

  // Initialize game with shuffled questions
  useEffect(() => {
    setShuffledPuzzles(shuffleArray(puzzles));
    setCompleted(new Array(puzzles.length).fill(false));
  }, []);

  const checkAnswer = (answer: number) => {
    const isAnswerCorrect = answer === shuffledPuzzles[currentPuzzle].answer;
    setSelectedAnswer(answer);
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    // Play correct or wrong sound using global music manager
    musicManager.playEffectSound(isAnswerCorrect);

    if (isAnswerCorrect) {
      const newCompleted = [...completed];
      newCompleted[currentPuzzle] = true;
      setCompleted(newCompleted);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (isAnswerCorrect && currentPuzzle < shuffledPuzzles.length - 1) {
        setTimeout(() => {
          setCurrentPuzzle(currentPuzzle + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        }, 500);
      } else if (!isAnswerCorrect) {
        // Reset for retry on wrong answer
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 1500);
  };

  const goToNextPuzzle = () => {
    if (currentPuzzle < shuffledPuzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const goToPreviousPuzzle = () => {
    if (currentPuzzle > 0) {
      setCurrentPuzzle(currentPuzzle - 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const renderItems = () => {
    const puzzle = shuffledPuzzles[currentPuzzle];
    if (!puzzle.items) return null;

    return (
      <View style={styles.itemsContainer}>
        {Array.from({ length: puzzle.items }).map((_, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.emoji}>🍎</Text>
          </View>
        ))}
      </View>
    );
  };

  if (!fontsLoaded || shuffledPuzzles.length === 0) return null;

  return (
    <ImageBackground 
      source={require('../assets/images/gameBg.jpg')} 
      style={styles.container}
      resizeMode="cover"
    >
      <GameHeader title="Number Fun" backgroundColor="#6EC5FF" />
      
      <View style={styles.gameContainer}>
        <Text style={styles.question}>{shuffledPuzzles[currentPuzzle].question}</Text>
        
        {renderItems()}
        
        <View style={styles.optionsContainer}>
          {shuffledPuzzles[currentPuzzle].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && {
                  backgroundColor: isCorrect ? '#4CAF50' : '#FF5252'
                }
              ]}
              onPress={() => !selectedAnswer && checkAnswer(option)}
              disabled={!!selectedAnswer && !completed[currentPuzzle]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.navigation}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={goToPreviousPuzzle}
            disabled={currentPuzzle === 0}
          >
            <Ionicons name="arrow-back" size={24} color={currentPuzzle === 0 ? '#ccc' : '#fff'} />
            <Text style={[styles.navText, { color: currentPuzzle === 0 ? '#ccc' : '#fff' }]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <View style={styles.progress}>
            {shuffledPuzzles.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: completed[index] 
                      ? '#4CAF50' 
                      : currentPuzzle === index 
                        ? '#6EC5FF' 
                        : '#ccc'
                  }
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={goToNextPuzzle}
            disabled={currentPuzzle === shuffledPuzzles.length - 1}
          >
            <Text style={[styles.navText, { color: currentPuzzle === shuffledPuzzles.length - 1 ? '#ccc' : '#fff' }]}>
              Next
            </Text>
            <Ionicons name="arrow-forward" size={24} color={currentPuzzle === shuffledPuzzles.length - 1 ? '#ccc' : '#fff'} />
          </TouchableOpacity>
        </View>
      </View>
      
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
  gameContainer: {
    width: '95%',
    maxWidth: 800,
    padding: 10,
    marginVertical: 10,
    alignSelf: 'center',
  },
  question: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
    color: '#FF6B6B',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  item: {
    margin: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  emoji: {
    fontSize: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF9F43',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 5,
  },
  optionText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
    color: 'white',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#A55EEA',
    minWidth: 100,
    justifyContent: 'center',
  },
  navText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 18,
    marginHorizontal: 5,
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
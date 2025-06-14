// screens/QuizGame.tsx
import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, ScrollView } from 'react-native';
import useFonts from '../hooks/useFonts';
import GameHeader from '../components/GameHeader';
import FeedbackModal from '../components/FeedbackModal';
import { Ionicons } from '@expo/vector-icons';
import { musicManager } from '../app/_layout';

interface QuizItem {
  image: { uri: string };
  options: string[];
  answer: string;
}
const objectQuizzes: QuizItem[] = [
  {
    image: { uri: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    options: ['Banana', 'Orange', 'Apple', 'Grapes'],
    answer: 'Apple'
  },
  {
    image: { uri: 'https://images.unsplash.com/photo-1456082902841-3335005c3082?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    options: [ 'Bus', 'Bike', 'Truck', 'Car'],
    answer: 'Car'
  },
  {
    image: { uri: 'https://images.unsplash.com/photo-1626435872665-2e39a0614b4e?q=80&w=1118&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    options: ['Dog', 'Cat', 'Rabbit', 'Bird'],
    answer: 'Dog'
  },
  {
    image: { uri: 'https://images.unsplash.com/photo-1516567727245-ad8c68f3ec93?q=80&w=1049&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    options: [ 'Box', 'Book', 'Bag', 'Ball'],
    answer: 'Ball'
  },
  {
    image: { uri: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    options: ['Book', 'Flower', 'Tree', 'House'],
    answer: 'Book'
  },
  {
    image: { uri: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    options: ['Dog', 'Cat', 'Horse', 'Cow'],
    answer: 'Dog'
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2014/04/03/00/33/chair-308688_1280.png' },
    options: [ 'Table', 'Sofa','Chair', 'Lamp'],
    answer: 'Chair'
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2013/07/13/09/51/drink-156158_1280.png' },
    options: [ 'Plate','Cup', 'Spoon', 'Fork'],
    answer: 'Cup'
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2013/07/13/11/46/laptop-158648_1280.png' },
    options: ['Phone', 'Laptop', 'Tablet', 'Camera'],
    answer: 'Laptop'
  },
  {
    image: { uri: 'https://cdn.pixabay.com/photo/2014/03/24/17/07/high-heels-295093_1280.png' },
    options: ['Shoe', 'Shirt', 'Hat', 'Glove'],
    answer: 'Shoe'
  }
];

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export default function QuizGame() {
  const [shuffledQuizzes, setShuffledQuizzes] = useState<QuizItem[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const fontsLoaded = useFonts();

  useEffect(() => {
    setShuffledQuizzes(shuffleArray(objectQuizzes));
    setCompleted(new Array(objectQuizzes.length).fill(false));
  }, []);

  const checkAnswer = (option: string) => {
    const isAnswerCorrect = option === shuffledQuizzes[currentQuiz].answer;
    setSelectedAnswer(option);
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    // Play correct or wrong sound using global music manager
    musicManager.playEffectSound(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(score + 1);
      const newCompleted = [...completed];
      newCompleted[currentQuiz] = true;
      setCompleted(newCompleted);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (isAnswerCorrect && currentQuiz < shuffledQuizzes.length - 1) {
        setTimeout(() => {
          setCurrentQuiz(currentQuiz + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        }, 500);
      } else if (!isAnswerCorrect) {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 1500);
  };

  const nextQuiz = () => {
    if (currentQuiz < shuffledQuizzes.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const prevQuiz = () => {
    if (currentQuiz > 0) {
      setCurrentQuiz(currentQuiz - 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  if (!fontsLoaded || shuffledQuizzes.length === 0) return null;

  return (
    <ImageBackground 
      source={require('../assets/images/gameBg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <GameHeader title="What's This?" backgroundColor="#4CAF50" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gameContainer}>
          <View style={styles.quizContent}>
            <Image 
              source={shuffledQuizzes[currentQuiz].image}
              style={styles.quizImage}
              resizeMode="contain"
            />
            <Text style={styles.score}>Score: {score}/{shuffledQuizzes.length}</Text>
            
            <Text style={styles.question}>What&apos;s this?</Text>
            
            <View style={styles.optionsContainer}>
              {shuffledQuizzes[currentQuiz].options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && {
                      backgroundColor: isCorrect ? '#4CAF50' : '#FF5252'
                    }
                  ]}
                  onPress={() => !selectedAnswer && checkAnswer(option)}
                  disabled={!!selectedAnswer && !completed[currentQuiz]}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
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
  quizImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#FF9F43',
  },
  score: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 24,
    color: '#FF6B6B',
    marginTop: 20,
    textAlign: 'center',
  },
  question: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 32,
    color: '#A55EEA',
    marginVertical: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginVertical: 20,
  },
  optionButton: {
    backgroundColor: '#6EC5FF',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    elevation: 5,
    width: '100%',
  },
  optionText: {
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
    backgroundColor: '#FF9F43',
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
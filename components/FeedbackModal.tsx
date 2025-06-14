// components/FeedbackModal.tsx
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FeedbackModal({ visible, correct, onClose }: {
  visible: boolean;
  correct: boolean;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={[
          styles.modalContent,
          { backgroundColor: correct ? '#4CAF50' : '#FF5252' }
        ]}>
          <Ionicons 
            name={correct ? 'checkmark-circle' : 'close-circle'} 
            size={60} 
            color="white" 
          />
          <Text style={styles.feedbackText}>
            {correct ? 'Correct! 🎉' : 'Try Again! 🤔'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  feedbackText: {
    fontFamily: 'Fredoka-Bold',
    fontSize: 28,
    color: 'white',
    marginTop: 15,
  },
});
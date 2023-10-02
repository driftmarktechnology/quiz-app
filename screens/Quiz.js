import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  StatusBar,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { BackHandler } from "react-native";
import i18n from "../locales/i18n";

const Quiz = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showCloseQuizModal, setShowCloseQuizModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const db = getFirestore();
      const questionsCollection = collection(db, "questions");
      const dataSnapshot = await getDocs(questionsCollection); // This line gets the actual data
      console.log(dataSnapshot, "dataSnapshot");
      const fetchedQuestions = dataSnapshot.docs.map((doc) => doc.data());
      setQuestions(fetchedQuestions);
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const backAction = () => {
      setShowCloseQuizModal(true);
      return true; // This will prevent the default back button action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const [userAnswers, setUserAnswers] = useState(
    Array(questions.length).fill(null)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswer = (option) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);

    if (option === questions[currentQuestionIndex].answer) {
      setCorrectAnswers((prev) => prev + 1);
    }

    if (currentQuestionIndex === questions.length - 1) {
      setShowModal(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(60); // reset timer for the next question
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.quizTitle}>Quiz Challenge</Text>

      <View style={styles.header}>
        <Text style={styles.timerContainer}>
          <Text style={styles.timerValue}>
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}{" "}
            minutes
          </Text>
        </Text>

        <View style={[styles.questionContainer, styles.card]}>
          <Text style={styles.question}>
            {questions &&
              questions.length > 0 &&
              questions[currentQuestionIndex].questions}
          </Text>
        </View>

        {questions &&
          questions.length > 0 &&
          questions[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionWhite,
                userAnswers[currentQuestionIndex] === option && {
                  backgroundColor: "#ecf0f1",
                  borderColor: "blue",
                },
              ]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionTextBlack}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.control,
            styles.controlPrev,
            currentQuestionIndex === 0 && styles.disabledButton, // Apply disabled styles if on the first question
          ]}
          onPress={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
          disabled={currentQuestionIndex === 0} // Disable button functionality if on the first question
        >
          <Text style={styles.controlText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.control}
          onPress={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, questions.length - 1)
            )
          }
        >
          <Text style={styles.controlText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.control, styles.controlNext]}
          onPress={() => handleAnswer()}
        >
          <Text style={styles.controlText}>Next</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Correct Answers: {correctAnswers}
            </Text>
            <Text style={styles.modalText}>
              Incorrect Answers: {questions.length - correctAnswers}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowModal(false);
                navigation.navigate(i18n.t("Home")); // Assuming 'Home' is the name of your home screen in the navigator
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCloseQuizModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Are you sure you want to close the Quiz?
            </Text>
            <TouchableOpacity
              style={styles.yesButton}
              onPress={() => {
                setShowCloseQuizModal(false);
                setShowModal(true);
              }}
            >
              <Text style={styles.closeButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCloseQuizModal(false)}
            >
              <Text style={styles.closeButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 20,
  },
  header: {
    flex: 2, // Adjusted for more space
    justifyContent: "space-evenly", // Added for better alignment
    alignItems: "center",
  },
  timer: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 20,
  },
  questionContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  question: {
    fontSize: 24,
    textAlign: "center",
    color: "black",
  },
  option: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#3498DB",
    width: "90%",
    borderRadius: 15,
    alignItems: "center",
    alignSelf: "center",
    elevation: 3,
  },
  optionText: {
    color: "white",
    fontSize: 18,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
    alignSelf: "center",
  },
  control: {
    padding: 10,
    backgroundColor: "#2980B9",
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  controlText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)", // made it slightly more opaque
  },
  modalText: {
    fontSize: 26,
    color: "white",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  quizTitle: {
    fontSize: 28,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#e67e22",
    elevation: 5,
  },
  timerLabel: {
    fontSize: 18,
    color: "#ecf0f1",
  },
  timerValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ecf0f1",
  },
  card: {
    backgroundColor: "#ecf0f1",
    padding: 15,
    borderRadius: 15,
    width: "90%",
    alignSelf: "center",
    elevation: 5,
    marginBottom: 20,
  },
  optionWhite: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "white",
    width: "90%",
    borderRadius: 15,
    alignItems: "center",
    alignSelf: "center",
    elevation: 3,
    borderColor: "#3498DB",
    borderWidth: 1,
  },
  optionTextBlack: {
    color: "black",
    fontSize: 18,
  },
  questionBlack: {
    fontSize: 24,
    textAlign: "center",
    color: "#2c3e50", // Adjusted color for visibility on white background
  },
  optionTextBlack: {
    color: "black",
    fontSize: 18,
    textAlign: "left", // Adjusted alignment
    flex: 1, // Takes full width available within the TouchableOpacity
  },
  optionWhite: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "white",
    width: "90%",
    borderRadius: 15,
    flexDirection: "row", // Adjusted for alignment
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    elevation: 3,
    borderColor: "#3498DB",
    borderWidth: 1,
  },
  disabledButton: {
    backgroundColor: "#bdc3c7", // A grayish color to indicate the button is disabled
    borderColor: "#95a5a6",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker opacity
  },
  modalBox: {
    // New style for modal box
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 22, // Reduced font size for better UI
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 30,
    margin: 10, // Added margin for spacing
  },
  yesButton: {
    // Separate style for 'yes' to give a different color
    backgroundColor: "#3498DB",
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 30,
    margin: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Quiz;

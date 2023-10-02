import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const navigateToPdfViewer = (item) => {
    navigation.navigate("PdfViewer", { question: item }); // Assuming you want to pass the whole question object to PdfViewer page
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const questionSnapshot = await getDocs(
        collection(database, "lastyearQuestionPapers")
      );
      const questionList = questionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setQuestions(questionList);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  };

  const renderQuestion = ({ item }) => (
    <TouchableOpacity
      style={styles.questionCard}
      onPress={() => navigateToPdfViewer(item)}
    >
      <Text style={styles.questionText}>Name: {item.questionpaper.name}</Text>
    </TouchableOpacity>
  );
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={questions}
      renderItem={renderQuestion}
      keyExtractor={(item) => item.id}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    alignItems: "center",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

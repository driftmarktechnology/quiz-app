import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Books() {
  const navigation = useNavigation();

  const BOOK_CLASSES = [6, 7, 8, 9, 10, 11, 12];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.booksContainer}>
        {BOOK_CLASSES.map((bookClass) => (
          <TouchableOpacity
            key={bookClass}
            style={styles.bookCard}
            onPress={() => {
              navigation.navigate("Medium");
            }}
          >
            <Ionicons name="ios-school-outline" size={32} color="blue" />
            <Text style={styles.bookTitle}>Class {bookClass} Books</Text>
            <Ionicons name="ios-arrow-forward" size={24} color="gray" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  booksContainer: {
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  bookTitle: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
});

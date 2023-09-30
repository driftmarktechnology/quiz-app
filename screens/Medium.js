import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function Medium() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {["Tamil", "English"].map((term, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            navigation.navigate("Subject");
          }}
        >
          <Text style={styles.cardTitle}>{term}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Medium;

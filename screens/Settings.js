import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo's vector icons

function Settings() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://www.w3schools.com/w3images/avatar2.png" }}
        style={styles.profileImage}
      />
      <Text style={styles.accountBalance}>Your Account Balance: 100</Text>

      <View style={styles.row}>
        <Card title="Language" iconName="ios-globe" />
        <Card title="Color Mode" iconName="ios-color-palette" />
      </View>

      <View style={styles.row}>
        <Card title="Privacy Policy" iconName="ios-lock-closed" />
        <Card title="Terms & Conditions" iconName="ios-document-text" />
      </View>
      <View style={styles.row}>
        <Card title="Withdraw Now" iconName="wallet" />
        <Card title="Withdraw History" iconName="time" />
      </View>
    </View>
  );
}

const Card = ({ title, iconName }) => (
  <TouchableOpacity style={styles.card}>
    {iconName && <Ionicons name={iconName} size={24} color="black" />}
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "48%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "500",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // To make it rounded
    alignSelf: "center",
    marginBottom: 10,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Settings;

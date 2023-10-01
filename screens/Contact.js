import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

function Contact() {
  const handleEmailPress = () => {
    const url = "mailto:example@example.com"; // replace with your email
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open this URL:", url);
      }
    });
  };

  const handlePhonePress = () => {
    const url = "tel:+1234567890"; // replace with your phone number
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open this URL:", url);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Us</Text>

      <TouchableOpacity style={styles.contactOption} onPress={handleEmailPress}>
        <Text style={styles.contactText}>Email: example@example.com</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactOption} onPress={handlePhonePress}>
        <Text style={styles.contactText}>Phone: +1234567890</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#3498db",
  },
  contactOption: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
    alignItems: "center",
  },
  contactText: {
    fontSize: 20,
  },
});

export default Contact;

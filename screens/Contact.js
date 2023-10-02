import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import {
  BannerAd,
  TestIds,
  BannerAdSize,
} from "react-native-google-mobile-ads";

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

      <View style={styles.card}>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.contactLabel}>Email</Text>
          <Text style={styles.contactInfo}>example@example.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePhonePress}
          style={styles.phoneContainer}
        >
          <Text style={styles.contactLabel}>Phone</Text>
          <Text style={styles.contactInfo}>+1234567890</Text>
        </TouchableOpacity>
      </View>
      <BannerAd size={BannerAdSize.BANNER} unitId={TestIds.BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#3498db",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contactLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 22,
    fontWeight: "500",
    color: "#2c3e50",
    borderBottomWidth: 1,
    borderBottomColor: "#bdc3c7",
    paddingBottom: 10,
    marginBottom: 15,
  },
  phoneContainer: {
    marginTop: 10,
  },
});

export default Contact;

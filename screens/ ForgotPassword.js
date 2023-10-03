// ForgotPassword.js

import React, { useState } from "react";
import {
  View,
  TextInput,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import i18n from "../locales/i18n";

const backImage = require("../assets/backImage.jpg");
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ForgotPassword({ navigation }) {
  const [isLoading, setIsLoading] = useState(false); // State to track submission

  const forgotPassword = (Email) => {
    setIsLoading(true);
    console.log("Attempting to send reset email to " + Email);
    sendPasswordResetEmail(auth, Email, null)
      .then(() => {
        console.log("Reset email sent to " + Email);
        alert("Reset email sent to " + Email);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Error sending reset email: ", e);
        alert("Error sending reset email. Please try again.");
        setIsLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(i18n.t("Invalid email address"))
        .required(i18n.t("This field is Required")),
    }),
    onSubmit: (values) => {
      forgotPassword(values?.email);
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* Add your UI here similar to the Login screen. Only showing the email input for simplicity */}
        <Image source={backImage} style={styles.backImage} />
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Text style={styles.title}> {i18n.t("Forgot Password")}</Text>
          <TextInput
            style={styles.input}
            placeholder={i18n.t("Enter email")}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <Text style={{ color: "red" }}>{formik.errors.email}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.button}
            onPress={formik.handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
                {i18n.t("Submit")}
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: screenHeight * 0.04, // 5% of screen height
    fontWeight: "bold",
    color: "orange",
    alignSelf: "center",
    paddingBottom: screenHeight * 0.03, // 3% of screen height
  },
  whiteSheet: {
    width: "100%",
    height: "75%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#e7e7e7",
    borderTopLeftRadius: screenHeight * 0.075, // 7.5% of screen height
  },
  backImage: {
    width: "100%",
    height: screenHeight * 0.3, // 30% of screen height
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: screenWidth * 0.075, // 7.5% of screen width
    marginTop: screenHeight * 0.1, // 10% of screen height
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: screenHeight * 0.07, // 7% of screen height
    marginBottom: screenHeight * 0.02, // 2% of screen height
    fontSize: screenHeight * 0.022, // 2.2% of screen height
    borderRadius: 10,
    padding: screenWidth * 0.03, // 3% of screen width
  },
  button: {
    backgroundColor: "#f57c00",
    height: screenHeight * 0.075, // 7.5% of screen height
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: screenHeight * 0.05, // 5% of screen height
  },
});

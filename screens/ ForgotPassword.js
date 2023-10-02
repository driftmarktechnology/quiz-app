// ForgotPassword.js

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
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
    fontSize: 36,
    fontWeight: "bold",
    color: "orange",
    alignSelf: "center",
    paddingBottom: 24,
  },
  whiteSheet: {
    width: "100%",
    height: "75%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#e7e7e7",
    borderTopLeftRadius: 60,
  },
  backImage: {
    width: "100%",
    height: 240,
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: "#f57c00",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});

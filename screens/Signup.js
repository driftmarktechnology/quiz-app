import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
const backImage = require("../assets/backImage.jpg");
import { useFormik } from "formik";
import * as Yup from "yup";
import i18n from "../locales/i18n";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function Signup({ navigation }) {
  const [isLoading, setIsLoading] = useState(false); // State to track submission
  const onHandleSignup = (email, password) => {
    setIsLoading(true); // Start loading

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("Signup success");
        setIsLoading(false);
      })
      .catch((err) => {
        Alert.alert("Signup error", err.message);
        setIsLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(i18n.t("Invalid email address"))
        .required(i18n.t("This field is Required")),
      password: Yup.string()
        .min(6, i18n.t("Password must be at least 6 characters"))
        .required(i18n.t("This field is Required")),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted with", values);
      onHandleSignup(values.email, values.password);
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={backImage} style={styles.backImage} />
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Text style={styles.title}>{i18n.t("Sign Up")}</Text>
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
          <TextInput
            style={styles.input}
            placeholder={i18n.t("Enter password")}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            textContentType="password"
            value={formik.values.password}
            onChangeText={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <Text style={{ color: "red" }}>{formik.errors.password}</Text>
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
                {i18n.t("Sign Up")}
              </Text>
            )}
          </TouchableOpacity>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>
              {i18n.t("already I have account?")}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{ color: "#f57c00", fontWeight: "600", fontSize: 14 }}
              >
                {i18n.t("Login")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <StatusBar barStyle="light-content" />
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: screenHeight * 0.05, // 5% of screen height
    fontWeight: "bold",
    color: "orange",
    alignSelf: "center",
    paddingBottom: screenHeight * 0.03, // 3% of screen height
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: screenHeight * 0.07, // 7% of screen height
    marginBottom: screenHeight * 0.02, // 2% of screen height
    fontSize: screenHeight * 0.022, // 2.2% of screen height
    borderRadius: 10,
    padding: screenWidth * 0.03, // 3% of screen width
  },
  backImage: {
    width: "100%",
    height: screenHeight * 0.3, // 30% of screen height
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  whiteSheet: {
    width: "100%",
    height: "75%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#e7e7e7",
    borderTopLeftRadius: screenHeight * 0.075, // 7.5% of screen height
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: screenWidth * 0.075, // 7.5% of screen width
    marginTop: screenHeight * 0.1, // 10% of screen height
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

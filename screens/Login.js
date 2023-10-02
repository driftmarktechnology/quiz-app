import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
const backImage = require("../assets/backImage.jpg");
import { useFormik } from "formik";
import * as Yup from "yup";
import i18n from "../locales/i18n";

export default function Login({ navigation }) {
  const [isLoading, setIsLoading] = useState(false); // State to track submission

  const onHandleLogin = (email, password) => {
    if (email !== "" && password !== "") {
      setIsLoading(true); // Start loading
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("Login success");
          setIsLoading(false); // End loading
        })
        .catch((err) => {
          Alert.alert("Login error", err.message);
          setIsLoading(false); // End loading
        });
    }
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
      onHandleLogin(values.email, values.password);
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={backImage} style={styles.backImage} />
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Text style={styles.title}>{i18n.t("Log In")}</Text>
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
                {i18n.t("Log In")}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>
              {i18n.t("Forgot Password?")}
            </Text>
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
              {i18n.t("Don't have an account?")}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text
                style={{ color: "#f57c00", fontWeight: "600", fontSize: 14 }}
              >
                {i18n.t("Sign Up")}
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
    fontSize: 36,
    fontWeight: "bold",
    color: "orange",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: "100%",
    height: 240,
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
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: "#f57c00",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  forgotPasswordButton: {
    marginTop: 15,
    marginBottom: 20,
    alignSelf: "center",
  },

  forgotPasswordText: {
    color: "#f57c00", // Color
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

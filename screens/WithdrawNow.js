import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import {
  BannerAd,
  TestIds,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from "react-native-google-mobile-ads";

const { width: screenWidth } = Dimensions.get("window");
const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});

function WithdrawNow({ navigation }) {
  const db = getFirestore();
  const [loading, setLoading] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Ad events
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setAdLoaded(true);
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error("Interstitial Ad Error: ", error);
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
    };
  }, []);

  useEffect(() => {
    if (adLoaded) {
      interstitial.show();
    }
  }, [adLoaded]);

  const formik = useFormik({
    initialValues: { upiID: "", amount: "" },
    validationSchema: Yup.object({
      upiID: Yup.string().required("UPI ID is required"),
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount should be positive")
        .integer("Amount should be an integer"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const currentDate = new Date();
        const collectionRef = collection(db, "withdrawRequest");
        await addDoc(collectionRef, {
          upiID: values.upiID,
          amount: values.amount,
          email: auth.currentUser.email,
          date: currentDate.toDateString(),
          time: currentDate.toLocaleTimeString(),
          status: "pending",
        });
        Alert.alert(
          "Withdrawal Request",
          "Your withdrawal request has been successfully submitted!"
        );
        formik.resetForm();
      } catch (error) {
        Alert.alert(
          "Error",
          "There was an issue with the withdrawal request. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.headerText}>Withdraw Funds</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your UPI ID"
              value={formik.values.upiID}
              onChangeText={formik.handleChange("upiID")}
              onBlur={formik.handleBlur("upiID")}
            />
            {formik.touched.upiID && formik.errors.upiID && (
              <Text style={styles.errorText}>{formik.errors.upiID}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              value={formik.values.amount}
              onChangeText={formik.handleChange("amount")}
              onBlur={formik.handleBlur("amount")}
              keyboardType="numeric"
            />
            {formik.touched.amount && formik.errors.amount && (
              <Text style={styles.errorText}>{formik.errors.amount}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Request Withdrawal</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ width: 100 }}>
          <BannerAd size={BannerAdSize.BANNER} unitId={TestIds.BANNER} />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#3498db",
  },
  inputContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    width: screenWidth - 40,
    elevation: 5,
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default WithdrawNow;

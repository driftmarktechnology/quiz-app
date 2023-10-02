import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import i18n from "../locales/i18n";

const Dots = ({ selected }) => {
  let backgroundColor;

  backgroundColor = selected ? "#000" : "#ccc";

  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};
const OnboardingScreen = ({ navigation }) => {
  return (
    <Onboarding
      DotComponent={Dots}
      onSkip={() => navigation.replace("Home")}
      onDone={() => navigation.replace("Home")}
      skipLabel={i18n.t("Skip")} // Setting the Skip label
      nextLabel={i18n.t("Next")}
      pages={[
        {
          backgroundColor: "#a6e4d0",
          image: (
            <Image
              source={require("../assets/image1.png")}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
            />
          ),
          title: i18n.t("Start Your Learning Journey"),
          subtitle: i18n.t(
            "Dive into a world of knowledge with our study app."
          ),
        },
        {
          backgroundColor: "#fdeb93",
          image: (
            <Image
              source={require("../assets/image2.png")}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
            />
          ),
          title: i18n.t("Tailored Study Plans"),
          subtitle: i18n.t(
            "Create custom study plans that suit your pace and goals."
          ),
        },
        {
          backgroundColor: "#e9bcbe",
          image: (
            <Image
              source={require("../assets/image3.png")}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
            />
          ),
          title: i18n.t("Interactive Learning"),
          subtitle: i18n.t(
            "Engage with interactive content for a better understanding."
          ),
        },
      ]}
    />
  );
};
const styles = StyleSheet.create({
  image: {
    width: Dimensions.get("window").width - 100,
    height: Dimensions.get("window").width - 100,
    resizeMode: "contain",
  },
});

export default OnboardingScreen;

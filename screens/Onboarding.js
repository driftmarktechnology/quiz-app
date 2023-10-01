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
      pages={[
        {
          backgroundColor: "#a6e4d0",
          image: (
            <Image
              source={require("../assets/image1.jpg")}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
            />
          ),
          title: "Onboarding 1",
          subtitle: "This is the first onboarding screen.",
        },
        {
          backgroundColor: "#fdeb93",
          image: (
            <Image
              source={require("../assets/image2.jpg")}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
            />
          ),
          title: "Onboarding 2",
          subtitle: "This is the second onboarding screen.",
        },
        {
          backgroundColor: "#e9bcbe",
          image: (
            <Image
              source={require("../assets/image3.jpg")}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
            />
          ),
          title: "Onboarding 3",
          subtitle: "This is the third onboarding screen.",
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

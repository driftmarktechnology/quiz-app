import React, { useState, createContext, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator, Text } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Questions from "./screens/Questions";
import Home from "./screens/Home";
import { Ionicons } from "@expo/vector-icons";
import Books from "./screens/Books";
import Terms from "./screens/Terms";
import Subject from "./screens/Subject";
import Medium from "./screens/Medium";
import Settings from "./screens/Settings";
import Notifications from "./screens/Notifications";
import PdfViewer from "./screens/PdfViewer";
import Quiz from "./screens/Quiz";
import OnboardingScreen from "./screens/Onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";
import * as Localization from "expo-localization";
import i18n from "./locales/i18n";
import LanguageContext from "./context/LanguageContext";
import WithdrawNow from "./screens/WithdrawNow";
import WithdrawHistory from "./screens/WithdrawHistory";
import Privacy from "./screens/Privacy";
import Contact from "./screens/Contact";
import ThemeProvider from "./context/ThemeProvider";
import ForgotPassword from "./screens/ ForgotPassword";
import Notes from "./screens/Notes";
import NotesList from "./screens/NotesList";
import registerNNPushToken from "native-notify";
import useFonts from "./context/useFonts";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function MainStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="ChatBottomTabNavigator">
      <Stack.Screen
        name="ChatBottomTabNavigator"
        component={ChatBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Books"
        component={Books}
        options={{ headerTitle: "Books" }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{ headerTitle: "Terms" }}
      />

      <Stack.Screen
        name="Subject"
        component={Subject}
        options={{ headerTitle: "Subject" }}
      />

      <Stack.Screen
        name="Medium"
        component={Medium}
        options={{ headerTitle: "Medium" }}
      />

      <Stack.Screen
        name="PdfViewer"
        component={PdfViewer}
        options={{ headerTitle: "PdfViewer" }}
      />

      <Stack.Screen
        name="Quiz"
        component={Quiz}
        options={{ headerTitle: "Quiz" }}
      />

      <Stack.Screen
        name="WithdrawNow"
        component={WithdrawNow}
        options={{ headerTitle: "Withdraw Now" }}
      />

      <Stack.Screen
        name="WithdrawHistory"
        component={WithdrawHistory}
        options={{ headerTitle: "Withdraw History" }}
      />

      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{ headerTitle: "Contact" }}
      />

      <Stack.Screen
        name="Notes"
        component={Notes}
        options={{ headerTitle: "Notes" }}
      />

      <Stack.Screen
        name="NotesList"
        component={NotesList}
        options={{ headerTitle: "NotesList" }}
      />

      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{ headerTitle: "Privacy" }}
      />
    </Stack.Navigator>
  );
}

function ChatBottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === i18n.t("Home")) {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === i18n.t("Questions")) {
            iconName = focused ? "help-circle" : "help-circle-outline";
          } else if (route.name === i18n.t("Settings")) {
            iconName = focused ? "ios-settings" : "ios-settings-outline";
          } else if (route.name === i18n.t("Notifications")) {
            iconName = focused
              ? "ios-notifications"
              : "ios-notifications-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <BottomTab.Screen name={i18n.t("Home")} component={Home} />
      <BottomTab.Screen name={i18n.t("Questions")} component={Questions} />
      <BottomTab.Screen
        name={i18n.t("Notifications")}
        component={Notifications}
      />
      <BottomTab.Screen name={i18n.t("Settings")} component={Settings} />
    </BottomTab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStackNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  registerNNPushToken(12874, "HcvhdjYzdUss7wxUAw30cG");

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [language, setLanguage] = useState(i18n.locale);

  useEffect(() => {
    // Here, you can check from AsyncStorage if the user has launched the app before.
    // I'm assuming the key is 'alreadyLaunched'. If they haven't, display Onboarding.

    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);
  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    return <OnboardingScreen />;
  } else {
    return (
      <AuthenticatedUserProvider>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </LanguageContext.Provider>
      </AuthenticatedUserProvider>
    );
  }
}

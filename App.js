import React, { useState, createContext, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator, Text } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Chat from "./screens/Chat";
import Home from "./screens/Home";
import { Ionicons } from "@expo/vector-icons";
import Books from "./screens/Books";
import Terms from "./screens/Terms";
import Subject from "./screens/Subject";
import Medium from "./screens/Medium";
import PdfViewer from "./screens/PdfViewer";
import Quiz from "./screens/Quiz";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const AuthenticatedUserContext = createContext({});

const Settings = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Settings Screen</Text>
  </View>
);

const Notifications = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Notifications Screen</Text>
  </View>
);

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
    </Stack.Navigator>
  );
}

function ChatBottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "ios-chatbubble" : "ios-chatbubble-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "ios-settings" : "ios-settings-outline";
          } else if (route.name === "Notifications") {
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
      <BottomTab.Screen name="Home" component={Home} />
      <BottomTab.Screen name="Chat" component={Chat} />
      <BottomTab.Screen name="Notifications" component={Notifications} />
      <BottomTab.Screen name="Settings" component={Settings} />
    </BottomTab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
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
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}

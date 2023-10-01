import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { TouchableOpacity, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

export default function Questions() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  // const onSignOut = () => {
  //   signOut(auth).catch((error) => console.log("Error logging out: ", error));
  // };

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity
  //         style={{
  //           marginRight: 10,
  //         }}
  //         onPress={onSignOut}
  //       >
  //         <AntDesign
  //           name="logout"
  //           size={24}
  //           color={colors.gray}
  //           style={{ marginRight: 10 }}
  //         />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  return <></>;
}

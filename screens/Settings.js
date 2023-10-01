import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo's vector icons
import { auth, getFirestore } from "../config/firebase";
import i18n from "../locales/i18n"; // Adjust the path according to where i18n.js is located
import LanguageContext from "../context/LanguageContext";

function Settings() {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);
  const { setLanguage } = useContext(LanguageContext);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://www.w3schools.com/w3images/avatar2.png"
  );

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "ta" : "en";
    setCurrentLanguage(newLanguage);
    setLanguage(newLanguage);
    i18n.locale = newLanguage;
  };

  const fetchProfileImage = async () => {
    const db = getFirestore();
    const email = auth.currentUser.email;
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().profileImageUrl) {
      setProfileImageUrl(docSnap.data().profileImageUrl);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImageToFirebase(result.uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = new Date().getTime();
    const storage = getStorage();
    const storageRef = ref(storage, `profile_images/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
        alert("There was an issue uploading the image. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setProfileImageUrl(downloadURL);
          const db = getFirestore();
          const email = auth.currentUser.email;
          setDoc(doc(db, "users", email), {
            profileImageUrl: downloadURL,
          });
        });
      }
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
          <Ionicons name="ios-pencil" size={24} style={styles.editIcon} />
        </TouchableOpacity>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Text style={styles.progressText}>
            Upload Progress: {Math.round(uploadProgress)}%
          </Text>
        )}
        <Text style={styles.accountBalance}>
          {i18n.t("YourAccountBalance")} : 100 ₹
        </Text>
        <View style={styles.row}>
          <Card
            title={i18n.t("Language")}
            iconName="ios-globe"
            onPress={toggleLanguage}
          />
          <Card title={i18n.t("Color Mode")} iconName="ios-color-palette" />
        </View>
        <View style={styles.row}>
          <Card title={i18n.t("Privacy Policy")} iconName="ios-lock-closed" />
          <Card
            title={i18n.t("Terms & Conditions")}
            iconName="ios-document-text"
          />
        </View>
        <View style={styles.row}>
          <Card title={i18n.t("Rate")} iconName="ios-star" />
          <Card title={i18n.t("Share")} iconName="ios-share" />
        </View>
        <View style={styles.row}>
          <Card title={i18n.t("Withdraw Now")} iconName="wallet" />
          <Card title={i18n.t("Withdraw History")} iconName="time" />
        </View>
      </View>
    </ScrollView>
  );
}

const Card = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    {iconName && <Ionicons name={iconName} size={24} color="black" />}
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "48%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "500",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // To make it rounded
    alignSelf: "center",
    marginBottom: 10,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    position: "relative",
    alignSelf: "center",
    marginBottom: 20,
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 2,
  },
  progressText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Settings;

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Share,
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
import { useNavigation } from "@react-navigation/native";
import ThemeContext from "../context/ThemeContext";
import { signOut } from "firebase/auth";

function Settings() {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isLightTheme = theme === "light";

  const dynamicStyles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: isLightTheme ? "#f5f5f5" : "#121212",
    },
  });

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

  const redirect = () => {
    navigation.navigate("WithdrawNow");
  };

  const redirectPrivacy = () => {
    navigation.navigate("Privacy");
  };

  const redirectToContactUs = () => {
    navigation.navigate("Contact");
  };

  const handleLogout = () => {
    setModalVisible(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Share this app with your friends!",
        // Here, you can also add a URL, title, etc.
      });
    } catch (error) {
      alert("Oops, something went wrong!", error);
    }
  };

  const Card = ({ title, iconName, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {iconName && <Ionicons name={iconName} size={24} color="black" />}
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );

  function rateApp() {
    const googlePackageName = "com.quiz-app"; // e.g. com.myapp
    const link = `market://details?id=${googlePackageName}`;
    console.log(link, "link");

    // Linking.canOpenURL(link)
    //   .then((supported) => {
    //     if (!supported) {
    //       console.log("Can't handle URL: " + link);
    //     } else {
    //       return Linking.openURL(link);
    //     }
    //   })
    //   .catch((err) => console.error("An error occurred", err));
  }

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const redirectHistory = () => {
    navigation.navigate("WithdrawHistory");
  };

  return (
    <ScrollView style={dynamicStyles.container}>
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
        <View style={styles.settingsGrid}>
          {/* Note: You can loop through a settings array to generate these cards, making your code more concise. */}
          <Card
            title={i18n.t("Language")}
            iconName="ios-globe"
            onPress={toggleLanguage}
          />
          <Card
            title={i18n.t("Color Mode")}
            iconName="ios-color-palette"
            onPress={toggleTheme}
          />
          <Card
            title={i18n.t("Privacy Policy")}
            iconName="ios-lock-closed"
            onPress={redirectPrivacy}
          />
          <Card
            title={i18n.t("Terms & Conditions")}
            iconName="ios-document-text"
            onPress={redirectPrivacy}
          />
          <Card title={i18n.t("Rate")} iconName="ios-star" onPress={rateApp} />
          <Card
            title={i18n.t("Share")}
            iconName="ios-share"
            onPress={handleShare}
          />
          <Card
            title={i18n.t("Withdraw Now")}
            iconName="wallet"
            onPress={redirect}
          />
          <Card
            title={i18n.t("Withdraw History")}
            iconName="time"
            onPress={redirectHistory}
          />
          <Card
            title={i18n.t("ContactUs")}
            iconName="ios-mail"
            onPress={redirectToContactUs}
          />
          <Card
            title={i18n.t("Logout")}
            iconName="ios-exit"
            onPress={handleLogout}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>

            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: "red" }}
              onPress={() => {
                onSignOut();
                // Here you can implement your logout logic, maybe clear user data, etc.
                // Then navigate to the login screen or whatever you prefer.
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
    fontSize: 16,
    fontWeight: "600",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
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
    bottom: 0,
    right: 10,
    backgroundColor: "#e7e7e7",
    borderRadius: 15,
    padding: 5,
  },
  progressText: {
    padding: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    margin: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  settingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 80,
  },
});

export default Settings;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo's vector icons
import { auth, getFirestore } from "../config/firebase";

function Settings() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://www.w3schools.com/w3images/avatar2.png"
  );

  useEffect(() => {
    // Fetch the image URL once when the component mounts
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    const db = getFirestore();
    const email = auth.currentUser.email;

    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
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
    const filename = new Date().getTime(); // Just a simple timestamp as a name

    const storage = getStorage();

    const storageRef = ref(storage, `profile_images/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // You can use this part for tracking progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error(error);
        alert("There was an issue uploading the image. Please try again.");
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setProfileImageUrl(downloadURL);

          // Save this imageURL to Firestore under the user's email
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
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        <Ionicons name="ios-pencil" size={24} style={styles.editIcon} />
      </TouchableOpacity>
      {uploadProgress > 0 &&
        uploadProgress < 100 && ( // Only show when uploading
          <Text style={styles.progressText}>
            Upload Progress: {Math.round(uploadProgress)}%
          </Text>
        )}
      <Text style={styles.accountBalance}>Your Account Balance: 100</Text>

      <View style={styles.row}>
        <Card title="Language" iconName="ios-globe" />
        <Card title="Color Mode" iconName="ios-color-palette" />
      </View>

      <View style={styles.row}>
        <Card title="Privacy Policy" iconName="ios-lock-closed" />
        <Card title="Terms & Conditions" iconName="ios-document-text" />
      </View>
      <View style={styles.row}>
        <Card title="Withdraw Now" iconName="wallet" />
        <Card title="Withdraw History" iconName="time" />
      </View>
    </View>
  );
}

const Card = ({ title, iconName }) => (
  <TouchableOpacity style={styles.card}>
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

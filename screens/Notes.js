import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  notes: Yup.string().required("Notes are required"),
});

const Notes = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      notes: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await saveToFirebase(values);
    },
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      formik.setFieldValue("image", result.uri);
    }
  };

  const saveToFirebase = async (data) => {
    setLoading(true);
    let imageUrl = null;

    try {
      if (data.image) {
        const response = await fetch(data.image);
        const blob = await response.blob();
        const storage = getStorage();
        const imageRef = ref(storage, `notes/${Date.now()}`);
        await uploadBytesResumable(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }
    } catch (error) {
      console.error("Error with image storage:", error);
      Alert.alert("Error", "There was an error with image storage.");
      setLoading(false);
      return; // Exit the function
    }

    const completeData = {
      ...data,
      image: imageUrl,
      email: auth.currentUser.email,
      date: new Date().toDateString(),
      time: new Date().toLocaleTimeString(),
    };

    try {
      const db = getFirestore();
      await addDoc(collection(db, "notes"), completeData);
      Alert.alert("Success", "Notes add Successfully");
      formik.resetForm();
      navigation.navigate("NotesList");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      Alert.alert("Error", "There was an error saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your title"
              onChangeText={formik.handleChange("title")}
              onBlur={formik.handleBlur("title")}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title && (
              <Text style={styles.errorText}>{formik.errors.title}</Text>
            )}

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="Enter your notes"
              onChangeText={formik.handleChange("notes")}
              onBlur={formik.handleBlur("notes")}
              value={formik.values.notes}
            />
            {formik.touched.notes && formik.errors.notes && (
              <Text style={styles.errorText}>{formik.errors.notes}</Text>
            )}

            <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
              {formik.values.image ? (
                <Image
                  source={{ uri: formik.values.image }}
                  style={styles.image}
                />
              ) : (
                <Text style={styles.addImageText}>Add Image</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={formik.handleSubmit}
              disabled={loading} // Disable the button when loading
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" /> // Show loader when loading
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0B0B0",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    height: 45,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#B0B0B0",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    marginLeft: 5,
  },
  imageBox: {
    borderWidth: 1,
    borderColor: "#B0B0B0",
    height: 150,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: "center",
  },
  addImageText: {
    color: "#888",
    fontSize: 14,
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 8,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
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

export default Notes;

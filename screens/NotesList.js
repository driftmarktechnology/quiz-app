import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

const NotesList = ({ navigation }) => {
  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true); // New loading state

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "notes"));
      const notesArray = [];
      querySnapshot.forEach((documentSnapshot) => {
        notesArray.push({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        });
      });
      setNotes(notesArray);
      setLoading(false);
    };

    fetchNotes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchNotes = async () => {
        setLoading(true); // Set loading to true every time fetch starts
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "notes"));
        const notesArray = [];
        querySnapshot.forEach((documentSnapshot) => {
          notesArray.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setNotes(notesArray);
        setLoading(false);
      };

      fetchNotes();

      return () => {}; // This is a cleanup function if you need one. Can be empty for your current use case.
    }, []) // This is a dependency array, similar to useEffect
  );

  const handleDelete = async () => {
    const db = getFirestore();
    await deleteDoc(doc(db, "notes", selectedNoteId));

    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== selectedNoteId)
    );
    setSelectedNoteId(null);
    setDeleteModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No data found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this note?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setDeleteModalVisible(false)}
                color="#2196F3"
              />
              <Button title="Delete" onPress={handleDelete} color="red" />
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setSelectedNoteId(item.id);
                  setDeleteModalVisible(true);
                }}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <Text>{item.title}</Text>
            <Text>{item.notes}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.noteImage} />
            )}
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("Notes")}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    marginLeft: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  noteImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NotesList;

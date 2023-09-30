import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";

function PdfViewer() {
  const [pdfUrl, setPdfUrl] = useState(null);

  async function fetchPdfUrl() {
    const storage = getStorage();
    const pdfRef = ref(storage, "6.pdf"); // Assuming the PDF is in a folder called 'pdfs' and is named '6.pdf'

    getDownloadURL(pdfRef)
      .then((url) => {
        setPdfUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching PDF from Firebase Storage:", error);
      });
  }

  const handleOpenWithWebBrowser = async () => {
    await WebBrowser.openBrowserAsync(pdfUrl);
  };

  useEffect(() => {
    fetchPdfUrl();
  }, []);

  return (
    <View style={styles.container}>
      {pdfUrl ? (
        <Button title="Open PDF" onPress={handleOpenWithWebBrowser} />
      ) : (
        <Text>Loading or failed to load PDF...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PdfViewer;

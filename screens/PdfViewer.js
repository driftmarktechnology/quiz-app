import React, { useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { WebView } from "react-native-webview";
import {
  BannerAd,
  TestIds,
  BannerAdSize,
} from "react-native-google-mobile-ads";

function PdfViewer({ route }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useLayoutEffect(() => {
    const { question } = route.params;
    const googleDriveUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${question?.questionpaper?.url}`;
    setPdfUrl(googleDriveUrl);
  }, [route.params]);

  return (
    <View style={styles.container}>
      <WebView style={styles.container} source={{ uri: pdfUrl }} />
      <BannerAd size={BannerAdSize.BANNER} unitId={TestIds.BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PdfViewer;

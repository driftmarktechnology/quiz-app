import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

function Privacy() {
  const privacyPolicyURL = "https://driftmarktechnology.com/privacy-policy";

  return (
    <View style={styles.container}>
      <WebView source={{ uri: privacyPolicyURL }} style={styles.webview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    marginTop: 20,
  },
});

export default Privacy;

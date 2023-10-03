import * as Font from "expo-font";

export default useFonts = async () =>
  await Font.loadAsync({
    limelight: require("../assets/font/NotoSerifTamil-Italic-VariableFont_wdth,wght.ttf"),
    indie: require("../assets/font/NotoSerifTamil-VariableFont_wdth,wght.ttf"),
  });

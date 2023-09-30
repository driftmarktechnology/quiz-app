import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

export default function Home() {
  const navigation = useNavigation();

  const [bannerImages, setBannerImages] = useState([]);

  const CARD_TITLES = ["Books", "Jobs", "Settings", "Notifications", "Profile"];

  const ICONS = [
    "ios-book-outline",
    "ios-job-outline",
    "ios-settings-outline",
    "ios-notifications-outline",
    "ios-person-outline",
  ];

  useEffect(() => {
    const fetchBanners = async () => {
      const db = getFirestore();
      const bannerCollection = collection(db, "banners");
      const bannerSnapshot = await getDocs(bannerCollection);
      const banners = bannerSnapshot.docs.map((doc) => doc.data().url);
      setBannerImages(...banners);
    };

    fetchBanners();
  }, []);

  const _renderItem = ({ item }) => (
    <Image
      source={{ uri: item }}
      style={styles.bannerImage}
      resizeMode="cover"
    />
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={bannerImages}
        renderItem={_renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        autoplay={true}
        loop={true}
      />

      <ScrollView
        style={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
        {CARD_TITLES.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              if (title === "Books") {
                navigation.navigate("Books");
              }

              if (title === "Jobs") {
                navigation.navigate("Quiz");
              }
            }}
          >
            <Ionicons name={ICONS[index]} size={24} color="blue" />
            <Text style={styles.cardTitle}>{title}</Text>
            <Ionicons
              name="ios-arrow-forward"
              size={24}
              color="gray"
              style={styles.cardArrow}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  bannerImage: {
    width: screenWidth,
    height: 200,
  },
  cardsContainer: {
    margin: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardTitle: {
    flex: 1, // added this so the title takes as much space as possible
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  cardArrow: {
    marginLeft: 10, // spacing between title and arrow
  },
});

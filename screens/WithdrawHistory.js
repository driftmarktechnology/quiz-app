import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth } from "../config/firebase";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});

function WithdrawHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userRequests = [];
        const q = query(
          collection(db, "withdrawRequest"),
          where("email", "==", auth.currentUser.email)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          userRequests.push(doc.data());
        });
        setRequests(userRequests);
      } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Load the ad
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setAdLoaded(true);
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
      }
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  useEffect(() => {
    if (adLoaded) {
      rewarded.show();
    }
  }, [adLoaded]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.amount}>Amount: ₹{item.amount}</Text>
            <Text style={styles.date}>
              Date: {item.date} - {item.time}
            </Text>
            <Text
              style={[
                styles.status,
                { color: item.status === "pending" ? "orange" : "green" },
              ]}
            >
              Status: {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: "#888",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 5,
  },
  amount: {
    fontSize: 20,
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WithdrawHistory;

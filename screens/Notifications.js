import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Notifications() {
  const data = [
    {
      id: "1",
      message: "Your order has been shipped!",
      time: "5 mins ago",
      iconName: "ios-cart",
    },
    {
      id: "2",
      message: "New comment on your post.",
      time: "2 hours ago",
      iconName: "ios-chatbubbles",
    },
    {
      id: "3",
      message: "Your delivery is on the way.",
      time: "1 day ago",
      iconName: "ios-car",
    },
    //... add more notifications as needed
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Ionicons name={item.iconName} size={24} style={styles.icon} />
            <View>
              <Text style={styles.notificationText}>{item.message}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 10,
  },
  notificationTime: {
    fontSize: 12,
    color: "gray",
  },
  icon: {
    marginRight: 15,
    color: "black",
  },
});

export default Notifications;

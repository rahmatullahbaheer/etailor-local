import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PageHeader } from "../components";
import { colors } from "../../theme/colors";
import { useCustomers } from "../hooks/useRedux";
import { setSearchQuery } from "../store/slices/customerSlice";

const { width: screenWidth } = Dimensions.get("window");

const UserListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user data - replace with actual data from your API/database
  const [users] = useState([
    {
      id: 1,
      name: "Ahmed Khan",
      email: "ahmed.khan@email.com",
      phone: "+92 300 1234567",
      image: null,
      ordersCount: 5,
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+92 301 2345678",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      ordersCount: 12,
      status: "active",
    },
    {
      id: 3,
      name: "Muhammad Ali",
      email: "m.ali@email.com",
      phone: "+92 302 3456789",
      image: null,
      ordersCount: 8,
      status: "inactive",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      phone: "+92 303 4567890",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      ordersCount: 3,
      status: "active",
    },
    {
      id: 5,
      name: "Hassan Ahmed",
      email: "hassan.a@email.com",
      phone: "+92 304 5678901",
      image: null,
      ordersCount: 15,
      status: "active",
    },
    {
      id: 6,
      name: "Lisa Chen",
      email: "lisa.chen@email.com",
      phone: "+92 305 6789012",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      ordersCount: 7,
      status: "active",
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#3498db",
      "#e74c3c",
      "#2ecc71",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => console.log("User selected:", item.name)}
      activeOpacity={0.7}
    >
      <View style={styles.userImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.userImage} />
        ) : (
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: getAvatarColor(item.name) },
            ]}
          >
            <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
          </View>
        )}
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: item.status === "active" ? "#2ecc71" : "#95a5a6",
            },
          ]}
        />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userPhone}>{item.phone}</Text>
      </View>

      <View style={styles.userStats}>
        <View style={styles.ordersContainer}>
          <Text style={styles.ordersCount}>{item.ordersCount}</Text>
          <Text style={styles.ordersLabel}>Orders</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter((u) => u.status === "active").length}
          </Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.reduce((sum, u) => sum + u.ordersCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#7f8c8d"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#bdc3c7"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="clear" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <PageHeader title="User List" showBackButton={true} />

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddCustomer")}
        activeOpacity={0.8}
      >
        <MaterialIcons name="person-add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  listContainer: {
    paddingBottom: 20,
  },

  headerContainer: {
    padding: 16,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  searchIcon: {
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  userImageContainer: {
    position: "relative",
    marginRight: 16,
  },

  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },

  userPhone: {
    fontSize: 14,
    color: "#95a5a6",
  },

  userStats: {
    alignItems: "center",
    flexDirection: "row",
  },

  ordersContainer: {
    alignItems: "center",
    marginRight: 12,
  },

  ordersCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
  },

  ordersLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },

  separator: {
    height: 12,
  },

  /* Floating Action Button */
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default UserListScreen;

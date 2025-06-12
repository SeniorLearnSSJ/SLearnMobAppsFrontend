import React from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ItemContext } from "../Context/context";
import { ItemContextType, IItem } from "../types";
import { useContext } from "react";
import { useAuth } from "../Context/AuthContext";
import { FontContext } from "../Context/fontContext";
import { StyleSheet } from "react-native";

const API_URL = "http://172.19.159.72:5143/api/bulletins/member";

type MemberBulletinDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MemberBulletinDetails"
>;

export default function MemberBulletinDetailsScreen({
  navigation,
  route,
}: MemberBulletinDetailsScreenProps) {
  const context = useContext(ItemContext);
  const { token, role } = useAuth();
  const fontContext = useContext(FontContext);

  if (!context) {
    return <Text> Loading....</Text>;
  }
  const { bulletins, deleteBulletin, loadingMember } = context;
  const { item } = route.params;

  const deleteItem = async (idToDelete: string) => {
    try {
      const response = await fetch(`${API_URL}/${idToDelete}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`, // <-- Add this header
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      console.log(`Item with ID ${idToDelete} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting item:", error);
    }

    deleteBulletin(idToDelete);
    navigation.navigate("MemberBulletinSummary");
  };

  if (loadingMember) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        Member bulletin details
      </Text>
      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        {item.category}
      </Text>
      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>{item.id}</Text>
      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        {" "}
        {item.title}
      </Text>
      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        {" "}
        {item.content}{" "}
      </Text>

      <View style={styles.bottomButtons}>
        {token && (role === "Member" || role === "Administrator") && (
          <TouchableOpacity
            style={styles.buttonLeft}
            onPress={() => navigation.navigate("Edit", { item })}
          >
            <Text
              style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        )}
        {/* 
        <Button
          title="Edit"
          onPress={() => navigation.navigate("Edit", { item })}
        />
      )}
 */}
        {token && (role === "Member" || role === "Administrator") && (
          <TouchableOpacity
            style={styles.buttonRight}
            onPress={() => {
              deleteItem(item.id);
            }}
          >
            <Text
              style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.buttonLeft, { marginTop: 30 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}>
          Back
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#FFF5E6",
  },

  input: {
    backgroundColor: "blue",
    borderRadius: 10,
    margin: 20,
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  buttonLeft: {
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "black",
  },

  buttonRight: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: "black",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: "black",
    borderRadius: 15,
  },
});

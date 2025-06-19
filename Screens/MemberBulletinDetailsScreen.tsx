/**
 * This imports React and React Native components, along with nav props, context, custom types and a custom hook.
 */

import React from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ItemContext } from "../Context/context";
import { ItemContextType, IItem } from "../types";
import { useContext } from "react";
import { useAuth } from "../Context/AuthContext";
import { FontContext } from "../Context/fontContext";
import { StyleSheet } from "react-native";
import { styles } from "../styles";
import { API_URL } from "../apiConfig";

/**
 * This makes the URL readable and easier to handle
 */

const API_BASE = `${API_URL}/api/bulletins/member`;

/**
 * This adds the screen to the navigation stack.
 */

type MemberBulletinDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MemberBulletinDetails"
>;

/**
 * This functional component takes navigation props and route params, and returns a UI.
 * @param param0 nav props, route params
 * @returns UI
 */
export default function MemberBulletinDetailsScreen({
  navigation,
  route,
}: MemberBulletinDetailsScreenProps) {
  const context = useContext(ItemContext);
  const { token, role } = useAuth();
  const fontContext = useContext(FontContext);
  const { username } = useAuth();

  if (!context) {
    return <Text> Loading....</Text>;
  }
  const { bulletins, deleteBulletin, loadingMember } = context;
  const { item } = route.params;
  console.log("item content:", item.content);

  /**
   * This function identifies an item by ID and deletes it by calling the deleteBulletin function from context. DeleteItem removes the data from the backend, while deleteBulletin updates context and therefore the live state of the app.
   * @param idToDelete
   */
  const deleteItem = async (idToDelete: string) => {
    try {
      const response = await fetch(`${API_BASE}/${idToDelete}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`, // <-- Add this header
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      deleteBulletin(idToDelete);
      navigation.navigate("MemberBulletinSummary");

      console.log(`Item with ID ${idToDelete} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loadingMember) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  /**
   * This is the UI.
   */
  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("MemberBulletinSummary")}
        >
          <Image
            source={require("../Back02.png")} // or your image path
            style={styles.logo}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Atrium")}
        >
          <Image
            source={require("../Logo2.png")} // or your image path
            style={styles.logo}
          />
        </TouchableOpacity>

        {username && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={require("../Profile.png")} // or your image path
              style={styles.logo}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.headerRow}>
        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          Member bulletin details
        </Text>
      </View>

      <View style={styles.shiftCenter}>
        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          {item.category}
        </Text>

        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          {" "}
          {item.title}
        </Text>
        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          {" "}
          {item.content}{" "}
        </Text>
      </View>

      <View style={styles.shiftCenter}>
        <View style={styles.bottomButtons}>
          {token && (role === "Member" || role === "Administrator") && (
            <TouchableOpacity
              style={styles.buttonLeft}
              onPress={() => navigation.navigate("Edit", { item })}
            >
              <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                Edit
              </Text>
            </TouchableOpacity>
          )}

          {token && (role === "Member" || role === "Administrator") && (
            <TouchableOpacity
              style={styles.buttonRight}
              onPress={() => {
                deleteItem(item.id);
              }}
            >
              <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

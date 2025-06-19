/**
 * Imports React and React Native components, along with navigation props, custom types and interfaces, and the logLogin function.
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { api } from "../api";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import { useAuth } from "../Context/AuthContext";
import { ItemContext } from "../Context/context";
import { FontContext } from "../Context/fontContext";
import { StyleSheet } from "react-native";
import { styles } from "../styles";
import { API_URL } from "../apiConfig";

/**
 * Adds screen to navigation stack.
 */
type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

/**
 * Makes URL readable.
 */

const API_BASE = `${API_URL}/api/profile`;

/**
 * Defines functional component.
 * @param param0 Nav props
 * @returns UI
 */

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { login } = useAuth();
  const { logout } = useAuth();
  const authContext = useContext(AuthContext);
  const context = useContext(ItemContext);
  if (!context) return null;
  //const { fontSize } = context;
  const fontContext = useContext(FontContext);

  if (!authContext) {
    return <Text>Loading...</Text>;
  }

  const [bulletins, setBulletins] = useState<
    {
      id: string;
      title: string;
      content: string;
      createdById: string;
      createdByUsername: string;
      createdAt: string;
      updatedAt: string;
      category: string;
    }[]
  >([]);

  const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [membershipDate, setMembershipDate] = useState("");
  const [loading, setLoading] = useState(true);

  const { token, setToken } = authContext;

  /**
   * This hook fetches the profile from the backend, and updates the UI fields accordingly.  It runs whenever the token changes.
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(API_BASE, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`${response.status}`);

        const responseJson = await response.json();
        const userData = responseJson.data;
        setUsername(userData.username);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setRole(userData.role);
        setMembershipDate(userData.membershipDate);
        setBulletins(userData.myBulletins ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  /**
   * This function logs out by calling the logout function from authorisation context.
   */
  const handleLogout = () => {
    authContext.logout();
    navigation.reset({ index: 0, routes: [{ name: "Atrium" }] });
  };

  /**
   * This handles form submission with valdiation.
   * @returns no specific value
   */
  const handleSubmit = async () => {
    // Assuming you have form fields like 'username', 'email', etc.
    if (
      !username.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !role.trim() ||
      !membershipDate.trim()
    ) {
      window.alert("all fields necessary");
      return;
    }

    try {
      const response = await fetch(API_BASE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          email,
          //role,
          // membershipDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Updated item:", data);
      alert("Submit successful!");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  /**
   * This defines the UI.
   */
  return (
    <ScrollView>
      <View style={styles.colorPurple}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Login")}
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
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require("../Profile.png")} // or your image path
                style={styles.logo}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.shiftCenter}>
          <TextInput
            placeholder="Enter first name"
            value={firstName}
            onChangeText={(newText) => setFirstName(newText)}
            style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
          />

          <TextInput
            placeholder="Enter last name"
            value={lastName}
            onChangeText={(newText) => setLastName(newText)}
            style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
          />

          <TextInput
            multiline
            placeholder="Enter email"
            value={email}
            onChangeText={(newText) => setEmail(newText)}
            style={[styles.fatInput, { fontSize: fontContext?.fontSize || 16 }]}
          />

          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            Membership date: {membershipDate}
          </Text>

          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            Role: {role}
          </Text>

          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            Your bulletins:
          </Text>

          {bulletins.length === 0 ? (
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              No bulletins yet
            </Text>
          ) : (
            bulletins.map((bulletin) => (
              <View key={bulletin.id}>
                <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                  {bulletin.title}
                </Text>
                <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                  {bulletin.category}
                </Text>
                <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                  {bulletin.content}
                </Text>
                <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                  {new Date(bulletin.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}

          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.buttonLeft} onPress={handleSubmit}>
              <Text
                style={{
                  fontSize: fontContext?.fontSize || 16,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
              <TouchableOpacity
                style={styles.buttonRight}
                onPress={() => navigation.navigate("Settings")}
              >
                <Text
                  style={{
                    fontSize: fontContext?.fontSize || 16,
                  }}
                >
                  Settings
                </Text>
              </TouchableOpacity>
        

            <View style={styles.buttonRight}>
              <TouchableOpacity onPress={handleLogout}>
                <Text
                  style={{
                    fontSize: fontContext?.fontSize || 16,
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

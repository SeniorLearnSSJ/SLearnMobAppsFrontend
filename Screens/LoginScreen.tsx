/**
 * Imports React and React Native components, along with navigation props, custom types and interfaces, and the logLogin function.
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
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
//import { logLogin, getLoginHistory } from "../logLogins";
import { Image } from "react-native";
import { styles } from "../styles";
import { API_URL } from "../apiConfig";

/**
 * This adds the screen to the navigation stack.
 */

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

/**
 * This makes the URL easily handled and readable.
 */

const API_BASE = `${API_URL}/api/auth/sign-in`;

/**
 * This functional component takes navigation props and returns no specific value.  It manages state and context.
 * @param param0 Nav props
 * @returns Nothing specific
 */

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();

  const authContext = useContext(AuthContext);
  const context = useContext(ItemContext);
  if (!context) return null;
  //const { fontSize } = context;
  const fontContext = useContext(FontContext);

  if (!authContext) {
    return <Text>Loading...</Text>;
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken } = authContext;

  /* useEffect(() => {
    getLoginHistory((data) => {
      console.log("Login history data:", data);
      // You could update state here if you want to display or process it
    });
  }, []); */

  /**
   * This function handles form submission. It also logs the username to a text file on successful login.
   */
  const handleSubmit = async () => {
    if (username.trim() && password.trim()) {
      try {
        const success = await login(username, password);

        if (success) {
          //logLogin(username);
          window.alert("Logged in");
          navigation.navigate("BulletinChoice");
        } else {
          // Since login returns only boolean, no message available here
          window.alert("Login failed: 123Invalid username or password");
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "An unknown error occurred";
        console.error("Login error:", message);
        window.alert(`Login error: ${message}`);
      }
    } else {
      window.alert("Fill out all fields");
    }
  };

  /**
   * This is the user interface.
   */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.navigate("Atrium")}>
            <Image
              source={require("../Logo2.png")} // or your image path
              style={styles.logo}
            />
          </TouchableOpacity>

          <Text
            style={[styles.header, { fontSize: fontContext?.fontSize || 16 }]}
          >
            Senior Learn
          </Text>
        </View>

        <TextInput
          placeholder="Enter username"
          value={username}
          onChangeText={(newText) => setUsername(newText)}
          style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
        />

        <TextInput
          placeholder="Enter password"
          value={password}
          onChangeText={(newText) => setPassword(newText)}
          style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
        />

        <View style={styles.buttonsContainer}>
          <View style={styles.centeredButtons}>
            <TouchableOpacity
              style={styles.skinnyButton}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  fontSize: fontContext?.fontSize || 16,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skinnyButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text
                style={{
                  fontSize: fontContext?.fontSize || 16,
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Atrium")}
          >
            <Image
              source={require("../Back02.png")} // or your image path
              style={styles.logo}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

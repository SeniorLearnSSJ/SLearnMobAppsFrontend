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
//import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import { FontContext } from "../Context/fontContext";
import { StyleSheet } from "react-native";
import { styles } from "../styles";
import axios from "axios";
import { API_URL } from "../apiConfig";
/**
 * Adds screen to navigation stack.
 */

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

/**
 * Makes URL readable.
 */
const API_BASE = `${API_URL}/api/auth`;

/**
 * Defines the component
 * @param param0 Nav props
 * @returns UI
 */

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  /*   const auth = useContext(AuthContext);
  const fontContext = useContext(FontContext);
  if (!auth) {
    return <Text>Loading...</Text>;
  }
  const { token, setToken } = auth; */

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const fontContext = useContext(FontContext);

  /**
   * A method to handle form submission with validation.
   * @returns No specific value
   */

  const handleSubmit = async () => {
    // Assuming you have form fields like 'username', 'email', etc.
    if (
      !username.trim() ||
      !password.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim()
    ) {
      window.alert("Error, please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/register`,
        {
          username,
          password,
          firstName,
          lastName,
          email,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        window.alert("registration successful");
        navigation.navigate("Login");
      } else {
        window.alert("Registration failed");
      }
    } catch (err) {
      console.error(err);
      window.alert("registration error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * The UI
   */
  return (
    <ScrollView contentContainerStyle={styles.colorPurple}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
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

      <View style={styles.shiftCenter}>
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
          secureTextEntry={true}
          style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
        />

        <TextInput
          placeholder="Enter firstName"
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
          placeholder="Enter email"
          value={email}
          onChangeText={(newText) => setEmail(newText)}
          style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
        />

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.buttonRight} onPress={handleSubmit}>
            <Text
              style={{
                fontSize: fontContext?.fontSize || 16,
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

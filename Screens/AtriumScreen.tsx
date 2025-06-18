/**
 * This imports React and React Native components, as well as navigation properties and context.
 */
import React from "react";
import { View, Text, Button, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { FontContext } from "../Context/fontContext";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { styles } from "../styles";

/**
 * This adds the screen to the navigation stack.
 */

type AtriumScreenProps = NativeStackScreenProps<RootStackParamList, "Atrium">;

/**
 * This functional component takes navigation props as a parameter.  It returns the UI for the screen.
 * @param param0 Navigation properties
 * @returns UI rendering
 */
export default function AtriumScreen({ navigation }: AtriumScreenProps) {
  const fontContext = useContext(FontContext);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFFB84" }} 
      contentContainerStyle={styles.innerContainer}
    >
      <Text style={styles.header}>Senior Learn</Text>

      <TouchableOpacity
        style={styles.Button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text
          style={[
            styles.buttonText,
            {
              fontSize: fontContext?.fontSize || 16,
            },
          ]}
        >
          Sign in
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Button}
        onPress={() => navigation.navigate("BulletinChoice")}
      >
        <Text
          style={[
            styles.buttonText,
            {
              fontSize: fontContext?.fontSize || 16,
            },
          ]}
        >
          Continue as guest
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

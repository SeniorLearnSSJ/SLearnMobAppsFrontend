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
    <ScrollView>
    <View>
      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>Home Screen</Text>

      <TouchableOpacity
        style={[styles.Button, { backgroundColor: "black" }]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text
          style={{
            color: "white",
            fontSize: fontContext?.fontSize || 16,
            //backgroundColor: "black",
          }}
        >
          Go to login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.Button, { backgroundColor: "black" }]}
        onPress={() => navigation.navigate("BulletinChoice")}
      >
        <Text
          style={{
            color: "white",
            fontSize: fontContext?.fontSize || 16,
            //backgroundColor: "black",
          }}
        >
          Continue as guest
        </Text>
      </TouchableOpacity>

      {/*       <TouchableOpacity
        style={styles.Button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text
          style={{
            color: "white",
            fontSize: fontContext?.fontSize || 16,
            backgroundColor: "black",
          }}
        >
          Profile
        </Text>
      </TouchableOpacity>
 */}
    </View>
    </ScrollView>
  );
}

/**
 * This contains the styling for the UI.
 */
const styles = StyleSheet.create({
  Button: {
    
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFF5E6",
    borderRadius: 20,
    marginVertical: 10
  },
});

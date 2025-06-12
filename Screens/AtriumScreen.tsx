import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { FontContext } from "../Context/fontContext";
import { useContext } from "react";
import { StyleSheet } from "react-native";

type AtriumScreenProps = NativeStackScreenProps<RootStackParamList, "Atrium">;

export default function AtriumScreen({ navigation }: AtriumScreenProps) {
  const fontContext = useContext(FontContext);
  return (
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
  );
}

const styles = StyleSheet.create({
  Button: {
    
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFF5E6",
    borderRadius: 20,
    marginVertical: 10
  },
});

/**
 * This imports React and React Native components, as well as navigation props, context and a useAuth custom hook that enables access to the authorisation context.
 */

import React from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { FontContext } from "../Context/fontContext";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { styles } from "../styles";

/**
 * Adds the screen to the navigation stack.
 */
type BulletinChoiceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BulletinChoice"
>;

/**
 * This functional component takes navigation props as a parameter and returns the UI.
 * @param param0 Navigation props
 * @returns User interface
 */
export default function BulletinChoiceScreen({
  navigation,
}: BulletinChoiceScreenProps) {
  const fontContext = useContext(FontContext);
  const { username } = useAuth(); // 👈 this gives you access to the user object

  return (
    <ScrollView>
      <View style={styles.container}>
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
          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            Would you like to read:
          </Text>
        </View>

        <View style={styles.centerer}>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => navigation.navigate("MemberBulletinSummary")}
          >
            <Text
              style={{
                fontSize: fontContext?.fontSize || 16,
              }}
            >
              Member Bulletins
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Button}
            onPress={() => navigation.navigate("OfficialBulletinsSummary")}
          >
            <Text
              style={{
                fontSize: fontContext?.fontSize || 16,
              }}
            >
              Official Bulletins
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

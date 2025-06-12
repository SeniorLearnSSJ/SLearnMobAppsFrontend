import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { FontContext } from "../Context/fontContext";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { useAuth } from "../Context/AuthContext";

type BulletinChoiceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BulletinChoice"
>;

export default function BulletinChoiceScreen({
  navigation,
}: BulletinChoiceScreenProps) {
  const fontContext = useContext(FontContext);
  const { username } = useAuth(); // 👈 this gives you access to the user object

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          Bulletin Choice Screen
        </Text>

        {username && (
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              ID: {username}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/*       <Button
        title="Go to member bulletins"
        onPress={() => navigation.navigate("MemberBulletinSummary")}
      />

 */}

      <TouchableOpacity
        style={[styles.Button, { backgroundColor: "black" }]}
        onPress={() => navigation.navigate("MemberBulletinSummary")}
      >
        <Text
          style={{
            color: "white",
            fontSize: fontContext?.fontSize || 16,
            backgroundColor: "black",
          }}
        >
          Member Bulletins
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.Button, { backgroundColor: "black" }]}
        onPress={() => navigation.navigate("OfficialBulletinsSummary")}
      >
        <Text
          style={{
            color: "white",
            fontSize: fontContext?.fontSize || 16,
            backgroundColor: "black",
          }}
        >
          Official Bulletins
        </Text>
      </TouchableOpacity>

      {/* <Text>Bulletin Choice Screen</Text> */}

      {/* 
      <Button
        title="Go to official bulletins"
        onPress={() => navigation.navigate("OfficialBulletinsSummary")}
      />
 */}

      {/*         <Button
        title="Go to ofiical bulletins"
        onPress={() => navigation.navigate("OfficialBulletinsSummary")};
      />  */}

      {/*       <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
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
    marginVertical: 10,
  },

  container: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});

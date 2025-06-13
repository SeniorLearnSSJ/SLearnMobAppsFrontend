import React from "react";
import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, IItem, IOfficialBulletin } from "../types";
import { useState } from "react";
import { ItemContext } from "../Context/context";
import { ItemContextType } from "../types";
import { useContext } from "react";
import { FontContext } from "../Context/fontContext";
import { useAuth } from "../Context/AuthContext";
import { StyleSheet } from "react-native";

const API_URL = "http://192.168.1.244:5143/api/bulletins/official";

type AddOfficialScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "AddOfficial"
>;

export default function AddOfficialScreen({
  navigation,
}: AddOfficialScreenProps) {
  const context = useContext(ItemContext);

  //  const [id, setId] = useState('');
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [content, setContent] = useState("");
  const fontContext = useContext(FontContext);
  const { token } = useAuth();
  const { username } = useAuth();

  /* const [officialBulletins, setOfficialBulletins] = useState<
    IOfficialBulletin[]
  >([]);
  const [loading, setLoading] = useState(true); */

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill all fields");
      return;
    }
    const newBulletin: IOfficialBulletin = {
      id: Date.now().toString(),
      title: title.trim(),
      createdAt: new Date().toISOString(),
      content: content.trim(),
    };
    try {
      const headers: any = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newBulletin),
      });

      if (!response.ok) {
        throw new Error(`API error`);
      }
      const data = await response.json();
      if (context) {
        await context.saveOfficialBulletins(newBulletin);
      }
      navigation.navigate("OfficialBulletinsSummary");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          Admin Add Screen
        </Text>

        {username && (
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              ID: {username}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/*  <TextInput
        
        placeholder="Enter id"
        onChangeText={newText => setId(newText)}
      
      />
 */}

      {/*  <TextInput
        
        placeholder="Enter type"
        onChangeText={newText => setType(newText)}
      
      />


 */}

      <TextInput
        placeholder="Enter title"
        style={[{ fontSize: fontContext?.fontSize || 16 }, styles.input]}
        onChangeText={(newText) => setTitle(newText)}
      />

      <TextInput
        placeholder="Enter content"
        style={[{ fontSize: fontContext?.fontSize || 16 }, styles.input]}
        onChangeText={(newText) => setContent(newText)}
      />

      {/* 


      <TouchableOpacity
        onPress={handleSubmit}
        style={{ backgroundColor: "black" }}
      >
        <Text style={{ color: "white", fontSize: fontContext?.fontSize || 16 }}>
          Add
        </Text>
      </TouchableOpacity>





 */}

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.buttonLeft}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRight} onPress={handleSubmit}>
          <Text
            style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
          >
            Submit
          </Text>
        </TouchableOpacity>

        {/* <Button title="Submit" onPress={handleSubmit} /> */}
      </View>




{/* 


      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text
          style={{
            fontSize: fontContext?.fontSize || 16,
            textAlign: "center",
            color: "white",
          }}
        >
          Back
        </Text>
      </TouchableOpacity>


 */}











    </View>
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
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
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

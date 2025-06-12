import React from "react";
import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, IItem } from "../types";
import { useState } from "react";
import { ItemContext } from "../Context/context";
import { ItemContextType } from "../types";
import { useContext } from "react";
import { FontContext } from "../Context/fontContext";
import { useAuth } from "../Context/AuthContext";
import { StyleSheet } from "react-native";

type AddScreenProps = NativeStackScreenProps<RootStackParamList, "Add">;

const API_URL = "http://172.19.159.72:5143/api/bulletins/member";

export default function AddScreen({ navigation }: AddScreenProps) {
  const context = useContext(ItemContext);
  const { token } = useAuth();
  const { username } = useAuth();

  if (!context) {
    alert("Context not avaialble");
    return null;
  }
  const { refreshBulletins } = context;

  //  const [id, setId] = useState('');
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const fontContext = useContext(FontContext);

  const handleSubmit = async () => {
    if (!token) {
      alert("You must be logged in to submit.");
      return;
    }

    if (!title.trim() || !category.trim()) {
      alert("Fill all fields");
      return;
    }

    const newBulletin: IItem = {
      id: Date.now().toString(),
      title: title.trim(),
      category: Number(category),
      content: content.trim(),
    };

    console.log("Submitting bulletin:", newBulletin);
    console.log("Payload JSON:", JSON.stringify(newBulletin));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBulletin),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Item created:", data);

      if (!context) {
        alert("Context not avaialable");
        return;
      }

      const { saveBulletins } = context;

      await saveBulletins(data.data);

      await refreshBulletins();

      navigation.navigate("MemberBulletinSummary");
    } catch (error) {
      console.error(error);
    }
  };

  const handleTypeSelect = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          Add Screen
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

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={styles.event}
          onPress={() => handleTypeSelect("Interest")}
        >
          <Text
            style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
          >
            {" "}
            Interest{" "}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.event}
          onPress={() => handleTypeSelect("Event")}
        >
          <Text
            style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
          >
            {" "}
            Update{" "}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.event}
          onPress={() => handleTypeSelect("Update")}
        >
          <Text
            style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
          >
            {" "}
            Event{" "}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Enter title"
        style={[
          { fontSize: fontContext?.fontSize || 16, color: "black" },
          styles.input,
        ]}
        onChangeText={(newText) => setTitle(newText)}
      />

      <TextInput
        placeholder="Enter content"
        style={[
          { fontSize: fontContext?.fontSize || 16, color: "black" },
          styles.input,
        ]}
        onChangeText={(newText) => setContent(newText)}
      />

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

        <TouchableOpacity onPress={handleSubmit} style={styles.buttonRight}>
          <Text
            style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
          >
            {" "}
            Submit{" "}
          </Text>
        </TouchableOpacity>

        {/*         <TouchableOpacity
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
        </TouchableOpacity> */}

        {/*       <Button title="1" onPress={() => handleTypeSelect("1")} />

      <Button title="2" onPress={() => handleTypeSelect("2")} />

      <Button title="3" onPress={() => handleTypeSelect("3")} />

      <TextInput
        placeholder="Enter title"
        onChangeText={(newText) => setTitle(newText)}
      />

      <Button title="Submit" onPress={handleSubmit} /> */}
      </View>
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
    //backgroundColor: "black",
  },

  buttonLeft: {
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "black"
  },

  buttonRight: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: "black"
  },

  event: {
    backgroundColor: "pink",
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

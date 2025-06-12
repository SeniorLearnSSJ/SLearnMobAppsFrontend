import React from "react";
import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ItemContext } from "../Context/context";
import { ItemContextType, IItem } from "../types";
import { useContext, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { FontContext } from "../Context/fontContext";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";

type EditOfficialScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "EditOfficial"
>;

const API_BASE = "http://172.19.159.72:5143/api/bulletins/official";

export default function EditOfficialScreen({
  navigation,
  route,
}: EditOfficialScreenProps) {
  const context = useContext(ItemContext);
  const { token } = useAuth();

  if (!context) {
    return <Text> Loading</Text>;
  }

  const { item } = route.params;
  const [title, setTitle] = useState(item?.title ?? "");
  const [datetime, setDateTime] = useState<Date | null>(
    item?.createdAt ? new Date(item.createdAt) : null
  );
  const [content, setContent] = useState(item.content ?? "");
  const { saveOfficialBulletins, deleteOfficialBulletins } = context;
  const fontContext = useContext(FontContext);
  const { username } = useAuth();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Fill all fields");
      return;
    }

    const updatedBulletin = {
      id: item?.id ?? Date.now().toString(),
      title: title.trim(),
      createdAt: new Date().toISOString(),
      content: content.trim(),
    };

    try {
      const response = await fetch(`${API_BASE}/${updatedBulletin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBulletin),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Updated item:", data);

      await saveOfficialBulletins(updatedBulletin);
      navigation.navigate("OfficialBulletinsSummary");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update bulletin");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      console.log(`Item with ID ${id} deleted successfully.`);
      deleteOfficialBulletins(id);
      navigation.navigate("OfficialBulletinsSummary");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  /* 

  const deleteItem = (idToDelete: string) => {
    deleteOfficialBulletins(idToDelete);
    navigation.navigate("OfficialBulletinsSummary");
  }; */

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          Official bulletin details
        </Text>

        {username && (
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              ID: {username}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>{item.id}</Text>

      {/*      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        {item.title}
      </Text>
      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        {item.content}
      </Text> */}

      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      <TextInput
        style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
        value={title}
        onChangeText={setTitle}
      ></TextInput>

      <TextInput
        style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
        value={content}
        onChangeText={setContent}
      ></TextInput>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.buttonLeft} onPress={handleSubmit}>
          <Text style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRight}
          onPress={() => deleteItem(item.id)}
        >
          <Text style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}>Delete</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text
          style={{ fontSize: fontContext?.fontSize || 16, textAlign: "center", color: "white" }}
        >
          Back
        </Text>
      </TouchableOpacity>

      {/* 
      <Button
        title="Submit"
        onPress={() => {
          handleSubmit();
        }}
      />

      <Button
        title="Delete"
        onPress={() => {
          deleteItem(item.id);
        }}
      />
 */}
    </ScrollView>
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
    color: "white",
    borderRadius: 10,
    margin: 20,
  },

  bottomButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: "black"
  },
});

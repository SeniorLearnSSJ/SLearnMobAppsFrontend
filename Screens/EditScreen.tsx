/**
 * This imports React and React Native components, along with nav props, context, custom types and a custom hook.
 */

import React from "react";
import { View, Text, Button, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ItemContext } from "../Context/context";
import { ItemContextType, IItem } from "../types";
import { useContext, useState } from "react";
import { MemberBulletinCategory } from "../types";
import { StyleSheet } from "react-native";

import { useAuth } from "../Context/AuthContext";
import { FontContext } from "../Context/fontContext";

/**
 * This adds the screen to the navigation stack.
 */

type EditScreenProps = NativeStackScreenProps<RootStackParamList, "Edit">;

/**
 * This assigns a readable constant to the API.
 */
const API_BASE = "http://192.168.1.244:5143/api/bulletins/member";

/**
 * This functioanl component takes nav props and route params.  It returns the UI.
 * @param param0 Nav props/route params.
 * @returns User interface
 */

export default function EditScreen({ navigation, route }: EditScreenProps) {
  const context = useContext(ItemContext);
  const fontContext = useContext(FontContext); // Correct: this is the *context value*
  const { username } = useAuth();

  const { token } = useAuth();
  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { bulletins, deleteBulletin, saveBulletins } = context;

  const { item } = route.params;
  const [title, setTitle] = useState(item?.title ?? "");
  const [category, setCategory] = useState<number>(() => {
    if (typeof item?.category === "string") {
      return MemberBulletinCategory[
        item.category as keyof typeof MemberBulletinCategory
      ];
    }
    return item?.category ?? 0;
  });
  const [content, setContent] = useState(item.content ?? "");

  /**
   * This function handles form submission.
   * @returns It has no return value.
   */
  const handleSubmit = async () => {
    if (
      !title.trim() ||
      category == null ||
      category == undefined ||
      !content.trim()
    ) {
      alert("Fill all fields");
      return;
    }
    // const newBulletin = { id: Date.now().toString(), title: title.trim() };

    const updatedBulletin = {
      id: item?.id ?? Date.now().toString(),
      title: title.trim(),
      category: category,
      content: content.trim(),
    };

    /**
     * At this point, the handleSubmit function retrieves the data at the API and updates it using the saveBulletins function.
     */
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

      saveBulletins(updatedBulletin);

      navigation.navigate("MemberBulletinSummary");
    } catch (error) {
      console.error(error);
      alert("Failed to update bulletin");
    }
  };

  /**
   * This function deletes the item from the backend the corresponds to the parameter.
   * @param idToDelete
   */

  const deleteItem = async (idToDelete: string) => {
    try {
      const response = await fetch(`${API_BASE}/${idToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      deleteBulletin(idToDelete);
      navigation.navigate("MemberBulletinSummary");

      console.log(`Item with ID ${idToDelete} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting item:", error);
    }

    //deleteBulletin(idToDelete);
    //navigation.navigate("MemberBulletinSummary");
  };

  /**
   * This function updates the category to the category selected by the pressable element.
   * @param category
   */

  const handleTypeSelect = (category: number) => {
    setCategory(category);
  };

  /**
   * This is a user interface element.
   */
  return (
    <ScrollView>
      <View>
        <View style={styles.headerRow}>
          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            Member bulletin details
          </Text>

          {username && (
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                ID: {username}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 
      <Text>{item.type}</Text> */}

        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>{item.id}</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.Button,
              { backgroundColor: "black", marginRight: 10 },
            ]}
            onPress={() => handleTypeSelect(0)}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                backgroundColor: "black",
              }}
            >
              Interest
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.Button,
              { backgroundColor: "black", marginRight: 10 },
            ]}
            onPress={() => handleTypeSelect(1)}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                backgroundColor: "black",
              }}
            >
              Event
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.Button, { backgroundColor: "black" }]}
            onPress={() => handleTypeSelect(2)}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                backgroundColor: "black",
              }}
            >
              Update
            </Text>
          </TouchableOpacity>

          {/* 

        <Button title="Interest" onPress={() => handleTypeSelect(0)} />

        <Button title="Event" onPress={() => handleTypeSelect(1)} />

        <Button title="Update" onPress={() => handleTypeSelect(2)} /> */}
        </View>

        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>Title</Text>

        {/* <TextInput value={type} onChangeText={setType}></TextInput> */}

        <TextInput
          style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
          value={title}
          onChangeText={setTitle}
        ></TextInput>

        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>Content</Text>

        <TextInput
          style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
          value={content}
          onChangeText={setContent}
        ></TextInput>

        <View style={styles.lowerButtons}>
          <TouchableOpacity
            style={[
              styles.Button,
              { backgroundColor: "black", marginRight: 15 },
            ]}
            onPress={handleSubmit}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                backgroundColor: "black",
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.Button, { backgroundColor: "black" }]}
            onPress={() => deleteItem(item.id)}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                backgroundColor: "black",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>

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
      </View>
    </ScrollView>
  );
}

/**
 * This is the styling for the UI above.
 */

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
  },

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
  lowerButtons: {
    flexDirection: "row",
    marginLeft: 15,
    marginRight: 15,
  },
  input: {
    color: "white",
    backgroundColor: "blue",
    borderRadius: 15,
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: "black",
  },
});

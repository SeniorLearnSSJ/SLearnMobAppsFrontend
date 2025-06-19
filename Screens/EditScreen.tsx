/**
 * This imports React and React Native components, along with nav props, context, custom types and a custom hook.
 */

import React from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ItemContext } from "../Context/context";
import { ItemContextType, IItem } from "../types";
import { useContext, useState } from "react";
import { MemberBulletinCategory } from "../types";
import { StyleSheet } from "react-native";

import { useAuth } from "../Context/AuthContext";
import { FontContext } from "../Context/fontContext";
import { styles } from "../styles";
import { Picker } from "@react-native-picker/picker";
import {API_URL} from "../apiConfig";

/**
 * This adds the screen to the navigation stack.
 */

type EditScreenProps = NativeStackScreenProps<RootStackParamList, "Edit">;

/**
 * This assigns a readable constant to the API.
 */
const API_BASE = `${API_URL}/api/bulletins/member`;

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
  //const [selectedValue, setSelectedValue] = useState<string>("Interest");
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

      <View>
        <View style={styles.headerRow}>
          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            Member bulletin details
          </Text>
        </View>

        <View style={styles.shiftCenter}>
          <Text
            style={[
              styles.shiftCenter,
              { fontSize: fontContext?.fontSize || 16 },
            ]}
          >
            Title
          </Text>

          <TextInput
            style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
            value={title}
            onChangeText={setTitle}
          ></TextInput>

          <View style={styles.container}>
            <Text style={styles.headerText}>Select an option:</Text>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={[styles.picker, { fontSize: fontContext?.fontSize || 16 }]}
            >
              <Picker.Item
                label="Interest"
                value={MemberBulletinCategory.Interest}
                style={{ fontSize: fontContext?.fontSize || 16 }}
              />
              <Picker.Item
                label="Update"
                value={MemberBulletinCategory.Update}
                style={{ fontSize: fontContext?.fontSize || 16 }}
              />
              <Picker.Item
                label="Event"
                value={MemberBulletinCategory.Event}
                style={{ fontSize: fontContext?.fontSize || 16 }}
              />
            </Picker>

            <Text
              style={[
                styles.selectedText,
                { fontSize: fontContext?.fontSize || 16 },
              ]}
            >
              Selected:{MemberBulletinCategory[category]}
            </Text>
          </View>

          <Text
            style={[
              styles.shiftCenter,
              { fontSize: fontContext?.fontSize || 16 },
            ]}
          >
            Content
          </Text>

          <TextInput
            style={[styles.fatInput, { fontSize: fontContext?.fontSize || 16 }]}
            value={content}
            onChangeText={setContent}
          ></TextInput>

          <View style={styles.bottomButtons}>
            <TouchableOpacity style={[styles.buttonLeft]} onPress={handleSubmit}>
              <Text
                style={{
                  fontSize: fontContext?.fontSize || 16,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonRight}
              onPress={() => deleteItem(item.id)}
            >
              <Text
                style={{
                  fontSize: fontContext?.fontSize || 16,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

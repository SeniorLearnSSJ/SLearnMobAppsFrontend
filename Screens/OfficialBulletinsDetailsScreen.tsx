/**
 * This imports React/React Native componnets, along with nav props, context and functions.
 */

import React from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IOfficialBulletin, RootStackParamList } from "../types";
import { ItemContext } from "../Context/context";
import { ItemContextType, IItem } from "../types";
import { useContext, useEffect } from "react";
import { ListNode, DoublyLinkedList } from "../helper";
import { useAuth } from "../Context/AuthContext";
import { FontContext } from "../Context/fontContext";
import { StyleSheet } from "react-native";
import { styles } from "../styles";
import { API_URL } from "../apiConfig";
/**

/**
 * This adds the screen to the navigation stack.
 */

type OfficialBulletinsDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "OfficialBulletinsDetails"
>;

/**
 * This makes the API readable.
 */

const API_BASE = `${API_URL}/api/bulletins/official`;

/**
 * This functional commponent renders the screen UI.
 * @param param0 Nav props, route params
 * @returns UI
 */

export default function OfficialBulletinsDetailsScreen({
  navigation,
  route,
}: OfficialBulletinsDetailsScreenProps) {
  const context = useContext(ItemContext);
  const { token, role } = useAuth();
  const fontContext = useContext(FontContext);

  if (!context) {
    return <Text> Loading....</Text>;
  }
  const {
    officialBulletins,
    officialBulletinList,
    deleteOfficialBulletins,
    loadingOfficial,
  } = context;
  const { item } = route.params as { item: IOfficialBulletin}
  
  useEffect(() => {
  if (officialBulletinList.length === 0 && officialBulletins.length > 0) {
    console.log("📦 Rebuilding linked list on details screen.");
    officialBulletinList.buildFromArray(
      officialBulletins.map((b) => ({
        id: b.id,
        title: b.title,
        datetime: new Date(b.createdAt),
        content: b.content,
      }))
    );
  }
}, [officialBulletins]);
    









    
  const currentNode = officialBulletinList.getNodeById(item.id);
  const { username } = useAuth();

  /**
   * This deletes the item corresponding to the parameter.
   * @param idToDelete
   */
  const deleteItem = async (idToDelete: string) => {
    try {
      const response = await fetch(`${API_BASE}/${idToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- Add this line
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      console.log(`Item with ID ${idToDelete} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting item:", error);
    }

    deleteOfficialBulletins(idToDelete);
    navigation.navigate("OfficialBulletinsSummary");
  };

  /**
   * This function takes a node as param and navigates to the item matching the selected id, replacing the current screen with the screen correspoding to the id.  The selected node's data is displayed.
   * @param node
   */

  const handleNavigate = (node: ListNode) => {
    navigation.replace("OfficialBulletinsDetails", {
      item: {
        id: node.id,
        title: node.title,
        createdAt: node.datetime.toISOString(),
        content: node.content,
      },
    });
  };

  /**
   * This defines the state of the node. CanPrev states indicate that there is a previous node.  CanNext indicates that there is a next node.
   */
  const canPrev = !!currentNode?.prev;
  const canNext = !!currentNode?.next;

  if (loadingOfficial) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  /**
   * This is this UI.  If a node is not selected or there is no next/previous node, the next/prev buttons are greyed out.  Otherwise, nodes are used to navigate back and forth through the linked list.
   */
  return (
    <ScrollView>
      <View style={styles.colorPurple}>
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

        <View style={styles.shiftCenter}>
          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            {new Date(item.createdAt).toDateString()}
          </Text>

          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            {" "}
            {item.title}
          </Text>
          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            {" "}
            {item.content}
          </Text>

          <View style={styles.bottomButtons}>
            {token && role === "Administrator" && (
              <TouchableOpacity
                style={[styles.buttonLeft, { marginTop: 30 }]}
                onPress={() => navigation.navigate("EditOfficial", { item })}
              >
                <Text
                  style={{
                    fontSize: fontContext?.fontSize || 16,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            )}

            {token && role === "Administrator" && (
              <TouchableOpacity
                style={[styles.buttonRight, { marginTop: 30 }]}
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
            )}
          </View>

          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={[
                styles.buttonLeft,
                !canPrev && styles.buttonDisabled,
                { marginTop: 30 },
              ]}
              onPress={() => {
                if (canPrev && currentNode?.prev) {
                  const prevNode = currentNode.prev;
                  navigation.replace("OfficialBulletinsDetails", {
                    item: {
                      id: prevNode.id,
                      title: prevNode.title,
                      createdAt: prevNode.datetime.toISOString(),
                      content: prevNode.content,
                    },
                  });
                }
              }}
              disabled={!currentNode || !currentNode.prev}
            >
              <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonRight,
                !canNext && styles.buttonDisabled,
                { marginTop: 30 },
              ]}
              disabled={!currentNode || !currentNode.next}
              // onPress={() =>
              //   currentNode?.next && handleNavigate(currentNode.next)
              // }

              onPress={() => {
                if (canNext && currentNode?.next) {
                  const nextNode = currentNode.next;
                  navigation.replace("OfficialBulletinsDetails", {
                    item: {
                      id: nextNode.id,
                      title: nextNode.title,
                      createdAt: nextNode.datetime.toISOString(),
                      content: nextNode.content,
                    },
                  });
                }
              }}
            >
              <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

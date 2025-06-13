import React from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IOfficialBulletin, RootStackParamList } from "../types";
import { ItemContext } from "../Context/context";
import { ItemContextType, IItem } from "../types";
import { useContext } from "react";
import { ListNode, DoublyLinkedList } from "../helper";
import { useAuth } from "../Context/AuthContext";
import { FontContext } from "../Context/fontContext";
import { StyleSheet } from "react-native";

type OfficialBulletinsDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "OfficialBulletinsDetails"
>;

const API_URL = "http://192.168.1.244:5143/api/bulletins/official";

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
  const { item } = route.params as { item: IOfficialBulletin };
  const currentNode = officialBulletinList.getNodeById(item.id);

  const deleteItem = async (idToDelete: string) => {
    try {
      const response = await fetch(`${API_URL}/${idToDelete}`, {
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

  const canPrev = !!currentNode?.prev;
  const canNext = !!currentNode?.next;

  if (loadingOfficial) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        Official bulletin details
      </Text>

      {/* 
      <Text>{item.datetime.toDateString()}</Text> */}

      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        {new Date(item.createdAt).toDateString()}
      </Text>

      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>{item.id}</Text>
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
              style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
            >
              Edit
            </Text>
          </TouchableOpacity>

          /* 

        <Button
          title="Edit"
          onPress={() => navigation.navigate("EditOfficial", { item })}
        />
 */
        )}

        {token && role === "Administrator" && (
          <TouchableOpacity
            style={[styles.buttonRight, { marginTop: 30 }]}
            onPress={() => deleteItem("item.id")}
          >
            <Text
              style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
            >
              Delete
            </Text>
          </TouchableOpacity>

          /*         <Button
          title="Delete"
          onPress={() => {
            deleteItem(item.id);
          }}
        />
 */
        )}
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[
            styles.buttonLeft,
            !canPrev && styles.buttonDisabled,
            { marginTop: 30 },
          ]}
          onPress={() => currentNode?.prev && handleNavigate(currentNode.prev)}
          disabled={!currentNode || !currentNode.prev}
        >
          <Text
            style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {/*    <Button
        title="Previous"
        disabled={!currentNode || !currentNode.prev}
        onPress={() => currentNode?.prev && handleNavigate(currentNode.prev)}
      />
 */}

        <TouchableOpacity
          style={[
            styles.buttonRight,
            !canNext && styles.buttonDisabled,
            { marginTop: 30 },
          ]}
          disabled={!currentNode || !currentNode.next}
          onPress={() => currentNode?.next && handleNavigate(currentNode.next)}
        >
          <Text
            style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.buttonLeft}
          onPress={() => navigation.navigate("OfficialBulletinsSummary")}
        >
          <Text
            style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
          >
            Back to summary
          </Text>
        </TouchableOpacity>

        {/*       <Button
        title="Next"
        disabled={!currentNode || !currentNode.next}
        onPress={() => currentNode?.next && handleNavigate(currentNode.next)}
      /> */}
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
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
  buttonDisabled: {
    backgroundColor: "grey",
  },
});

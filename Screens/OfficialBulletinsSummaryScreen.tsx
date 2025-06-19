/**
 * Hooks are imported, along with React or React Native components, interfaces, nav props, custom types, functions.
 */
import React, { useState, useEffect } from "react";

import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IOfficialBulletin, RootStackParamList } from "../types";
import { useContext } from "react";
import { ItemContext } from "../Context/context";
import TabMenu from "../tabs";
import { IItem, ItemContextType } from "../types";
import { useAuth } from "../Context/AuthContext";
import { FontContext } from "../Context/fontContext";
import { StyleSheet } from "react-native";
import { styles } from "../styles";
import { API_URL } from "../apiConfig";

/**
 * Adds the screen to navigation.
 */
type Props = NativeStackScreenProps<
  RootStackParamList,
  "OfficialBulletinsSummary"
>;

/**
 * Makes URL readable.
 */

const API_BASE = `${API_URL}/api/bulletins/official`;

/**
 * Screen component
 * @param param0 Takes nav props
 * @returns UI
 */

const OfficialBulletinsSummary: React.FC<Props> = ({ navigation }) => {
  const context = useContext(ItemContext);
  const { token, role } = useAuth();
  console.log("Token:", token);
  console.log("Role:", role);

  const [officialBulletins, setOfficialBulletins] = useState<
    IOfficialBulletin[]
  >([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const fontContext = useContext(FontContext);
  const { username } = useAuth();

  /**
   * This hook fetches bulletins from the back end and updates the state of official bulletins via setOfficialBulletins. It runs once only after component mounts.
   */

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await fetch(API_BASE, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched items:", data);
        setOfficialBulletins(data.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [token]);

  if (!context) {
    return (
      <View>
        <Text>Loading context ...</Text>
      </View>
    );
  }

  //const { officialBulletins, loadingOfficial } = context;

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  interface GroupedOfficialBulletins {
    today: IOfficialBulletin[];
    earlier: IOfficialBulletin[];
  }

  const intitalGrouping: GroupedOfficialBulletins = {
    today: [],
    earlier: [],
  };

  /**
   * This sorts bulletins into 2 groups, today's bulletins and earlier bulletins.
   */
  const bulletinsToSort: IOfficialBulletin[] = officialBulletins;

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  /**
   * This function takes two parameters, an accumulator named acc and a bulletin object currentObj
   * @param acc The accumulator, which will group the bulletins into 2 groups of arrays, today and earlier.
   * @param currentObj The bulletin currently being grouped.
   * @returns The updated accumulator with bulletins added etiher to today or earlir group.
   */

  const groupBulletinsBehaviour = (
    acc: GroupedOfficialBulletins,
    currentObj: IOfficialBulletin
  ): GroupedOfficialBulletins => {
    if (isToday(new Date(currentObj.createdAt))) {
      acc.today.push(currentObj);
    } else {
      acc.earlier.push(currentObj);
    }
    return acc;
  };

  /**
   * Bulletins to sort is an array of bulletins, each having a date createdAt.  Reduce method iterates through each bulletin, and sorts them via groupBulletinsBehaviour function.
   */
  const bulletinsGroupedByDate = bulletinsToSort.reduce(
    groupBulletinsBehaviour,
    intitalGrouping
  );

  /**
   * These two groups of arrays are grouped by type (today/earlier) and sorted reveres chronologically.
   */
  const todayBulletins = bulletinsGroupedByDate.today.sort(
    (a: IOfficialBulletin, b: IOfficialBulletin) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const earlierBulletins = bulletinsGroupedByDate.earlier.sort(
    (a: IOfficialBulletin, b: IOfficialBulletin) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sortedBulletins = [...todayBulletins, ...earlierBulletins];

  /**
   * This function renders the items and allows for pressability and navigation to the item's details.
   * @param param0 Item of type official bullletin.
   * @returns A touchable area.
   */

  const renderItem = ({ item }: { item: IOfficialBulletin }) => (



    
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate("OfficialBulletinsDetails", { item })}
    >
      <Text
        style={[styles.bulletinText, { fontSize: fontContext?.fontSize ?? 16 }]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  /**
   * This returns the UI.
   */
  return (
    //<ScrollView contentContainerStyle={styles.container}>
    <View style={styles.colorPurple}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("BulletinChoice")}
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

        <Text style={{ fontSize: fontContext?.fontSize || 16, color: "black" }}>
          Official bulletins
        </Text>

        <Text style={{ fontSize: fontContext?.fontSize || 16, color: "black" }}>
          Today's bulletins
        </Text>
        <FlatList
          data={todayBulletins}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={
            <Text
              style={{ fontSize: fontContext?.fontSize || 16, color: "black" }}
            >
              No bulletins from today
            </Text>
          }
        />

        <Text style={{ fontSize: fontContext?.fontSize || 16, color: "black" }}>
          Earlier bulletins
        </Text>
        <FlatList
          //style={styles.skinnyButton}
          data={earlierBulletins}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No bulletins</Text>}
          style={styles.list}
        />

        {token && role === "Administrator" && (
          <TouchableOpacity
            style={[styles.addButton, { marginTop: 30 }]}
            onPress={() => navigation.navigate("AddOfficial")}
          >
            <Text
              style={{
                fontSize: fontContext?.fontSize || 16,
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    // </ScrollView>
  );
};

export default OfficialBulletinsSummary;

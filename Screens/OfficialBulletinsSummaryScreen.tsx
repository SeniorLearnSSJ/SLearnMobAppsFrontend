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

const API_URL = "http://192.168.1.244:5143/api/bulletins/official";

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
        const response = await fetch(API_URL, {
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

  /**
   * This function renders the items and allows for pressability and navigation to the item's details.
   * @param param0 Item of type official bullletin.
   * @returns A touchable area.
   */

  const renderItem = ({ item }: { item: IOfficialBulletin }) => (
    <TouchableOpacity
      style={styles.bulletinButton}
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
    <ScrollView>
      <View style={{ flex: 1 }}>
        {username && (
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
                ID: {username}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={{ fontSize: fontContext?.fontSize || 16, color: "black" }}>
          Current role: {role}
        </Text>

        <Text style={{ fontSize: fontContext?.fontSize || 16, color: "black" }}>
          Today's bulletins
        </Text>
        <FlatList
          data={todayBulletins}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
          style={styles.list}
          data={earlierBulletins}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No bulletins</Text>}
        />

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={[styles.buttonLeft, { marginTop: 30 }]}
            onPress={() => navigation.navigate("BulletinChoice")}
          >
            <Text
              style={{ fontSize: fontContext?.fontSize || 16, color: "white" }}
            >
              Back
            </Text>
          </TouchableOpacity>

          {token && role === "Administrator" && (
            <TouchableOpacity
              style={[styles.buttonLeft, { marginTop: 30 }]}
              onPress={() => navigation.navigate("AddOfficial")}
            >
              <Text
                style={{
                  fontSize: fontContext?.fontSize || 16,
                  color: "white",
                }}
              >
                Add
              </Text>
            </TouchableOpacity>

            /* 
        <Button
          title="Add"
          onPress={() => navigation.navigate("AddOfficial")}
        /> */
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default OfficialBulletinsSummary;

/*   const tabs = [1, 2, 3];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  if (!context) {
    return <Text> Loading ...</Text>;
  }

    const { bulletins } = context;

    const filteredBulletins = bulletins.filter((item) => item.type === selectedTab)

  const renderItem = ({ item }: { item: { id: string; title: string; type: number } }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("MemberBulletinDetails", { item })}
    >
      <View>
        <Text>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
   <View style={{ flex: 1 }}>
<TabMenu tabs = {tabs} selectedTab = {selectedTab} setSelectedTab = {setSelectedTab}/>

<FlatList
data = {filteredBulletins}
renderItem = {renderItem}
keyExtractor = {(item) => item.id}/>

 <Button title="Add" onPress={() => navigation.navigate("Add")} />


    </View>
  )
}


export default OfficialBulletinsSummary; */

/**
 * This is styling.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#FFF5E6",
  },

  list: {},

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
  bulletinButton: {
    backgroundColor: "blue",
    borderRadius: 15,
    marginBottom: 10,
  },
  bulletinText: {
    color: "white",
  },
});

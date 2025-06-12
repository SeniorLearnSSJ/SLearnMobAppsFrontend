import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { api } from "../api";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import { useAuth } from "../Context/AuthContext";
import FontSwitch, { fontSizeFromToggle } from "../toggleFont";
import BrightnessSwitch from "../toggleBrightness";
import NotificationsSwitch from "../notifications";
import { ItemContext } from "../Context/context";
import { toggleFromFontSize } from "../toggleFont";

import { FontContext } from "../Context/fontContext";
import { enableFreeze, enableScreens } from "react-native-screens";
import { StyleSheet } from "react-native";

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

/* const FontSizeSetter: React.FC = () => {
  const fontSizeContext = useContext(FontContext);
 if (!FontContext) {
    throw new Error('FontSizeSetter must be used within a FontSizerovider');
  }
 */

const Settings_API_URL = "http://172.19.159.72:5143/api/profile/settings";

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { logout } = useAuth();
  const authContext = useContext(AuthContext);
  const itemContext = useContext(ItemContext);
  const { token } = useAuth();

  if (!authContext || !itemContext) {
    return <Text>Loading....</Text>;
  }

  const fontContext = useContext(FontContext);
  if (!fontContext) throw new Error("FontContext not found");
  const { fontSize, setFontSize } = fontContext;

  //type ToggleValue = 0 | 1 | 2;

  //const [toggleValue, setToggleValue] = useState<ToggleValue>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  if (!authContext) {
    return <Text>Loading...</Text>;
  }
  /* 
  useEffect(() => {
    const initialToggle = toggleFromFontSize(fontSize);
    setToggleValue(initialToggle);
  }, []);

  useEffect(() => {
    const newFontSize = fontSizeFromToggle(toggleValue);
    setFontSize(newFontSize);
  }, [toggleValue]); */

  const getSettings = async () => {
    try {
      const response = await fetch(Settings_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getSettings()
      .then((data) => {
        if (data) {
          setFontSize(data.fontSize);
          setIsDarkMode(data.darkMode);
          setNotifications(data.enableNotifications);
        }
      })

      .finally(() => setLoading(false));
  }, []);

  const updateItem = async (
    fontSize: number,
    darkMode: boolean,
    enableNotifications: boolean
  ) => {
    try {
      const response = await fetch(Settings_API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fontSize, darkMode, enableNotifications }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Updated item:", data);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleSubmitFont = (size: number) => {
    setFontSize(size);
  };

  const handleSubmit = () => {
    updateItem(fontSize, isDarkMode, notifications);
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          Settings screen
        </Text>
        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            Font size
          </Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => handleSubmitFont(16)}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                //backgroundColor: "black",
              }}
            >
              16
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => handleSubmitFont(20)}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                // backgroundColor: "black",
              }}
            >
              20
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => handleSubmitFont(24)}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                //backgroundColor: "black",
              }}
            >
              24
            </Text>
          </TouchableOpacity>

          {/* 


        <Button title="16" onPress={() => handleSubmitFont(16)}></Button>
        <Button title="20" onPress={() => handleSubmitFont(20)}></Button>
        <Button title="24" onPress={() => handleSubmitFont(24)}></Button>
 */}





 
        </View>
        <View style={{ margin: 20 }}>
          <Text
            style={{ marginBottom: 20, fontSize: fontContext?.fontSize || 16 }}
          >
            Dark mode
          </Text>
          <BrightnessSwitch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            fontSize={fontContext?.fontSize || 16}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
            Notifications
          </Text>
          <NotificationsSwitch
            value={notifications}
            onValueChange={setNotifications}
            fontSize={fontContext?.fontSize || 16}
          />
        </View>









        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.buttonLeft}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                //backgroundColor: "black",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonRight} onPress={logout}>
            <Text
              style={{
                color: "white",
                fontSize: fontContext?.fontSize || 16,
                // backgroundColor: "black",
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/*       <View>
        <Button title="Logout" onPress={logout} />
      </View> */}
      </SafeAreaView>
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

  list: {},

  input: {
    backgroundColor: "blue",
    color: "white",
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
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "black",
  },

  buttonRight: {
    flex: 1,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
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

/**
 * This imports React and React Native components, along with nav props, context, custom types and a custom hook.
 */

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
  Image,
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
import { styles } from "../styles";
import { API_URL } from "../apiConfig";

/**
 * Adds screen to navigation stack.
 */

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

/**
 * Makes URL readable.
 */
const Settings_API_URL = `${API_URL}/api/profile/settings`;

/**
 * Defines the screen component.
 * @param param0 Nav props
 * @returns UI
 */

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { logout } = useAuth();
  const authContext = useContext(AuthContext);
  const itemContext = useContext(ItemContext);
  const { token } = useAuth();
  const { username } = useAuth();

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

  /**
   * Retrieves settings from backend, updates state with data
   * @returns JSON data
   */

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

  /**
   * This function takes the data from the backend and updates where necessary.
   * @param fontSize T
   * @param darkMode
   * @param enableNotifications
   */
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

  /**
   * This function updates the font size with the size input.  It is a local update to state.
   * @param size
   */
  const handleSubmitFont = (size: number) => {
    setFontSize(size);
  };

  /**
   * This function handles the form submission, updating the backend where necessary.
   */

  const handleSubmit = () => {
    updateItem(fontSize, isDarkMode, notifications);
  };

  /**
   * UI
   */
  return (
    <ScrollView style={styles.colorPurple}>
      <SafeAreaView>
        <View style={styles.shiftCenter}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              Settings screen
            </Text>
          </View>

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

          <View style={{ margin: 20 }}>
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              Font size
            </Text>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[
                  styles.input,
                  { paddingVertical: 10, paddingHorizontal: 20 },
                ]}
                onPress={() => handleSubmitFont(16)}
              >
                <Text
                  style={{
                    fontSize: fontContext?.fontSize || 16,
                  }}
                >
                  16
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.input,
                  { paddingVertical: 10, paddingHorizontal: 20 },
                ]}
                onPress={() => handleSubmitFont(20)}
              >
                <Text
                  style={{
                    fontSize: fontContext?.fontSize || 16,
                  }}
                >
                  20
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.input,
                  { paddingVertical: 10, paddingHorizontal: 20 },
                ]}
                onPress={() => handleSubmitFont(24)}
              >
                <Text
                  style={{
                    fontSize: fontContext?.fontSize || 16,
                  }}
                >
                  24
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ margin: 20 }}>
            <Text
              style={{
                marginBottom: 20,
                fontSize: fontContext?.fontSize || 16,
              }}
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
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

/**
 * Styling
 */

{
  /* const styles = StyleSheet.create({
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
 */
}

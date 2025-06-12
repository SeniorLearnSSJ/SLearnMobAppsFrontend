import React from "react";
import { View, Pressable, Text } from "react-native";
import { StyleSheet } from "react-native";

type BrightnessSwitchProps = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  fontSize?: number;
};

const BrightnessSwitch: React.FC<BrightnessSwitchProps> = ({
  value,
  onValueChange,
  fontSize = 16,
}) => {
  const toggleSwitch = () => {
    onValueChange(!value);
  };

  return (
    <Pressable onPress={toggleSwitch}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: value ? "lightblue" : "darkblue",
          },
          //justifyContent: "center",
          // alignItems: value ? "flex-end" : "flex-start",
        ]}
      >
        <Text style={[styles.label, { fontSize }]}>
          {value ? "Dark" : "Light"}
        </Text>

        <View
          style={[
            styles.toggleCircle,
            { alignSelf: value ? "flex-end" : "flex-start" },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 70,
    borderRadius: 20,
    padding: 5,
    justifyContent: "center",
    position: "relative",
  },

  label: {
    color: "white",
    position: "relative",
  },

  toggleCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "white",
  },
});

export default BrightnessSwitch;

import React from "react";
import { View, Pressable, Text } from "react-native";

type ToggleValue = 0 | 1 | 2;

type FontSwitchProps = {
  value: ToggleValue;
  onValueChange: (newValue: ToggleValue) => void;
};

const FontSwitch: React.FC<FontSwitchProps> = ({ value, onValueChange }) => {
  const toggleSwitch = () => {
    const nextValue = (value + 1) % 3 as ToggleValue;
    onValueChange(nextValue);
  };

  const backgroundColors = ["gray", "yellow", "green"];
  const labels = ["Small", "Medium", "Large"];

  return (
    <Pressable onPress={toggleSwitch}>
      <View
        style={{
          width: 70,
          height: 30,
          backgroundColor: backgroundColors[value],
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15,
        }}
      >
        <Text style={{ color: "black", fontWeight: "bold" }}>
          {labels[value]}
        </Text>
      </View>
    </Pressable>
  );
};

export const fontSizeFromToggle = (value: ToggleValue): number =>{
  switch (value){
    case 0: return 16;
    case 1: return 20;
    case 2: return 24;
    default: return 20;
  }
}

export const toggleFromFontSize = (fontSize: number): ToggleValue =>{
  if (fontSize <-16) return 0;
  if (fontSize <=20) return 1;
  return 2;
};

export default FontSwitch;

import React from "react";
import { View, Pressable, Text } from "react-native";

type NotificationsSwitchProps = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  fontSize?: number;
};

const NotificationsSwitch: React.FC<NotificationsSwitchProps> = ({
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
        style={{
          width: 50,
          height: 50,
          backgroundColor: value ? "green" : "gray",
          justifyContent: "center",
          alignItems: value ? "flex-end" : "flex-start",
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize }}>{value ? "Yes" : "No"}</Text>

        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: "white",
          }}
        />
      </View>
    </Pressable>
  );
};

export default NotificationsSwitch;

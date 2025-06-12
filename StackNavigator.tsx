import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AtriumScreen from "./Screens/AtriumScreen";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import BulletinChoiceScreen from "./Screens/BulletinChoiceScreen";
import MemberBulletinSummaryScreen from "./Screens/MemberBulletinSummaryScreen";
import MemberBulletinDetailsScreen from "./Screens/MemberBulletinDetailsScreen";
import AddScreen from "./Screens/AddScreen";
import EditScreen from "./Screens/EditScreen";
import OfficialBulletinsSummaryScreen from "./Screens/OfficialBulletinsSummaryScreen";
import AddOfficialScreen from "./Screens/AddOfficialScreen";
import EditOfficialScreen from "./Screens/EditOfficialScreen";
import OfficialBulletinsDetailsScreen from "./Screens/OfficialBulletinsDetailsScreen";
import SettingsScreen  from "./Screens/SettingsScreen";
import ProfileScreen from "./Screens/ProfileScreen";

import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Atrium">
      <Stack.Screen name="Atrium" component={AtriumScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Register" component={RegisterScreen} />

      <Stack.Screen name="BulletinChoice" component={BulletinChoiceScreen} />
      <Stack.Screen
        name="MemberBulletinSummary"
        component={MemberBulletinSummaryScreen}
      />
      <Stack.Screen
        name="MemberBulletinDetails"
        component={MemberBulletinDetailsScreen}
      />
      <Stack.Screen
        name="OfficialBulletinsSummary"
        component={OfficialBulletinsSummaryScreen}
      />

      <Stack.Screen name="Add" component={AddScreen} />

      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="AddOfficial" component={AddOfficialScreen} />
      <Stack.Screen name="EditOfficial" component={EditOfficialScreen} />
       <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="OfficialBulletinsDetails"
        component={OfficialBulletinsDetailsScreen}
      />
        <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
}

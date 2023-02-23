import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "./screens/HomeScreen";
import { WeightTracker } from "./screens/WeightTracker";

const NativeStackNavigator = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <NativeStackNavigator.Navigator initialRouteName="Home">
        <NativeStackNavigator.Screen
          name={"Home"}
          component={HomeScreen}
          // options={{ headerShown: false }}
        />
        <NativeStackNavigator.Screen
          name="WeightTracker"
          component={WeightTracker}
        />
      </NativeStackNavigator.Navigator>
    </NavigationContainer>
  );
}

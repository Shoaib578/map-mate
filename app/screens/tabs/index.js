import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // For icons
import ExploreScreen from "./explore/index";
import AddLocationScreen from "./explore/add-location";
import ProfileScreen from "./profile";
import { CardStyleInterpolators } from "react-navigation-stack";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountSettingsScreen from "./acount_settings";
import Navigate from "./explore/navigate";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator()


const ExploreStack = ()=>{
  return <Stack.Navigator screenOptions={{gestureEnabled:true,gestureDirection:'horizontal', cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,}}>
    <Stack.Screen name="Explore" component={ExploreScreen} options={{headerShown:false}}/>
    <Stack.Screen name="Navigate" component={Navigate} options={{headerShown:false}}/>

    <Stack.Screen name="AddLocation" component={AddLocationScreen} options={{headerShown:false}}/>
  
  </Stack.Navigator>
}

const ProfleStack = ()=>{
  return <Stack.Navigator screenOptions={{gestureEnabled:true,gestureDirection:'horizontal', cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,}}>
    <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}}/>
    <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{headerShown:false}}/>
  </Stack.Navigator>
}
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Assign icons for each route
          if (route.name === "Explore") {
            iconName = "compass";
          }  else if (route.name === "Profile") {
            iconName = "person";
          }

          // Return an Ionicons component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#34b7b5",
        tabBarInactiveTintColor: "#27a8d0",
        headerShown: false, // Hide header for tab screens
      })}
    >
      <Tab.Screen name="Explore" component={ExploreStack} />
     
      <Tab.Screen name="Profile" component={ProfleStack} options={{headerShown:false}}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;

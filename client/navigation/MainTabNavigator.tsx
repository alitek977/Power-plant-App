import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import FeedersStackNavigator from "@/navigation/FeedersStackNavigator";
import TurbinesStackNavigator from "@/navigation/TurbinesStackNavigator";
import CalculationsStackNavigator from "@/navigation/CalculationsStackNavigator";
import ReportsStackNavigator from "@/navigation/ReportsStackNavigator";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import { Colors, Typography } from "@/constants/theme";

export type MainTabParamList = {
  FeedersTab: undefined;
  TurbinesTab: undefined;
  CalculationsTab: undefined;
  ReportsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      initialRouteName="FeedersTab"
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarLabelStyle: {
          fontFamily: Typography.small.fontFamily,
          fontSize: 11,
          fontWeight: "700",
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: Colors.dark.backgroundDefault,
            web: Colors.dark.backgroundDefault,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="FeedersTab"
        component={FeedersStackNavigator}
        options={{
          title: t("tab_feeders"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="activity" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TurbinesTab"
        component={TurbinesStackNavigator}
        options={{
          title: t("tab_turbines"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="wind" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CalculationsTab"
        component={CalculationsStackNavigator}
        options={{
          title: t("tab_calculations"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="cpu" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsStackNavigator}
        options={{
          title: t("tab_reports"),
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

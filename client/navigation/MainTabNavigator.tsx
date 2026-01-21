import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, I18nManager } from "react-native";
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

type TabConfig = {
  name: keyof MainTabParamList;
  component: React.ComponentType<object>;
  titleKey: "tab_feeders" | "tab_turbines" | "tab_calculations" | "tab_reports";
  iconName: "activity" | "wind" | "cpu" | "file-text";
};

const TAB_SCREENS: TabConfig[] = [
  { name: "FeedersTab", component: FeedersStackNavigator, titleKey: "tab_feeders", iconName: "activity" },
  { name: "TurbinesTab", component: TurbinesStackNavigator, titleKey: "tab_turbines", iconName: "wind" },
  { name: "CalculationsTab", component: CalculationsStackNavigator, titleKey: "tab_calculations", iconName: "cpu" },
  { name: "ReportsTab", component: ReportsStackNavigator, titleKey: "tab_reports", iconName: "file-text" },
];

export default function MainTabNavigator() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const screens = I18nManager.isRTL ? [...TAB_SCREENS].reverse() : TAB_SCREENS;

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
          writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
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
          flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
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
      {screens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            title: t(screen.titleKey),
            tabBarIcon: ({ color, size }) => (
              <Feather name={screen.iconName} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

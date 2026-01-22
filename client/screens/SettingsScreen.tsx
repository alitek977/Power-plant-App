import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import Constants from "expo-constants";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRTL } from "@/hooks/useRTL";
import { Language } from "@/lib/i18n";

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

export default function SettingsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const layout = useResponsiveLayout();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { rtlRow, rtlText } = useRTL();

  const appVersion = Constants.expoConfig?.version || "1.0.0";

  const handleSelectLanguage = (lang: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLanguage(lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: layout.horizontalPadding,
          maxWidth: layout.isTablet ? layout.contentMaxWidth : undefined,
          alignSelf: layout.isTablet ? "center" : undefined,
          width: layout.isTablet ? "100%" : undefined,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(300)}>
          <ThemedText type="h3" style={[styles.sectionTitle, rtlText]}>
            {t("language")}
          </ThemedText>

          <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.cardHeader, rtlRow, { borderBottomColor: theme.border }]}>
              <View style={[rtlRow, { alignItems: "center" }]}>
                <View style={[styles.iconCircle, { backgroundColor: theme.primary + "20" }]}>
                  <Feather name="globe" size={20} color={theme.primary} />
                </View>
                <View style={{ marginHorizontal: Spacing.md }}>
                  <ThemedText type="body" style={[{ fontFamily: Typography.h4.fontFamily }, rtlText]}>
                    {t("language")}
                  </ThemedText>
                  <ThemedText type="small" style={[{ color: theme.textSecondary }, rtlText]}>
                    {t("select_language")}
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.languageOptions}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    { borderColor: language === lang.code ? theme.primary : theme.border },
                    language === lang.code && { backgroundColor: theme.primary + "15" },
                  ]}
                  onPress={() => handleSelectLanguage(lang.code)}
                  testID={`button-language-${lang.code}`}
                >
                  <View style={[rtlRow, { alignItems: "center", justifyContent: "space-between" }]}>
                    <View>
                      <ThemedText type="body" style={[{ fontWeight: "600" }, rtlText]}>
                        {lang.nativeName}
                      </ThemedText>
                      <ThemedText type="small" style={[{ color: theme.textSecondary }, rtlText]}>
                        {lang.name}
                      </ThemedText>
                    </View>
                    {language === lang.code ? (
                      <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
                        <Feather name="check" size={16} color="#fff" />
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <ThemedText type="h3" style={[styles.sectionTitle, rtlText]}>
            {t("about")}
          </ThemedText>

          <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.aboutRow, rtlRow, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primary + "20" }]}>
                <Feather name="zap" size={20} color={theme.primary} />
              </View>
              <View style={{ marginHorizontal: Spacing.md, flex: 1 }}>
                <ThemedText type="body" style={[{ fontFamily: Typography.h4.fontFamily }, rtlText]}>
                  {t("app_name")}
                </ThemedText>
                <ThemedText type="small" style={[{ color: theme.textSecondary }, rtlText]}>
                  {t("version_label")}{" "}
                  <ThemedText type="small" style={{ color: theme.textSecondary, writingDirection: "ltr" }}>
                    {appVersion}
                  </ThemedText>
                </ThemedText>
              </View>
            </View>

            <View style={[styles.aboutRow, rtlRow, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
              <View style={[styles.iconCircle, { backgroundColor: theme.success + "20" }]}>
                <Feather name="user" size={20} color={theme.success} />
              </View>
              <View style={{ marginHorizontal: Spacing.md, flex: 1 }}>
                <ThemedText type="body" style={[{ fontFamily: Typography.h4.fontFamily }, rtlText]}>
                  {t("developer")}
                </ThemedText>
                <ThemedText type="small" style={[{ color: theme.textSecondary }, rtlText]}>
                  {t("developer_name")}
                </ThemedText>
              </View>
            </View>

            <View style={[styles.aboutRow, rtlRow]}>
              <View style={[styles.iconCircle, { backgroundColor: theme.warning + "20" }]}>
                <Feather name="shield" size={20} color={theme.warning} />
              </View>
              <View style={{ marginHorizontal: Spacing.md, flex: 1 }}>
                <ThemedText type="body" style={[{ fontFamily: Typography.h4.fontFamily }, rtlText]}>
                  {t("copyright")}
                </ThemedText>
                <ThemedText type="small" style={[{ color: theme.textSecondary }, rtlText]}>
                  {t("copyright_text")}
                </ThemedText>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center", writingDirection: "ltr" }}>
            {t("version")}
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  card: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  languageOptions: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  languageOption: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  footer: {
    marginTop: Spacing.xl,
    alignItems: "center",
    paddingBottom: Spacing.xl,
  },
});

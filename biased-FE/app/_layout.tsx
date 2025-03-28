import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { ErrorBoundary } from "./error-boundary";

export const unstable_settings = {
  // Ensure that reloading on `/modal keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore errors
});

export default function RootLayout() {
  try {
    console.log("App starting...");

    const [loaded, error] = useFonts({
      ...FontAwesome.font,
    });

    useEffect(() => {
      if (error) {
        console.error("Font loading error:", error);
      }
    }, [error]);

    useEffect(() => {
      if (loaded) {
        SplashScreen.hideAsync().catch(console.error);
      }
    }, [loaded]);

    if (!loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <ErrorBoundary>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Fatal app error:", error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Something went wrong. Please restart the app.</Text>
      </View>
    );
  }
}

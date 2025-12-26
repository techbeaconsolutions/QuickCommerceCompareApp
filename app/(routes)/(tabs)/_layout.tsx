// import { Ionicons } from "@expo/vector-icons";
// import {
//     DarkTheme as NavigationDarkTheme,
//     DefaultTheme as NavigationLightTheme,
//     ThemeProvider as NavigationThemeProvider,
// } from "@react-navigation/native";
// import { Tabs } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import React, { useEffect } from "react";
// import { Dimensions, View } from "react-native";
// import { RFValue } from "react-native-responsive-fontsize"; // 👈 for responsive font scaling
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { ThemeProvider, useTheme } from "../../context/ThemeContext";

// // 🎨 Themed Tabs using global theme
// function ThemedTabs() {
//   const { mode } = useTheme();
//   const isDark = mode === "dark";
//   const insets = useSafeAreaInsets();
//   const { width, height } = Dimensions.get("window");

  

//   // 🌗 Custom navigation theme
//   const navigationTheme = isDark
//     ? {
//       ...NavigationDarkTheme,
//       colors: {
//         ...NavigationDarkTheme.colors,
//         background: "#121212",
//         card: "#1e1e1e",
//         text: "#fff",
//         border: "#222",
//         primary: "#0cc6e9",
//       },
//     }
//     : {
//       ...NavigationLightTheme,
//       colors: {
//         ...NavigationLightTheme.colors,
//         background: "#f9fcff",
//         card: "#ffffff",
//         text: "#111",
//         border: "#ddd",
//         primary: "#0871da",
//       },
//     };

//   return (
//     <NavigationThemeProvider value={navigationTheme}>
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: navigationTheme.colors.background,
//           paddingBottom: insets.bottom,
//         }}
//       >
//         <StatusBar style={isDark ? "light" : "dark"} />

//         <Tabs
//           key={mode} // 👈 re-render tabs when theme changes
//           screenOptions={{
//             headerShown: false,
//             tabBarShowLabel: true,
//             tabBarStyle: {
//               backgroundColor: navigationTheme.colors.card,
//               height: 60,
//               borderTopWidth: 0,
//               elevation: 10,
//               boxShadowColor: "#000",
//               boxShadowOpacity: 0.1,
//               boxShadowRadius: 4,
//               boxShadowOffset: { width: 0, height: -2 },
//               paddingBottom: 6,
//               paddingTop: 6,
//             },


//             tabBarActiveTintColor: navigationTheme.colors.primary,
//             tabBarInactiveTintColor: isDark ? "#aaa" : "#666",
//             tabBarLabelStyle: {
//               fontSize: RFValue(11), // ✅ scales with screen size
//               fontWeight: "600",
//               marginBottom: 4,
//             },
//             tabBarIconStyle: {
//               marginBottom: -4,
//             },
//           }}
//         >
//           {/* 🏠 HOME */}
//           <Tabs.Screen
//             name="home"
//             options={{
//               title: "Home",
//               tabBarIcon: ({ color, focused }) => (
//                 <Ionicons
//                   name={focused ? "home" : "home-outline"}
//                   size={26}
//                   color={color}
//                 />
//               ),
//             }}
//           />

//           {/* 👤 PROFILE */}
//           <Tabs.Screen
//             name="profile"
//             options={{
//               title: "Profile",
//               tabBarIcon: ({ color, focused }) => (
//                 <Ionicons
//                   name={focused ? "person" : "person-outline"}
//                   size={26}
//                   color={color}
//                 />
//               ),
//             }}
//           />
//         </Tabs>
//       </View>
//     </NavigationThemeProvider>
//   );
// }

// // 🌍 Wrap your ThemedTabs in the global ThemeProvider
// export default function RootLayout() {
//   return (
//     <ThemeProvider>
//       <ThemedTabs />
//     </ThemeProvider>
//   );
// }





import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationLightTheme,
    ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../../../context/ThemeContext";
import LoginScreen from "../../auth/login"; // ✅ make sure this path is correct

// =========================
// 🎨 THEMED TABS COMPONENT
// =========================
function ThemedTabs() {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const insets = useSafeAreaInsets();

  const navigationTheme = isDark
    ? {
        ...NavigationDarkTheme,
        colors: {
          ...NavigationDarkTheme.colors,
          background: "#121212",
          card: "#1e1e1e",
          text: "#fff",
          border: "#222",
          primary: "#0cc6e9",
        },
      }
    : {
        ...NavigationLightTheme,
        colors: {
          ...NavigationLightTheme.colors,
          background: "#f9fcff",
          card: "#ffffff",
          text: "#111",
          border: "#ddd",
          primary: "#0871da",
        },
      };

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <View
        style={{
          flex: 1,
          backgroundColor: navigationTheme.colors.background,
          paddingBottom: insets.bottom,
        }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />

        <Tabs
          key={mode}
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: {
              backgroundColor: navigationTheme.colors.card,
              height: 60,
              borderTopWidth: 0,
              elevation: 0,
              paddingBottom: 6,
              paddingTop: 6,
            },
            tabBarActiveTintColor: navigationTheme.colors.primary,
            tabBarInactiveTintColor: isDark ? "#aaa" : "#666",
            tabBarLabelStyle: {
              fontSize: RFValue(11),
              fontWeight: "600",
              marginBottom: 4,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={26}
                  color={color}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={26}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </NavigationThemeProvider>
  );
}

// ==================================================
// 🌍 ROOT LAYOUT WITH AUTH CHECK (IMPORTANT FIX)
// ==================================================
export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setAuthenticated(!!token);
      setLoading(false);
    };
    checkToken();
  }, []);

  // 🔄 Loading screen while checking token
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0871da" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      {authenticated ? <ThemedTabs /> : <LoginScreen />}
    </ThemeProvider>
  );
}

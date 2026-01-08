import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter, Href } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../src/context/AuthContext";

export default function Splash() {
    const router = useRouter();
    const { colors } = useTheme();
    const { token, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(async () => {
                await SplashScreen.hideAsync(); // ✅ NOW valid

                if (token) {
                    router.replace("/(tabs)/home" as Href);
                } else {
                    router.replace("/onboarding" as Href);
                }
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [token, loading]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Image
                source={require("../assets/images/app_logo.png")}
                style={styles.logo}
            />
            <Text style={[styles.title, { color: colors.text }]}>
                QuickCommerce
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
                Compare. Save. Repeat.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    logo: { width: 100, height: 100, marginBottom: 16 },
    title: { fontSize: 28, fontWeight: "bold" },
    subtitle: { fontSize: 16, opacity: 0.7 },
});

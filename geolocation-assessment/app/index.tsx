import { styles } from "@/assets/styles/auth.styles";
import { useNotification } from "@/hooks/useNotification";
import { getToken } from "@/store/store";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

export default function Landing() {
  const router = useRouter();
  const { notification, showError } = useNotification();
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (!token) {
        showError("No token found. Please login");
        router.replace("/login");
        return;
      }

      const isExpired = isTokenExpired(token);

      if (isExpired) {
        showError("Token expired. Please login again");
        router.replace("/login");
        return;
      } else {
        router.replace("/(main)");
      }
    };
    checkToken();
  }, []);

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime + 60;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.authHeaderContainer}>
        <Text style={styles.authHeaderSubtitle}>Welcome to</Text>
        <Text style={styles.authHeaderTitle}>Geolocation</Text>
      </View>

      <View style={{ gap: 8 }}>
        <TouchableOpacity
          onPress={() => {
            router.push("/login");
          }}
          style={[
            styles.authButton,
            {
              paddingVertical: 10,
            },
          ]}
        >
          <Text style={{ textAlign: "center" }}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push("/register");
          }}
          style={[
            styles.authButton,
            {
              paddingVertical: 10,
            },
          ]}
        >
          <Text style={{ textAlign: "center" }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

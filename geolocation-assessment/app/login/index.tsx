import Input from "@/assets/components/Input";
import Notification from "@/assets/components/notifications";
import { styles } from "@/assets/styles/auth.styles";
import { loginCredsType } from "@/assets/types/loginCreds";
import { loginSchema } from "@/assets/types/schema";
import { API_CONFIG, getApiUrl } from "@/config/api";
import { useNotification } from "@/hooks/useNotification";
import { setToken } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import z from "zod";
// import { TextInput } from "react-native-gesture-handler";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<loginCredsType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const {
    notification,
    showError,
    showSuccess,
    showWarning,
    hideNotification,
  } = useNotification();

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(userInfo);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setErrors({});

    const url = getApiUrl(API_CONFIG.ENDPOINTS.LOGIN);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });

    const data = await res.json();

    if (!res.ok) {
      let errorMessage = "Something went wrong. Please try again";
      if (res.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (res.status === 400) {
        errorMessage = "Invalid request";
      } else if (res.status === 404) {
        errorMessage = "User not found";
      }
      setErrors({ general: errorMessage });
      showError(errorMessage);
      return;
    }

    if (data.token) {
      await AsyncStorage.setItem("token", data.token);
      setToken(data.token);
      console.log("Token stored successfully");
    }
    router.replace("/(main)");
  };
  return (
    <KeyboardAvoidingView
      style={[
        styles.mainContainer,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          gap: 50,
          backgroundColor: "#F2F2F2",
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onDismiss={hideNotification}
        duration={5000}
      />
      <View style={styles.authHeaderContainer}>
        <Text style={styles.authHeaderTitle}>Login</Text>
        <Text style={styles.authHeaderSubtitle}>to Geolocation finder</Text>
      </View>

      <View style={{ gap: 20 }}>
        <Input
          ref={emailRef}
          label="Email"
          placeholder="e.g. johndoe@gmail.com"
          value={userInfo.email}
          onChangeText={(text) =>
            setUserInfo((prev) => ({ ...prev, email: text }))
          }
          error={errors.email}
          autoCapitalize="words"
          returnType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <Input
          ref={passwordRef}
          label="Password"
          placeholder="********"
          value={userInfo.password}
          onChangeText={(text) =>
            setUserInfo((prev) => ({ ...prev, password: text }))
          }
          isPassword={true}
          error={errors.password}
          returnType="go"
        />
      </View>
      <View style={{ gap: 20 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 13 }}>Don't have an account yet? </Text>
          <Text
            style={{
              color: "#007AFF",
              textDecorationLine: "underline",
              fontSize: 13,
            }}
            onPress={() => {
              router.replace("/register");
            }}
          >
            Register here
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            width: "100%",
            backgroundColor: "#f14863",
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              paddingVertical: 10,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

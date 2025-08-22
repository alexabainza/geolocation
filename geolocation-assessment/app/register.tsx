import Input from "@/assets/components/Input";
import Notification from "@/assets/components/notifications";
import { styles } from "@/assets/styles/auth.styles";
import { registerCredsType } from "@/assets/types/loginCreds";
import { registerSchema } from "@/assets/types/schema";
import { API_CONFIG, getApiUrl } from "@/config/api";
import { useNotification } from "@/hooks/useNotification";
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

export default function Register() {
  const insets = useSafeAreaInsets();
  const [userInfo, setUserInfo] = useState<registerCredsType>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const emailRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    notification,
    showError,
    showSuccess,
    showWarning,
    hideNotification,
  } = useNotification();

  const router = useRouter();
  const validateForm = (): boolean => {
    try {
      registerSchema.parse(userInfo);
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
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const url = getApiUrl(API_CONFIG.ENDPOINTS.REGISTER);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });
    if (!res.ok) {
      // transfer to enum
      let errorMessage = "Something went wrong. Please try again";
      if (res.status === 409) {
        errorMessage = "User with that email already exists";
      } else if (res.status === 400) {
        errorMessage = "Invalid request";
      } else if (res.status === 404) {
        errorMessage = "User not found";
      }
      setErrors({ general: errorMessage });
      showError(errorMessage);
      setLoading(false);
      return;
    }
    showSuccess("Registration successful");
    setLoading(false);

    setTimeout(() => {
      router.replace("/login");
    }, 1000);
  };
  return (
    <KeyboardAvoidingView
      style={[
        styles.mainContainer,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          gap: 30,
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
        <Text style={styles.authHeaderTitle}>Register</Text>
        <Text style={styles.authHeaderSubtitle}>to Geolocation finder</Text>
      </View>

      <View style={{ gap: 10 }}>
        <Input
          ref={usernameRef}
          label="Username"
          placeholder="e.g. john"
          value={userInfo.username}
          onChangeText={(text) =>
            setUserInfo((prev) => ({ ...prev, username: text }))
          }
          error={errors.username}
          returnType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
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
          returnType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        />
        <Input
          ref={confirmPasswordRef}
          label="Password"
          placeholder="********"
          value={userInfo.confirmPassword}
          onChangeText={(text) =>
            setUserInfo((prev) => ({ ...prev, confirmPassword: text }))
          }
          isPassword={true}
          error={errors.confirmPassword}
          returnType="go"
        />
      </View>

      <View style={{ gap: 10 }}>
        <View style={styles.footerContainer}>
          <Text>Already have an account? Login </Text>
          <Text
            style={styles.navFooterText}
            onPress={() => {
              router.replace("/login");
            }}
          >
            here
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleRegister} style={styles.authButton}>
        <Text style={styles.authButtonText}>
          {loading ? "Loading" : "Register"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

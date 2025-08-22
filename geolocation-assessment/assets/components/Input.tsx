import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  isPassword?: boolean;
  error?: string;
  mainStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  returnType?: "default" | "done" | "go" | "next" | "search" | "send";
}
const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      isPassword = false,
      error,
      mainStyle,
      inputContainerStyle,
      labelStyle,
      inputStyle,
      errorStyle,
      onFocus,
      onBlur,
      returnType = "default",
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
      <View style={[styles.container, mainStyle]}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

        <View
          style={[
            styles.inputContainer,
            // isFocused && styles.inputContainerFocused,
            error && styles.inputContainerError,
            inputContainerStyle,
          ]}
        >
          <TextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            secureTextEntry={isPassword && !isPasswordVisible}
            returnKeyType={returnType}
            {...props}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  inputContainerError: {
    borderColor: "#FF3B30",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    // marginTop: 6,
    marginLeft: 4,
  },
});

export default Input;

import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NotificationProps {
  visible: boolean;
  message: string;
  type?: "error" | "success" | "warning" | "info";
  duration?: number;
  onDismiss?: () => void;
  dismissible?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  visible,
  message,
  type = "error",
  duration = 5000,
  onDismiss,
  dismissible = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0 && onDismiss) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, duration, onDismiss]);

  const getNotificationStyle = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#d4edda",
          borderColor: "#c3e6cb",
          textColor: "#155724",
        };
      case "warning":
        return {
          backgroundColor: "#fff3cd",
          borderColor: "#ffeaa7",
          textColor: "#856404",
        };
      case "info":
        return {
          backgroundColor: "#d1ecf1",
          borderColor: "#bee5eb",
          textColor: "#0c5460",
        };
      case "error":
      default:
        return {
          backgroundColor: "#f8d7da",
          borderColor: "#f5c6cb",
          textColor: "#721c24",
        };
    }
  };

  const notificationStyle = getNotificationStyle();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.notification,
          {
            backgroundColor: notificationStyle.backgroundColor,
            borderColor: notificationStyle.borderColor,
          },
        ]}
      >
        <Text style={[styles.message, { color: notificationStyle.textColor }]}>
          {message}
        </Text>
        {dismissible && (
          <TouchableOpacity
            onPress={handleDismiss}
            style={styles.dismissButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={[
                styles.dismissText,
                { color: notificationStyle.textColor },
              ]}
            >
              ×
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  notification: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
  },
  dismissButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  dismissText: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
  },
});

export default Notification;

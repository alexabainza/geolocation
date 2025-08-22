import { clearAuthData } from "@/utils/helper/auth.helper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
export default function MainLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                clearAuthData(router);
              }}
            >
              <MaterialIcons name="logout" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}

// import { styles } from "@/assets/styles/common";
import { useEffect, useReducer, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  clearCurrentSearchItem,
  getCurrentSearchItem,
} from "../../store/store";
export default function locationPage() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState({});
  const [state, dispatch] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case "SET_DATA":
          return { data: action.payload };
        default:
          return state;
      }
    },
    { data: null }
  );
  useEffect(() => {
    const data = getCurrentSearchItem();
    setLocation(data);
    dispatch({ type: "SET_DATA", payload: data });

    return () => {
      clearCurrentSearchItem();
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: "flex-start",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Text>IP: {state.data?.ip_searched}</Text>
      <Text>City: {state.data?.locationData.hostname}</Text>
      <View
        style={{
          height: "50%",
          borderColor: "black",
          borderWidth: 2,
        }}
      >
        <Text>this is for the map</Text>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        ></MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  coordinatesContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  coordinatesText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  errorContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 0, 0, 0.9)",
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});

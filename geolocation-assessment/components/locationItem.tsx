import { setCurrentSearchItem } from "@/store/store";
import { SearchItem } from "@/types/searchTypes";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter, useSegments } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
interface LocationItemProps {
  locationData: SearchItem;
  isEditMode?: boolean;
  isSelected?: boolean;
  onSelect?: (itemId: string) => void;
  onItemPress?: (item: SearchItem) => void;
  onDelete?: (itemId: string) => void;
}
const LocationItem: React.FC<LocationItemProps> = ({
  locationData,
  isEditMode = false,
  isSelected = false,
  onSelect,
  onItemPress,
  onDelete,
}) => {
  const segments = useSegments();
  const navigation = useNavigation();
  const router = useRouter();

  const handleDelete = () => {
    if (onDelete && locationData._id) {
      onDelete(locationData._id);
    }
  };

  const handlePress = () => {
    if (isEditMode && onSelect && locationData._id) {
      onSelect(locationData?._id);
    } else if (!isEditMode && locationData._id) {
      if (onItemPress) {
        onItemPress(locationData);
      }
      setCurrentSearchItem(locationData);
      // router.push(`/(main)/${locationData._id}`);
    }
  };
  return (
    <TouchableOpacity
      style={{
        // borderColor: "#D4D7DA",
        borderBottomColor: "gray",
        borderBottomWidth: 0.8,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isSelected ? "#f0f8ff" : "transparent",
      }}
      onPress={handlePress}
    >
      {isEditMode && (
        <View style={{ marginRight: 10 }}>
          <FontAwesome
            name={isSelected ? "check-square" : "square-o"}
            size={20}
            color={isSelected ? "blue" : "gray"}
          />
        </View>
      )}

      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{}}>{locationData.ip_searched}</Text>
        {!isEditMode && (
          <TouchableOpacity onPress={handleDelete}>
            <Text style={{ color: "gray" }}>✖</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LocationItem;

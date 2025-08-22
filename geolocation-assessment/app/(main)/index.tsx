import Input from "@/assets/components/Input";
import Notification from "@/assets/components/notifications";
import { stylesCommon } from "@/assets/styles/common.styles";
import LocationItem from "@/components/locationItem";
import { API_CONFIG, getApiUrl } from "@/config/api";
import { useNotification } from "@/hooks/useNotification";
import { getToken, getUserHistory, getUserIP } from "@/store/store";
import { SearchItem, SearchResult } from "@/types/searchTypes";
import { formatCoordinates } from "@/utils/formatter";
import {
  fetchUserSearches,
  getMyIP,
  getSearchItems,
  saveToDatabase,
} from "@/utils/helper/search.helper";
import { isValidIPv4 } from "@/utils/validation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [ipAddress, setIpAddress] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [isEditClicked, setIsEditClicked] = useState<boolean>(false);
  const [myLocation, setMyLocation] = useState<SearchResult | null>(null);
  const [token, setToken] = useState<string>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const { notification, showError, hideNotification } = useNotification();
  const handleItemClicked = (itemId: string) => {
    setSelectedItems((prev) => {
      let newSelection;
      if (prev.includes(itemId)) {
        newSelection = prev.filter((id) => id !== itemId);
      } else {
        newSelection = [...prev, itemId];
      }
      setSelectAll(newSelection.length === items.length);

      return newSelection;
    });
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectAll(true);

      const allItemIds = items
        .map((item) => item._id)
        .filter((id) => id !== undefined) as string[];
      setSelectedItems(allItemIds);
    }
  };
  const handleDeleteItem = async (itemId: string) => {
    const deletedItem = items.find((item) => item._id === itemId);
    if (
      deletedItem &&
      searchResult &&
      searchResult.ip === deletedItem.ip_searched
    ) {
      setSearchResult(null);
      setIpAddress("");
    }
    await deleteItems([itemId]);
  };
  const deleteItems = async (itemsToDelete?: string[]) => {
    try {
      const idsToDelete = itemsToDelete || selectedItems;
      const url = getApiUrl(API_CONFIG.ENDPOINTS.SEARCH);
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ search_item_ids: idsToDelete }),
      });
      const data = await res.json();

      if (!res.ok) {
        showError("Error deleting items");
      } else {
        showError("Deleted successfully!");

        const searchItems = await getSearchItems();
        setItems(searchItems.searches);
        setSelectedItems([]);
        setSelectAll(false);
      }
    } catch (error) {
      showError("Error deleting items. Please  try again later.");
    }
  };
  const handleHistoryItemPress = (item: SearchItem) => {
    const searchResultFromHistory = {
      city: item.locationData.city,
      country: item.locationData.country,
      ip: item.ip_searched,
      org: item.locationData.organization,
      postal: item.locationData.postal,
      region: item.locationData.region,
      timezone: item.locationData.timezone,
      locationData: {
        latitude: item.locationData.location.latitude,
        longitude: item.locationData.location.longitude,
      },
    };

    setSearchResult(searchResultFromHistory);
    setIpAddress(item.ip_searched);
    setItems((prevItems) => {
      const filteredItems = prevItems.filter(
        (historyItem) => historyItem._id !== item._id
      );
      return [item, ...filteredItems];
    });
  };

  const toggleEdit = () => {
    setIsEditClicked(!isEditClicked);
    setSelectedItems([]);
    setSelectAll(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const tokenRetrieved = await getToken();
        if (tokenRetrieved) {
          setToken(tokenRetrieved);
        } else {
          showError("No token found");
        }

        setLoading(true);
        await getMyIP();
        const userLocationInfo = getUserIP();
        await fetchUserSearches();
        const userHistory = getUserHistory();
        setMyLocation(userLocationInfo);
        setItems(userHistory.searches);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  async function getLocation(ip: string) {
    try {
      if (!isValidIPv4(ip)) {
        showError("Invalid IP address");
        return;
      }

      const url = `https://ipinfo.io/${ip}/json`;
      const res = await fetch(url);
      const data = await res.json();
      // THIS IS FOR WHEN I PUT NA IN THE DB
      if (data) {
        const coordinates = formatCoordinates(data.loc || "");
        const formattedResult = {
          ip_searched: ip,
          locationData: {
            organization: data.org || "",
            ip: data.ip || ip,
            city: data.city || "",
            country: data.country || "",
            hostname: data.hostname || "",
            postal: data.postal || "",
            region: data.region || "",
            timezone: data.timezone || "",
            anycast: data.anycast || false,
            location: coordinates,
          },
        };
        setSearchResult({
          city: data.city || "",
          country: data.country || "",
          ip: data.ip || ip,
          org: data.org || "",
          postal: data.postal || "",
          region: data.region || "",
          timezone: data.timezone || "",
          locationData: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
        });
        await saveToDatabase(formattedResult);
        // mao ni tung dili mu update ang search history
        await fetchUserSearches();
        const updatedHistory = getUserHistory();
        setItems(updatedHistory.searches);
      } else {
        showError(`No data found for ${ip}`);
        return;
      }
    } catch (error) {
      console.error("error fetching location", error);
    }
  }
  return (
    <View
      style={[
        stylesCommon.mainContainer,
        {
          justifyContent: "flex-start",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          gap: 20,
        },
      ]}
    >
      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onDismiss={hideNotification}
        duration={5000}
      />
      <View
        style={{
          borderColor: "black",
          backgroundColor: "#D2D6DA",
          borderWidth: 0.5,
          borderRadius: 10,
          padding: 20,
          gap: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700", textAlign: "center" }}>
          {searchResult ? "IP Address Data" : "My IP Address Data"}
        </Text>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="gray"
            style={{ marginTop: 10 }}
          />
        ) : (
          myLocation && (
            <View>
              <Text>
                City:{" "}
                <Text style={{ fontWeight: 500 }}>
                  {searchResult ? searchResult?.city : myLocation?.city}
                </Text>
              </Text>
              <Text>
                Country:{" "}
                <Text style={{ fontWeight: 500 }}>
                  {" "}
                  {searchResult ? searchResult?.country : myLocation?.country}
                </Text>
              </Text>
              <Text>
                IP address:{" "}
                <Text style={{ fontWeight: 500 }}>
                  {searchResult ? searchResult?.ip : myLocation?.ip}
                </Text>
              </Text>
              <Text>
                Organization:{" "}
                <Text style={{ fontWeight: 500 }}>
                  {" "}
                  {searchResult ? searchResult?.org : myLocation?.org}
                </Text>
              </Text>
              <Text>
                Region:{" "}
                <Text style={{ fontWeight: 500 }}>
                  {" "}
                  {searchResult ? searchResult?.region : myLocation?.region}
                </Text>
              </Text>
              <Text>
                Coordinates:{" "}
                <Text style={{ fontWeight: 500 }}>
                  {searchResult?.locationData?.latitude ||
                    myLocation?.locationData?.latitude}
                  ,{" "}
                  {searchResult?.locationData?.longitude ||
                    myLocation?.locationData?.longitude}
                </Text>
              </Text>
            </View>
          )
        )}
      </View>
      <View style={{ gap: 5 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 500 }}>Search</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <Input
            placeholder="Input IP address"
            returnType="search"
            mainStyle={{ flex: 1 }}
            value={ipAddress}
            onChangeText={(text) => {
              setIpAddress(text);
              if (text.trim() === "") {
                setSearchResult(null);
              }
            }}
          />

          <TouchableOpacity
            onPress={() => {
              getLocation(ipAddress);
            }}
            style={stylesCommon.buttonIconContainer}
          >
            <FontAwesome name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSearchResult(null);
              setIpAddress("");
            }}
            style={stylesCommon.buttonWordContainer}
          >
            <Text style={{ color: "white" }}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: 500, fontSize: 16 }}>History</Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 12 }}>
          {isEditClicked && selectedItems.length > 0 && (
            <TouchableOpacity
              style={{
                borderRadius: 5,
                height: "100%",

                paddingHorizontal: 10,
              }}
              onPress={() => {
                deleteItems();
              }}
            >
              <Text style={{ color: "red", fontSize: 14, fontWeight: 600 }}>
                Delete
              </Text>
            </TouchableOpacity>
          )}
          {isEditClicked && items.length > 0 && (
            <TouchableOpacity
              style={{
                borderRadius: 5,
                height: "100%",

                paddingHorizontal: 10,
              }}
              onPress={handleSelectAll}
            >
              <Text style={{ color: "#5998D7" }}>
                {selectAll ? "Unselect all" : "Select all"}
              </Text>
            </TouchableOpacity>
          )}
          {!isEditClicked && (
            <TouchableOpacity
              onPress={() => {
                setIsEditClicked(!isEditClicked);
              }}
            >
              <Text style={{ color: "#5998D7", fontSize: 14, fontWeight: 600 }}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
          {isEditClicked && items.length > 0 && (
            <TouchableOpacity onPress={toggleEdit}>
              <Text style={{ color: "#5998D7" }}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView style={{ marginBottom: 20 }}>
        {items.length > 0 &&
          items.map((item, idx) => (
            <LocationItem
              key={item._id}
              locationData={item}
              isEditMode={isEditClicked}
              isSelected={item._id ? selectedItems.includes(item._id) : false}
              onSelect={handleItemClicked}
              onItemPress={handleHistoryItemPress}
              onDelete={handleDeleteItem}
            />
          ))}
      </ScrollView>
    </View>
  );
}

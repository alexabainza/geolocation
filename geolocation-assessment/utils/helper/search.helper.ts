import { API_CONFIG, getApiUrl } from "@/config/api";
import { setUserHistory, setUserIP } from "@/store/store";
import { SearchItem } from "@/types/searchTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatCoordinates } from "../formatter";
export const getSearchItems = async ()=> {
	const url = getApiUrl(API_CONFIG.ENDPOINTS.SEARCH);
    const token = await  AsyncStorage.getItem("token")
    if (!token) {
        throw new Error("No authentication token found");
    }
    
    const res = await fetch(url,{
        method: "GET",
        headers: { "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
         },
    })

     if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
}

export const getMyIP = async ()=>{
    try{
        const response = await fetch("https://ipinfo.io/json");
        const data = await response.json();
        const coordinates = formatCoordinates(data.loc)
            const formattedData = {
        city: data.city || "",
        country: data.country || "",
        ip: data.ip || "",
        org: data.org || "",
        postal: data.postal || "",
        region: data.region || "",
        timezone: data.timezone || "",
        locationData: coordinates
      };

    setUserIP(formattedData);
    }
    catch(error){
        console.log("error", error);
    }
}
export const fetchUserSearches = async () => {
    try {
      const searchItems = await getSearchItems();
      setUserHistory(searchItems)
    } catch (error) {
      console.error("Error fetching searches", error);
    }
  };

export const saveToDatabase = async(dataToSave: SearchItem) => {
    const token = await AsyncStorage.getItem("token")
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.SEARCH);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });
      const data = await res.json();   
    } catch (error) {
      console.log("error saving search item to db", error);
    }
  }
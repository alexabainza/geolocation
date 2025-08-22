import { clearCurrentSearchItem, clearToken, clearUserHistory, clearUserId, clearUserIP } from "@/store/store"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const clearAuthData = async(router:any) => {
    await AsyncStorage.clear()
    clearUserId()
    clearUserIP()
    clearUserHistory()
    clearCurrentSearchItem()
    clearToken()
    router.replace("/login")
    
}
import { API_BASE_URL } from "./environment";

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS:{
        LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    SEARCH: "/api/search/",
}
}

export const getApiUrl = (endpoint: string, params: Record<string, string> ={})=>{
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;
    Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
    });
    return url;
}
import { Platform } from 'react-native';

const DEV_HOST =
  Platform.OS === 'android'
    ? '192.168.254.105'
    : '192.168.254.105';

export const API_BASE_URL =
  __DEV__
    ? `http://${DEV_HOST}:3000`
    : `http://${DEV_HOST}:3000`;

console.log('⟳ Using API base URL:', API_BASE_URL);

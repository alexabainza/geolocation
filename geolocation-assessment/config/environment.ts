//REPLACE WITH YOUR OWN IP ADDRESS
const DEV_HOST ='192.168.1.61'

export const API_BASE_URL =
  __DEV__
    ? `http://${DEV_HOST}:3000`
    : `http://${DEV_HOST}:3000`;

console.log('⟳ Using API base URL:', API_BASE_URL);

let currentSearchItem: any = null;
let currentToken: any=null;
let userIp: any = null;
let userHistory: any = null;
let userId: any = null;

export const setCurrentSearchItem = (item: any) => {
  currentSearchItem = item;
};

export const getCurrentSearchItem = () => {
  return currentSearchItem;
};

export const clearCurrentSearchItem = () => {
  currentSearchItem = null;
};

export const setToken = (item:any)=>{
  currentToken = item;
}

export const getToken = () => {
  return currentToken;
};

export const clearToken = () =>{
  currentToken = null;
}

export const setUserIP = (item:any)=>{
  userIp = item;
}

export const getUserIP = ()=>{
  return userIp
}

export const clearUserIP = ()=>{
  userIp = null
}

export const setUserHistory = (item:any)=>{
  userHistory = item
}

export const getUserHistory = ()=>{
  return userHistory
}

export const clearUserHistory = ()=>{
  userHistory = null
}


export const setUserId = (item:any) =>{
  return userId = item
}
export const getUserId = () =>{
  return userId
}

export const clearUserId = ()=>{
  userId = null
}

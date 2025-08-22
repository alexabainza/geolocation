import { useReducer } from "react";

type SearchState ={
    userInfo: any | null;
    currentSearch: any | null;
    searchList:any;
}
type SearchAction = 
  | { type: 'SET_CURRENT_SEARCH'; payload: any }
  | { type: 'SET_SEARCH_LIST'; payload: any[] }
  | { type: 'SET_USER_INFO'; payload:any}
  | { type: 'CLEAR_CURRENT_SEARCH' };

const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SET_CURRENT_SEARCH':
      return { ...state, currentSearch: action.payload };
    case 'SET_SEARCH_LIST':
      return { ...state, searchList: action.payload };
    case 'CLEAR_CURRENT_SEARCH':
      return { ...state, currentSearch: null };
    default:
      return state;
  }
};
export const useSearchReducer = () => {
  return useReducer(searchReducer, {
    userInfo: null,
    currentSearch: null,
    searchList: []
  });
};
import { StyleSheet } from "react-native";

export const stylesCommon = StyleSheet.create({
    mainContainer:{
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F2F2F2",

  },
  buttonIconContainer:{
    
              backgroundColor: "gray",
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 10,
            
  }
  , 
  buttonWordContainer:{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#5998D7",
                paddingHorizontal: 10,
                borderRadius: 5,
              },
              rowHeaderContainer:{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }
})

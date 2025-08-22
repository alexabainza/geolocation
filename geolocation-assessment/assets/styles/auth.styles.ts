import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer:{
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F2F2F2",

  },
  authHeaderContainer:{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  authHeaderTitle:{
    fontSize: 24,
    fontWeight: 500,
    color:"#f14863"
  },
  authHeaderSubtitle:
  { 
    fontSize: 16,
    color:"gray"
  },
  footerContainer:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  navFooterText:{
    color: "#f14863",
    textDecorationLine: "underline",
    fontWeight: 500
  },
  authButton:{
    width: "100%",
    backgroundColor: "#f14863",
    borderRadius: 10,
  },
  authButtonText:{
    textAlign: "center",
    color: "white",
    paddingVertical: 10,
  }
});
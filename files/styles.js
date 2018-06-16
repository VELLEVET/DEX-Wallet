export const appStyle = {
  maincontainer:{
   flex:1,
   zIndex:1
  },
  container: {
    flex: 1,
    marginTop: 24,
  },
  tabbar: {
    backgroundColor: "#0d2424"
  },
  touch:{
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex:4 
  },
  dim: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor:"black",
    opacity:0.5, 
    zIndex: 3
  },
  modalmain:{
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0, 
    zIndex:2
  },
  modal:{
    position:"absolute",
    bottom:0,
    left:0,
    right:0,
    backgroundColor:"white", 
    padding:20, 
    zIndex:4
  },
  page: {
    flex: 1,
    backgroundColor: "#f9f4eb"
  },
  indicator: {
    backgroundColor: "#ffeb3b"
  },
  label: {
    color: "#fff",
    fontWeight: "bold"
  },
  tabstyle: {
    height: 50,
    width: 100
  },
  toolbar: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3f493b",
    height: 56
  },
  bottom_toolbar: {
    position: "absolute",
    bottom: 0,
    padding: 5,
    borderTopLeftRadius: 10,
    backgroundColor: "#0c110b",
    alignSelf: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    opacity: 0.7
  },
  item: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 8,
    borderBottomWidth: 2,
    borderColor: "#ddd"
  },
};

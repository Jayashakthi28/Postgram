import axios from "axios";

const API = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  let email = "";
  let username = "";
  let userData = {};

  const setUserData = async(temData) => {
    userData = temData;
    let userName=await get("/user");
    userData["username"]=userName.username;
  };

  const setUserName=(temUserName)=>{
    username=temUserName;
    let tem={...userData};
    tem["username"]=temUserName;
    userData=tem;
    axios.defaults.headers.common["username"]=username;
  }

  const setEmail = (temEmail) => {
    email = temEmail;
    setHeader();
  };
  const setHeader = () => {
    axios.defaults.headers.common["email"] = email;
  };
  const getUserData = () => {
    return userData;
  };
  const post = async (endpoint, payload) => {
    let data = await axios.post(`${url}/${endpoint}`, payload);
    data = data["data"];
    return data;
  };
  const get = async (endpoint) => {
    let data = await axios.get(`${url}/${endpoint}`);
    data = data["data"];
    return data;
  };
  const routeJson = {
    "/register": false,
    "/verify": false,
    "/": true,
    "/search": true,
    "/notification": true,
    "/profile": true,
    "/add": true,
  };
  const headerJson = {
    "/": "home",
    "/search": "search",
    "/notification": "notification",
    "/profile": "profile",
    "/add": "add",
  };
  const headerMapper = (val,isNav=false) => {
    if(val==="/register" || val==="/verify"){
      return false;
    }
    if(routeJson[val]===false && !isNav){
      return "home";
    }
    if (headerJson[val]===undefined) {
      val = val.split("/");
      return (val[1] === "profile" && !isNav)?(headerJson["/profile"]):(true); 
    } else if(isNav===false){
      return headerJson[val];
    }
    else{
      return routeJson[val];
    }
  };
  return {
    get,
    post,
    setEmail,
    setUserName,
    setUserData,
    getUserData,
    routeJson,
    headerJson,
    headerMapper,
  };
};

export const api = API();

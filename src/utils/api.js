import axios from "axios";

const API = () => {
  const url = "http://127.0.0.1:5000";
  let email = "";
  let userData = {};

  const setUserData = (temData) => {
    userData = temData;
  };
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
    data=data["data"];
    console.log(data);
    return data;
  };
  const get = async (endpoint) => {
    let data = await axios.get(`${url}/${endpoint}`);
    data=data["data"];
    console.log(data);
    return data;
  };
  return { get, post, setEmail, setUserData, getUserData };
};

export const api = API();

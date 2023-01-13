import { useState } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";
import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import ReactLoading from "react-loading";
import EmailVerify from "./pages/EmailVerify";
import { api } from "./utils/api";
import Registeration from "./pages/Registeration";
import Header from "./components/Header";
import Notification from "./pages/Notification";

function App() {
  const [headerValue, setHeaderValue] = useState("home");
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  // if (isLoading) {
  //   return <ReactLoading color="#ffffff"></ReactLoading>;
  // }
  // if (!isLoading && !isAuthenticated) {
  //   loginWithRedirect();
  // }
  // if (!isLoading && isAuthenticated) {
  //   let userdata = {};
  //   userdata["email"] = user["email"];
  //   userdata["name"] = user["name"];
  //   userdata["email_verified"] = user["email_verified"];
  //   api.setEmail(user["email"]);
  //   api.setUserData(userdata);
  // }
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Header headerValue={headerValue} setHeaderValue={setHeaderValue} />
        }
      >
        <Route index element={<Feed />} />
        <Route path="search" element={<Search />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notification" element={<Notification/>}></Route>
        <Route path="register" element={<Registeration />} />
      </Route>
    </Routes>
  );
}

export default App;

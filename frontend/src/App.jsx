import { useEffect, useState } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import ReactLoading from "react-loading";
import EmailVerify from "./pages/EmailVerify";
import { api } from "./utils/api";
import Registeration from "./pages/Registeration";
import Header from "./components/Header";
import Notification from "./pages/Notification";
import Loading from "./components/Loading";
import Add from "./pages/Add";

function App() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [headerValue, setHeaderValue] = useState(
    api.headerMapper(location.pathname)
  );

  useEffect(() => {
    async function fetchRegister() {
      if (!isLoading && isAuthenticated) {
        if (!api.getUserData()["email_verified"]) {
          navigate("verify");
        }
        let apiResponse = await api.get("/isregister");
        if (api.getUserData()["email_verified"]) {
          if (location.pathname === "/verify") {
            navigate("/");
          }
          if (apiResponse.status === "not registered") {
            navigate("register");
          } else if (
            apiResponse.status === "registered" &&
            location.pathname === "/register"
          ) {
            navigate("/");
          }
        }
      }
    }
    fetchRegister();
  }, [isLoading]);
  useEffect(() => {
    setHeaderValue(api.headerMapper(location.pathname));
  }, [location.pathname]);
  if (isLoading) {
    return <Loading />;
  }
  if (!isLoading && !isAuthenticated) {
    loginWithRedirect();
  }
  if (!isLoading && isAuthenticated) {
    let userdata = {};
    userdata["email"] = user["email"];
    userdata["name"] = user["name"];
    userdata["email_verified"] = user["email_verified"];
    api.setEmail(user["email"]);
    api.setUserData(userdata);
  }
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
        <Route path="profile" element={<Profile />}>
          <Route path=":id" element={<Profile />} />
        </Route>
        <Route path="notification" element={<Notification />} />
        <Route path="register" element={<Registeration />} />
        <Route path="verify" element={<EmailVerify />} />
        <Route path="add" element={<Add />} />
      </Route>
    </Routes>
  );
}

export default App;

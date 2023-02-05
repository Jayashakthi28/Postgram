import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

export default function Header({ headerValue, setHeaderValue }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNav,setIsNav] = useState(false);
  useEffect(()=>{
   setIsNav(api.headerMapper(location.pathname, "nav"));
  },[location.pathname]);
  return (
    <>
      <div className=" backdrop-blur-md bg-purple-300">
        <Typography
          variant="h4"
          component="h2"
          fontSize="3rem"
          fontWeight="800"
          className=" text-center p-3"
        >
          PostGram!
        </Typography>
        {isNav && (
          <Tabs
            value={headerValue}
            centered
            indicatorColor="secondary"
            textColor="secondary"
          >
            <Tab
              value="home"
              icon={<HomeIcon fontSize="large" className=" text-black" />}
              onClick={() => {
                setHeaderValue("home");
                navigate("/");
              }}
            />
            <Tab
              value="search"
              icon={<SearchIcon fontSize="large" className=" text-black" />}
              onClick={() => {
                setHeaderValue("search");
                navigate("/search");
              }}
            />
            <Tab
              value="add"
              icon={<AddBoxIcon fontSize="large" className=" text-black" />}
              onClick={() => {
                setHeaderValue("add");
                navigate("/add");
              }}
            />
            <Tab
              value="notification"
              icon={
                <NotificationsIcon fontSize="large" className=" text-black" />
              }
              onClick={() => {
                setHeaderValue("notification");
                navigate("/notification");
              }}
            />
            <Tab
              value="profile"
              icon={<PersonIcon fontSize="large" className=" text-black" />}
              onClick={() => {
                setHeaderValue("profile");
                navigate("/profile");
              }}
            />
          </Tabs>
        )}
      </div>
      <Outlet />
    </>
  );
}

import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header({ headerValue, setHeaderValue }) {
  const navigate = useNavigate();

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
        <Tabs value={headerValue} centered>
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
      </div>
      <Outlet />
    </>
  );
}

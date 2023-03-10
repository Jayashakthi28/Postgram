import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Badge from '@mui/material/Badge';
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useQuery } from "react-query";

export default function Header({ headerValue, setHeaderValue }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNav,setIsNav] = useState(false);
  useEffect(()=>{
   setIsNav(api.headerMapper(location.pathname, "nav"));
  },[location.pathname]);
  const notification=useQuery(["notificationBadge"],()=>{
    return api.get("/notification/update")
  },{refetchInterval:5000,refetchIntervalInBackground:5000});
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
            indicatorColor="secondary"
            textColor="secondary"
            scrollButtons="auto"
            centered={window.innerWidth>=500}
            variant={(window.innerWidth<500)?"scrollable":"standard"}
            allowScrollButtonsMobile
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
              onClick={() => {
                setHeaderValue("notification");
                navigate("/notification");
              }}
              label={
                <Badge color="secondary" badgeContent={(!notification.isLoading&&+notification.data?.unread)}>
                <NotificationsIcon fontSize="large" className=" text-black"/>
              </Badge>
              }
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

import { Avatar, Typography, Button } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { api } from "../utils/api";
import { useQuery } from "react-query";
import Loading from "../components/Loading";

export default function Profile() {
  const { id } = useParams();
  const stringToColor = (string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };
  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 120,
        height: 120,
        fontSize: "4rem",
        fontWeight: "700",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };
  const getProfileData = async () => {
    let userData = {};
    if (id === undefined) {
      userData = await api.get("/user");
    } else {
      userData = await api.get(`/user/${id}`);
    }
    return userData;
  };

  const profileData =
    id === undefined
      ? useQuery("profile", getProfileData)
      : useQuery(["profile", id], getProfileData);
  return (
    <>
      {profileData.isLoading ? (
        <Loading />
      ) : (
        <div className=" p-1 bg-gray-100 h-[calc(100vh-142px)]">
          <div className=" flex w-[500px] mt-5 mx-auto shadow-card hover:shadow-hover transition-all rounded-md p-5 justify-center items-center">
            <Avatar {...stringAvatar(profileData.data.name)} />
            <div className="flex flex-col mx-6">
              <div className=" flex flex-col">
                <Typography component="h2" variant="h4" fontWeight="600">
                  {profileData.data.name}
                </Typography>
                <Typography component="h2" variant="h6" fontWeight="500">
                  @{profileData.data.username}
                </Typography>
              </div>
              <div className="flex w-full justify-items-start mt-4">
                <Typography
                  component="h2"
                  variant="h5"
                  fontWeight="600"
                  sx={{ marginRight: "5px" }}
                >
                  {profileData.data.tags} Tags
                </Typography>
                <Typography
                  component="h2"
                  variant="h5"
                  fontWeight="600"
                  sx={{ margin: "0px 5px" }}
                >
                  {profileData.data.following} Following
                </Typography>
                <Typography
                  component="h2"
                  variant="h5"
                  fontWeight="600"
                  sx={{ margin: "0px 5px" }}
                >
                  {profileData.data.followers} Followers
                </Typography>
              </div>
              {profileData.data.isFollowing === false ? (
                <Button
                  variant="contained"
                  sx={{
                    marginTop: "10px",
                    backgroundColor: "#a72ef8",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Follow
                </Button>
              ) : profileData.data.isFollowing === true ? (
                <Button
                  variant="contained"
                  sx={{
                    marginTop: "10px",
                    backgroundColor: "#a72ef8",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  UnFollow
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    marginTop: "10px",
                    border: "1px solid #a72ef8",
                    color: "#a72ef8",
                    fontWeight: "600",
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          <div></div>
        </div>
      )}
    </>
  );
}

import { Avatar, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
export default function UserCard({
  username,
  name,
  isFollowing,
  setBoxStatus=null,
  mutator,
}) {
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
        width: "50px",
        height: "50px",
        fontSize: "1.2rem",
        fontWeight: "700",
      },
      children: `${name.split(" ")[0][0]}${
        name.split(" ").length === 1
          ? name.split(" ")[0][1]
          : name.split(" ")[1][0]
      }`,
    };
  };
  const navigate = useNavigate();
  const [disabler, setDisabler] = useState(false);
  const queryClient=useQueryClient();
  useEffect(()=>{
    setDisabler(false);
  },[isFollowing]);
  return (
    <div className=" flex items-center my-2 shadow-card p-2 px-5 max-w-[500px] mx-auto rounded-lg hover:shadow-hover transition-shadow ease-linear delay-100">
      <Avatar {...stringAvatar(name)} />
      <div
        className="flex flex-col items-start justify-center mx-3 overflow-hidden cursor-pointer"
        onClick={(e) => {
          if(setBoxStatus){
            setBoxStatus(false);
          }
          navigate(`/profile/${username}`);
        }}
      >
        <Typography variant="h4" component="h4" sx={{"whiteSpace":"nowrap"}}>
          {name}
        </Typography>
        <Typography variant="h9" component="h6" sx={{"whiteSpace":"nowrap"}}>
          @{username}
        </Typography>
      </div>
      {isFollowing ? (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f82e9d",
            color: "white",
            fontWeight: "600",
            width:"80px",
            marginLeft:"auto"
          }}
          disabled={disabler}
          onClick={() => {
            setDisabler(true);
            queryClient.resetQueries('feed');
            mutator.mutateAsync({ isFollow: false, username });
          }}
        >
          UnFollow
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#a72ef8",
            color: "white",
            fontWeight: "600",
            width:"80px",
            marginLeft:"auto"
          }}
          disabled={disabler}
          onClick={() => {
            setDisabler(true);
            queryClient.resetQueries('feed');
            mutator.mutateAsync({ isFollow: true, username });
          }}
        >
          Follow
        </Button>
      )}
    </div>
  );
}

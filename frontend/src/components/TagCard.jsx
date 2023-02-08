import { Avatar, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function TagCard({
  name,
  isFollowing,
  mutator,
}) {
  const [disabler, setDisabler] = useState(false);
  useEffect(()=>{
    setDisabler(false);
  },[isFollowing]);
  return (
    <div className=" flex items-center my-2 shadow-card p-2 w-[400px] mx-auto rounded-lg hover:shadow-hover transition-shadow ease-linear delay-100">
      <Avatar sx={{bgcolor:"#f8932e"}}>＃</Avatar>
      <div
        className="flex flex-col items-start justify-center mx-3 w-[210px] overflow-hidden"
      >
        <Typography variant="h4" component="h4">
          {name}
        </Typography>
      </div>
      {isFollowing ? (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f82e9d",
            color: "white",
            fontWeight: "600",
          }}
          disabled={disabler}
          onClick={() => {
            setDisabler(true);
            mutator.mutateAsync({ isFollow: false, "tag":name });
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
          }}
          disabled={disabler}
          onClick={() => {
            setDisabler(true);
            mutator.mutateAsync({ isFollow: true, "tag":name });
          }}
        >
          Follow
        </Button>
      )}
    </div>
  );
}

import { Avatar, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
export default function TagCard({
  name,
  isFollowing,
  mutator,
}) {
  const [disabler, setDisabler] = useState(false);
  const queryClient=useQueryClient();
  useEffect(()=>{
    setDisabler(false);
  },[isFollowing]);
  return (
    <div className=" flex items-center my-2 shadow-card p-2 px-5 max-w-[500px] mx-auto rounded-lg hover:shadow-hover transition-shadow ease-linear delay-100">
      <Avatar sx={{bgcolor:"#f8932e",width:"50px",height:"50px"}}>＃</Avatar>
      <div
        className="flex flex-col items-start justify-center mx-3 overflow-hidden"
      >
        <Typography variant="h4" component="h4" sx={{"whiteSpace":"nowrap"}}>
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
            width:"80px",
            marginLeft:"auto"
          }}
          disabled={disabler}
          onClick={() => {
            setDisabler(true);
            queryClient.resetQueries('feed');
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
            width:"80px",
            marginLeft:"auto"
          }}
          disabled={disabler}
          onClick={() => {
            setDisabler(true);
            queryClient.resetQueries('feed');
            mutator.mutateAsync({ isFollow: true, "tag":name });
          }}
        >
          Follow
        </Button>
      )}
    </div>
  );
}

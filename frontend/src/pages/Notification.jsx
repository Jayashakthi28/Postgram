import React from "react";
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { api } from "../utils/api";
import {
  Avatar,
  Typography,
  Button,
  IconButton,
  useStepContext,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import moment from "moment/moment";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

function FollowCard({userName,time,id}){
  const navigate=useNavigate();
  return (
    <div className=" shadow-card p-2 rounded-sm m-3 cursor-pointer flex items-center" id={id} onClick={()=>{
      navigate(`/profile/${userName}`)
    }}>
      <PersonIcon sx={{color:"#a72ef8"}}/>
      <div className=" ml-5">
      <Typography><b className=" font-extrabold text-lg">{userName}</b> started following you.</Typography>
      <Typography fontSize={"0.8rem"}>{moment(time).fromNow()}</Typography>
      </div>
    </div>
  )
}

function LikeCard({type,postId,username,time,id}){
  const navigate=useNavigate();
  return (
    <div className=" shadow-card p-2 rounded-sm m-3 cursor-pointer flex items-center" id={id} onClick={()=>{
      navigate(`/profile?post=${postId}`)
    }}>
      {type==="like" && <ThumbUpRoundedIcon sx={{color:"#f82e9d"}}/>}
      {type==="comment" && <ChatBubbleOutlineOutlinedIcon sx={{color:"#a72ef8"}}/>}
      <div className=" ml-5">
      <Typography><b className=" text-lg">{username}</b> {type==="like"?"liked your post":"commented on your post"}</Typography>
      <Typography fontSize={"0.8rem"}>{moment(time).fromNow()}</Typography>
      </div>
    </div>
  )
}


export default function Notification() {
  const fetchNotification=async({ pageParam = 0 })=>{
    return await api.get(`/notification/${pageParam}`);
  }
 
   const {
     data,
     error,
     fetchNextPage,
     hasNextPage,
     isFetching,
     isFetchingNextPage,
     status,
   } = useInfiniteQuery('notification', fetchNotification, {
     getNextPageParam: (lastPage, pages) =>{
      if(lastPage.hasNext){
        return +lastPage.page+1;
      }
     },
   })
  return (
    <InfiniteScroll
    dataLength={data?.pages?.length || 0}
    next={() => fetchNextPage()}
    hasMore={hasNextPage === undefined ? true : hasNextPage}
    loader={
      <div className=" mx-3">
              <Skeleton
        height={50}
        enableAnimation
      />
      </div>
    }
    endMessage={
      <div className=" mx-auto w-[400px] text-center font-bubbler font-bold text-xl my-5">
        Nothing to show more 🫡
      </div>
    }
  >
    {data?.pages.map((group, i) => (
      <React.Fragment key={i}>
        {group.data.map((t, idx) => (
          <div>
            {t.type==="follow" && <FollowCard userName={t.username} id={t.id} time={t.time} key={t.id}/>}
            {(t.type==="like" || t.type==="comment")&&<LikeCard username={t.username} id={t.id} time={t.time} postId={t.postId} type={t.type} key={t.id}/>}
          </div>
        ))}
      </React.Fragment>
    ))}
  </InfiniteScroll>
  );
}

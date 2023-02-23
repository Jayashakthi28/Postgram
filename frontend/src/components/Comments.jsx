import React, { useState } from "react";
import {
  IconButton,
  Button,
  Stack,
  Chip,
  Avatar,
  Typography,
  TextField,
  InputAdornment
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from '@mui/icons-material/Send';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../utils/api";
import Skeleton from "react-loading-skeleton";
import {useNavigate } from "react-router-dom";

function Comment({username,comment}){
    const navigate=useNavigate()
    return(
        <div className=" w-full shadow-card p-3 my-2">
            <Typography className=" cursor-pointer w-fit" fontSize="1rem" fontWeight="800" color="blueviolet" variant="h6" onClick={
                (e)=>{
                    navigate(`/profile/${username}`)
                }
            }>{username}</Typography>
            <Typography className=" indent-3">{comment}</Typography>   
        </div>
    )
}

export default function Comments({ postId='63f436fca3fafb799270e6d3', setCommentOpen }) {
  const commentGetter=async()=>{
    return await api.get(`/comments/${postId}`);
  }
  const commentPoster=async({comment})=>{
    return await api.post(`/comments/${postId}`,{comment})
  }
  const [userComment,setUserComment]=useState("");
  const queryClient=useQueryClient();
  const commentMutator = useMutation(commentPoster, {
    onSuccess: (data, variable) => {
        let updatedPostData=data;
        queryClient.setQueryData(["comments",postId],(oldData)=>{
            let temp={...oldData};
            temp.data.push({"username":api.getUserData()["username"],"comment":variable.comment})
            return temp;
        });
        queryClient.setQueryData(["feed"],(oldData)=>{
            let temp={...oldData}
            temp.pages.forEach((currPage,i) => {
                let currData=[]
                currPage.data.forEach((t) => {
                  if (t.id === updatedPostData.data.id) {
                    let tempObj = { ...t };
                    tempObj.likes=updatedPostData.data.likes;
                    tempObj.comments=updatedPostData.data.comments;
                    currData.push(tempObj);
                  }
                  else{
                    currData.push(t);
                  }
                });
                currPage.data=currData
                temp.pages[i]=currPage;
              });
              return temp;
        })
    }
  });
  const commentSubmitter=()=>{
    setUserComment("");
    commentMutator.mutateAsync({comment:userComment})
  }
  const comments=useQuery(["comments",postId],commentGetter)
  return (
    <div className=" h-[calc(100vh-143px)] w-full absolute z-10 bg-slate-50 shadow-card">
      <div className="flex p-2 bg-purple-100 rounded-md justify-center relative shadow-card">
        <Typography variant="h4" component="h3">
          Comments
        </Typography>
        <IconButton sx={{position:"absolute",top:"50%",transform:"translateY(-50%)",right:5}} onClick={()=>{
            setCommentOpen(false);
        }}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="h-[calc(100vh-270px)] px-2 overflow-auto">
        {
            comments.isLoading&&(<Skeleton width={"100%"} height={200} className="!mx-auto rounded-md" style={{margin:"1rem auto"}}/>)
        }
        {
            comments.isError&&(<Typography variant="h5" className=" text-center" marginTop="1rem">Uh oh we couldn't fetch now...Please Try again Later 😕</Typography>)
        }
        {
             !comments.isLoading&&!comments.isError&&(comments.data.data.length===0)&&(<Typography variant="h5" className=" text-center" marginTop="1rem">Be the first to comment for this Post 😉</Typography>)
        }
        {
            !comments.isLoading&&!comments.isError&&(comments.data.data.length!==0)&&(comments.data.data.map((t,i)=>(<Comment comment={t.comment} username={t.username} key={i}/>)))
        }
      </div>
      <div className=" px-2 mt-2">
      <TextField
          label="Enter your Thoughts"
          variant="outlined"
          value={userComment}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
                commentSubmitter();
            }
          }}
          onChange={(e)=>(setUserComment(e.target.value))}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={()=>(commentSubmitter())}>
                <SendIcon color={"primary"}/>
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </div>
    </div>
  );
}

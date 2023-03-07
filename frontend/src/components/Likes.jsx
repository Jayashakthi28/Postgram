import { Skeleton,Typography,IconButton } from '@mui/material';
import React from 'react'
import {useQuery,useMutation,useQueryClient} from 'react-query'
import { api } from '../utils/api';
import UserCard from './UserCard';
import CloseIcon from "@mui/icons-material/Close";

export default function Likes({currPostId,setLikeOpen}) {
  const queryClient=useQueryClient();
  const likesFetcher=()=>{
    return api.get(`/likes/${currPostId}`);
  }
  const likes=useQuery(["likes",currPostId],likesFetcher);

  const putProfileData = async ({ isFollow, username }) => {
    let userData = {};
    if (isFollow) {
      userData = await api.post("/follow", { username: username });
    } else {
      userData = await api.post("/unfollow", { username: username });
    }
    return userData;
  };

  const followMutator = useMutation(putProfileData, {
    onSuccess:(data,variable)=>{
      queryClient.setQueryData(["likes",currPostId],(oldData)=>{
        let temp={...oldData}
        let retArr=[]
        temp.data.forEach(t=>{
          if(t.username===variable.username){
            t.isFollowing=!t.isFollowing
          }
          retArr.push(t);
        })
        temp.data=retArr;
        return temp;
      });
      queryClient.setQueryData(["feed"], (oldData) => {
        let temp = { ...oldData };
          temp.pages.forEach((currPage, i) => {
            let currData = [];
            currPage.data.forEach((t) => {
              if (t.username === variable.username) {
                let tempObj = { ...t };
                tempObj.isFollowing = !tempObj.isFollowing;
                currData.push(tempObj);
              } else {
                currData.push(t);
              }
            });
            currPage.data = currData;
            temp.pages[i] = currPage;
          });
        return temp;
      });
    },
    onSettled: () => {
      followMutator.reset();
    },
  });

  return (
    <div className=" h-[calc(100vh-143px)] w-full absolute z-10 bg-slate-50 shadow-card">
    <div className="flex p-2 bg-purple-100 rounded-md justify-center relative shadow-card">
      <Typography variant="h4" component="h3">
        Likes
      </Typography>
      <IconButton sx={{position:"absolute",top:"50%",transform:"translateY(-50%)",right:5}} onClick={()=>{
          setLikeOpen(false);
      }}>
        <CloseIcon />
      </IconButton>
    </div>
    <div className="h-[calc(100vh-198px)] px-2 overflow-auto">
      {
          likes.isLoading&&(<Skeleton variant='rounded'/>)
      }
      {
          likes.isError&&(<Typography variant="h5" className=" text-center" marginTop="1rem">Uh oh we couldn't fetch now...Please Try again Later 😕</Typography>)
      }
      {
           !likes.isLoading&&!likes.isError&&(likes.data.data.length===0)&&(<Typography variant="h5" className=" text-center" marginTop="1rem">Be the first to Like for this Post 😉</Typography>)
      }
      {
          !likes.isLoading&&!likes.isError&&(likes.data.data.length!==0)&&(likes.data.data.map((t,i)=>(<UserCard key={i} name={t.name} username={t.username} isFollowing={t.isFollowing} mutator={followMutator} showButton={false}/>)))
      }
    </div>
  </div>
  )
}
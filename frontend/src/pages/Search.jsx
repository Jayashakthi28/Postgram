import { TextField, InputAdornment, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "../utils/api";
import Loading from "../components/Loading";
import TagCard from "../components/TagCard";
import UserCard from "../components/UserCard";

export default function Search() {
  const [search, setSearch] = useState(" ");
  const serachResultGetter = async () => {
    return await api.post("/search", { query: search });
  };
  const queryClient = useQueryClient();
  const putProfileData = async ({ isFollow, username }) => {
    let userData = {};
    if (isFollow) {
      userData = await api.post("/follow", { username: username });
    } else {
      userData = await api.post("/unfollow", { username: username });
    }
    return userData;
  };
  const followSorter = (prop) => {
    return (a, b) => {
      if (a[prop] < b[prop]) {
        return 1;
      } else if (a[prop] > b[prop]) {
        return -1;
      } else {
        return 0;
      }
    };
  };
  const putTagData = async ({ isFollow, tag }) => {
    let tagData = {};
    if (isFollow) {
      tagData = await api.post("/tag/follow", { tag: tag });
    } else {
      tagData = await api.post("/tag/unfollow", { tag: tag });
    }
    return tagData;
  };

  const followMutator = useMutation(putProfileData, {
    onSuccess:(data,variable)=>{
      queryClient.setQueryData(["search",search],(oldData)=>{
        let temp={...oldData}
        let retArr=[]
        temp["users"].forEach(t=>{
          if(t.username===variable.username){
            t.isFollowing=!t.isFollowing
          }
          retArr.push(t);
        })
        temp["users"]=retArr;
        return temp;
      })
    },
    onSettled: () => {
      followMutator.reset();
    },
  });
  const tagMutator = useMutation(putTagData, {
    onSuccess:(data,variable)=>{
      queryClient.setQueryData(["search",search],(oldData)=>{
        let temp={...oldData}
        let retArr=[]
        temp["tags"].forEach(t=>{
          if(t.tag===variable.tag){
            t.isFollowing=!t.isFollowing
          }
          retArr.push(t);
        })
        temp["tags"]=retArr;
        return temp;
      })
    }
  });
  const searchResult = useQuery(["search", search], serachResultGetter);

  return (
    <div className=" p-6">
      <div>
        <TextField
          label="Search"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
          onChange={(e) => {
            setTimeout(() => {
              if (e.target.value === "") {
                setSearch(" ");
              } else {
                setSearch(e.target.value);
              }
            }, 1100);
          }}
        />
      </div>
      {searchResult.isLoading ? (
        <Loading />
      ) : searchResult.data.users?.length === 0 &&
        searchResult.data.tags?.length === 0 ? (
        <div>
          <Typography
            variant="h6"
            component="h6"
            fontWeight="600"
            sx={{
              textAlign: "center",
              marginTop: "2rem",
            }}
          >
            Uh Oh! Nothing is Here 😕
          </Typography>
        </div>
      ) : (
        <div>
          {searchResult.data.tags
            .map((t, i) => (
              <TagCard
                name={t.tag}
                isFollowing={t.isFollowing}
                mutator={tagMutator}
                key={i}
              />
            ))}
          {searchResult.data.users
            .map((t, i) => (
              <UserCard
                name={t.name}
                username={t.username}
                isFollowing={t.isFollowing}
                mutator={followMutator}
                key={i}
              />
            ))}
        </div>
      )}
    </div>
  );
}

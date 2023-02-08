import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Box, Tabs, Tab, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "./Loading";
import { api } from "../utils/api";
import UserCard from "./UserCard";
import TagCard from "./TagCard";

export default function OverlayContainer({ currentFocus, setBoxStatus, id }) {
  const [focusitem, setFocusItem] = useState(currentFocus);
  const getFollowers = async (params) => {
    let userId = params.queryKey.length === 1 ? null : params.queryKey[1];
    if (!userId) {
      let data = await api.get("/followers");
      return data;
    }
    let data = await api.get(`/followers/${id}`);
    return data;
  };
  const getFollowing = async (params) => {
    let userId = params.queryKey.length === 1 ? null : params.queryKey[1];
    if (!userId) {
      let data = await api.get("/following");
      return data;
    }
    let data = await api.get(`/following/${id}`);
    return data;
  };
  const getTags = async (params) => {
    let userId = params.queryKey.length === 1 ? null : params.queryKey[1];
    if (!userId) {
      let data = await api.get("/tag");
      return data;
    }
    let data = await api.get(`/tag/${id}`);
    return data;
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
  const putTagData = async ({ isFollow, tag }) => {
    let tagData = {};
    if (isFollow) {
      tagData = await api.post("/tag/follow", { tag: tag });
    } else {
      tagData = await api.post("/tag/unfollow", { tag: tag });
    }
    return tagData;
  };
  const cacheUpdater = (focusedOne, oldData, variable) => {
    let temData = { ...oldData };
    let newArr = [];
    temData[focusedOne].forEach((t) => {
      if (t.username === variable.username) {
        let temp = { ...t };
        temp.isFollowing = !temp.isFollowing;
        newArr.push(temp);
      } else {
        newArr.push(t);
      }
    });
    let returnObj = {};
    returnObj[`${focusedOne}`] = newArr;
    return returnObj;
  };
  const followMutator = useMutation(putProfileData, {
    onSuccess: (data, variable) => {
      if (id === undefined) {
        queryClient.setQueryData(["following"], (oldData) =>
          cacheUpdater("following", oldData, variable)
        );
        queryClient.setQueryData(["followers"], (oldData) =>
          cacheUpdater("followers", oldData, variable)
        );
        queryClient.invalidateQueries(["profile"], { exact: true });
      } else {
        queryClient.setQueryData(["following", id], (oldData) =>
          cacheUpdater("following", oldData, variable)
        );
        queryClient.setQueryData(["followers", id], (oldData) =>
          cacheUpdater("followers", oldData, variable)
        );
        queryClient.invalidateQueries(["profile", id], { exact: true });
      }
    },
    onSettled: () => {
      followMutator.reset();
    },
  });
  const tagMutator = useMutation(putTagData, {
    onSuccess: (data, variable) => {
      if (id === undefined) {
        queryClient.setQueriesData(["tags"], (oldData) => {
          let temp = { ...oldData };
          let retArr = [];
          temp["tags"].forEach((t) => {
            if (t.tag === variable.tag) {
              t.isFollowing = !t.isFollowing;
            }
            retArr.push(t);
          });
          return { tags: retArr };
        });
      } else {
        queryClient.setQueriesData(["tags", id], (oldData) => {
          let temp = { ...oldData };
          let retArr = [];
          temp["tags"].forEach((t) => {
            if (t.tag === variable.tag) {
              t.isFollowing = !t.isFollowing;
            }
            retArr.push(t);
          });
          return { tags: retArr };
        });
      }
      queryClient.invalidateQueries("profile", { exact: true });
    },
  });
  const followersList =
    id === undefined
      ? useQuery(["followers"], getFollowers)
      : useQuery(["followers", id], getFollowers);
  const followingList =
    id === undefined
      ? useQuery(["following"], getFollowing)
      : useQuery(["following", id], getFollowing);
  const tagsList =
    id === undefined
      ? useQuery(["tags"], getTags)
      : useQuery(["tags", id], getTags);
  const dataMapper = (focusitem) => {
    switch (focusitem) {
      case "followers":
        return {
          isLoading: followersList.isLoading,
          data: followersList.data?.followers,
        };
      case "following":
        return {
          isLoading: followingList.isLoading,
          data: followingList.data?.following,
        };
      case "tags":
        return {
          isLoading: tagsList.isLoading,
          data: tagsList.data?.tags,
        };
    }
  };
  const handleChange = (event, newValue) => {
    if (followMutator.isLoading) return;
    setFocusItem(newValue);
  };
  return (
    <div>
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", position: "relative" }}
      >
        <Tabs
          value={focusitem}
          aria-label="user details"
          onChange={handleChange}
          centered
        >
          <Tab
            label="😎 Followers"
            value="followers"
            sx={{
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          />
          <Tab
            label="😇 Following"
            value="following"
            sx={{
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          />
          <Tab
            label="＃ Tags"
            value="tags"
            sx={{
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          />
        </Tabs>
        <IconButton
          sx={{
            height: "100%",
            position: "absolute",
            right: "20px",
            top: "0",
          }}
          onClick={() => {
            setBoxStatus(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <div>
        {dataMapper(focusitem).isLoading ? (
          <Loading />
        ) : !dataMapper(focusitem).data?.length ? (
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
        ) : focusitem !== "tags" ? (
          dataMapper(focusitem).data.map((t, i) => (
            <UserCard
              username={t.username}
              name={t.name}
              isFollowing={t.isFollowing}
              key={i}
              setBoxStatus={setBoxStatus}
              mutator={followMutator}
            />
          ))
        ) : (
          dataMapper(focusitem).data.map((t, i) => (
            <TagCard
              name={t.tag}
              isFollowing={t.isFollowing}
              key={i}
              mutator={tagMutator}
            />
          ))
        )}
      </div>
    </div>
  );
}

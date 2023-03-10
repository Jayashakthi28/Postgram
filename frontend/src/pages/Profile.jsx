import {
  Avatar,
  Typography,
  Button,
  IconButton,
  useStepContext,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { api } from "../utils/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loading from "../components/Loading";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth0 } from "@auth0/auth0-react";
import OverlayContainer from "../components/OverlayContainer";
import FeedBox from "../components/FeedBox";
import Comments from "../components/Comments";
import Likes from "../components/Likes";

export default function Profile() {
  const { id } = useParams();
  const { logout } = useAuth0();
  const queryClient = useQueryClient();
  const [isBoxOpen, setBoxStatus] = useState(false);
  const [currentFocus, setCurrentFocus] = useState("following");
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
        width: `${window.innerWidth>500?"120px":"60px"}`,
        height: `${window.innerWidth>500?"120px":"60px"}`,
        fontSize: `${window.innerWidth>500?"4rem":"1rem"}`,
        fontWeight: "700",
      },
      children: `${name.split(" ")[0][0]}${
        name.split(" ").length === 1
          ? name.split(" ")[0][1]
          : name.split(" ")[1][0]
      }`,
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

  const [commentOpen, setcommentOpen] = useState(false);
  const [likesOpen, setlikesOpen] = useState(false);
  const [currPostId, setcurrPostId] = useState("");
  const [scrollYoffset, setscrollYoffset] = useState(window.pageYOffset);
  const [name,setname]=useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const putPostData = async ({ page, forQuery, data }) => {
    if (forQuery === "follow") {
      return api.post("/follow", data);
    } else if (forQuery === "unfollow") {
      return api.post("/unfollow", data);
    } else if (forQuery === "like") {
      return api.post("/like", data);
    } else if (forQuery === "unlike") {
      return api.post("/unlike", data);
    }
  };

  const postMutatorFunction = (oldData, variable, data) => {
    let temp = { ...oldData };
    if (variable.forQuery === "like" || variable.forQuery === "unlike") {
      let retArr = [];
      temp.data.forEach((t) => {
        if (t.id === variable.data.postId) {
          let temObj = { ...t };
          temObj.isLiked = !temObj.isLiked;
          temObj.likes = data.data.likes;
          temObj.comments = data.data.comments;
          retArr.push(temObj);
        } else {
          retArr.push(t);
        }
      });
      temp.data = retArr;
    }
    return temp;
  };

  const profileMutatorFunction = ({name}) =>{
    return api.post("/profile/edit",{"name":name});
  }

  const postMutator = useMutation(putPostData, {
    onSuccess: (data, variable) => {
      if (id === undefined)
        queryClient.setQueryData(["profilePost"], (oldData) => {
          return postMutatorFunction(oldData, variable, data);
        });
      else {
        queryClient.setQueryData(["profilePost", id], (oldData) => {
          return postMutatorFunction(oldData, variable, data);
        });
      }
    },
    onSettled: () => {
      postMutator.reset();
    },
  });


  const profileMutator = useMutation(profileMutatorFunction,{
    onSuccess:(data,variable)=>{
      queryClient.setQueryData(["profile"],(oldValue)=>{
        let temp={...oldValue};
        temp["name"]=variable.name;
        return temp;
      });
      let temp=api.getUserData();
      temp["name"]=name;
      api.setUserData(temp);
    }
  })

  const getPosts = async () => {
    let userPosts = {};
    if (id === undefined) {
      userPosts = api.get("/allpost");
    } else {
      userPosts = api.get(`/allpost/${id}`);
    }
    return userPosts;
  };

  const putProfileData = async (isFollow) => {
    let userData = {};
    if (isFollow) {
      userData = await api.post("/follow", { username: id });
    } else {
      userData = await api.post("/unfollow", { username: id });
    }
    return userData;
  };

  const followMutator = useMutation(putProfileData, {
    onSuccess: (data, variable, context) => {
      queryClient.invalidateQueries(["profile", id]);
      queryClient.invalidateQueries("profile", { exact: true });
    },
    onSettled: () => {
      followMutator.reset();
    },
  });

  const [queryParameter] = useSearchParams();

  const profilePosts =
    id === undefined
      ? useQuery("profilePost", getPosts)
      : useQuery(["profilePost", id], getPosts);

  const profileData =
    id === undefined
      ? useQuery("profile", getProfileData)
      : useQuery(["profile", id], getProfileData);

  useEffect(() => {
    window.scroll(0, scrollYoffset);
  }, [commentOpen, likesOpen]);

  useEffect(() => {
    if (!profileData.isLoading && !profilePosts.isLoading) {
      setname(profileData.data?.name);
      const postId = queryParameter.get("post");
      if (postId) {
        const ele = document.getElementById(postId);
        ele?.scrollIntoView({ behavior: "smooth" });
        ele?.classList.add("shadow-hover");
        ele?.classList.add("shadow-purple-400");
        setTimeout(() => {
          ele?.classList.remove("shadow-hover");
          ele?.classList.remove("shadow-purple-400");
        }, 2000);
      }
    }
  }, [profileData.isLoading, profilePosts.isLoading]);

  return (
    <>
      {isBoxOpen ? (
        <OverlayContainer
          currentFocus={currentFocus}
          setBoxStatus={setBoxStatus}
          id={id}
        />
      ) : commentOpen === true ? (
        <Comments
          postId={currPostId}
          setCommentOpen={setcommentOpen}
          forQuery="profile"
          username={id}
        />
      ) : likesOpen ? (
        <Likes currPostId={currPostId} setLikeOpen={setlikesOpen} />
      ) : profileData.isLoading || profilePosts.isLoading ? (
        <Loading />
      ) : profileData.data.status === "not registered" ||
        profileData.data.status === "not found" ? (
        <div className=" flex flex-col justify-center items-center mt-[10%]">
          <Typography component="h1" variant="h1">
            ????
          </Typography>
          <Typography component="h4" variant="h4">
            No User Found
          </Typography>
        </div>
      ) : (
        <>
          <div className=" p-1 bg-gray-100 min-h-[calc(100vh-142px)]">
            <div className=" flex max-w-fit mt-5 postBox:flex-wrap mx-auto shadow-card hover:shadow-hover transition-all rounded-md p-5 justify-center items-center overflow-clip">
              <Avatar {...stringAvatar(profileData.data.name)} />
              <div className="flex flex-col mx-6">
                <div className=" flex flex-col w-full flex-wrap postBox:justify-center postBox:items-center">
                  <Typography component="h2" variant="h4" fontWeight="600" sx={{
                    maxWidth:`${(window.innerWidth>500)?"500px":"200px"}`,
                    wordWrap:"break-word",
                    fontSize:`${window.innerWidth>500?"none":"large"}`
                  }}>
                    {profileData.data.name}
                  </Typography>
                  <Typography component="h2" variant="h6" fontWeight="500" sx={{
                    fontSize:`${window.innerWidth>500?"none":"small"}`
                  }}>
                    @{profileData.data.username}
                  </Typography>
                </div>
                <div className="flex w-full justify-items-start postBox:justify-center mt-4">
                  <Typography
                    component="h2"
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      marginRight: "5px",
                      ":hover": {
                        color: "#a72ef8",
                      },
                      transition: "all 200ms ease",
                      fontSize:`${window.innerWidth>500?"none":"large"}`
                    }}
                    className=" cursor-pointer"
                    onClick={(e) => {
                      setCurrentFocus("tags");
                      setBoxStatus(true);
                    }}
                  >
                    {profileData.data.tags} Tags
                  </Typography>
                  <Typography
                    component="h2"
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      margin: "0px 5px",
                      ":hover": {
                        color: "#a72ef8",
                      },
                      transition: "all 200ms ease",
                      fontSize:`${window.innerWidth>500?"none":"large"}`

                    }}
                    className=" cursor-pointer"
                    onClick={(e) => {
                      setCurrentFocus("following");
                      setBoxStatus(true);
                    }}
                  >
                    {profileData.data.following} Following
                  </Typography>
                  <Typography
                    component="h2"
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      margin: "0px 5px",
                      ":hover": {
                        color: "#a72ef8",
                      },
                      transition: "all 200ms ease",
                      fontSize:`${window.innerWidth>500?"none":"large"}`
                    }}
                    className=" cursor-pointer"
                    onClick={(e) => {
                      setCurrentFocus("followers");
                      setBoxStatus(true);
                    }}
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
                    onClick={() => {
                      followMutator.mutateAsync(true);
                    }}
                    disabled={
                      followMutator.isLoading ||
                      profileData.isLoading ||
                      profileData.isFetching ||
                      profileData.isRefetching
                    }
                  >
                    Follow
                  </Button>
                ) : profileData.data.isFollowing === true ? (
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "10px",
                      backgroundColor: "#f82e9d",
                      color: "white",
                      fontWeight: "600",
                    }}
                    onClick={() => {
                      followMutator.mutateAsync(false);
                    }}
                    disabled={
                      followMutator.isLoading ||
                      profileData.isLoading ||
                      profileData.isFetching ||
                      profileData.isRefetching
                    }
                  >
                    UnFollow
                  </Button>
                ) : (
                  <div className=" w-full flex items-center justify-center mt-2">
                    <Button
                      variant="outlined"
                      sx={{
                        border: "1px solid #a72ef8",
                        color: "#a72ef8",
                        fontWeight: "600",
                        width: "200px",
                      }}
                      onClick={handleOpen}
                    >
                      Edit Profile
                    </Button>
                    <IconButton
                      color="primary"
                      sx={{
                        marginLeft: "2px",
                        color: "#b855fa",
                      }}
                      onClick={logout}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <div className=" absolute top-1/2 -translate-y-1/2 flex items-center flex-col justify-center p-2 rounded-md left-1/2 -translate-x-1/2 bg-white min-w-[250px] h-auto">
                  <Typography variant="h6" component="h6">
                    Edit Profile
                  </Typography>
                  <TextField placeholder="Name" variant="outlined" value={name} label="Name" sx={{
                    "marginTop":"15px"
                  }} onChange={(e)=>{
                    if(e.target.value.match(/[<>]/g) || e.target.value.length>20) return;
                    setname(e.target.value);
                  }}/>
                  <TextField value={api.getUserData()["username"]} disabled label="Username" sx={{
                    "marginTop":"15px"
                  }}/>
                  <TextField value={api.getUserData()["email"]} disabled label="Email" sx={{
                    "marginTop":"15px"
                  }}/>
                  <Button variant="contained" sx={{
                    "marginTop":"15px"
                  }}
                  disabled={name.trim()===api.getUserData()["name"] || name.trim()===""}
                  onClick={()=>{
                    profileMutator.mutate({"name":name.trim()})
                    handleClose();
                  }}
                  >Submit</Button>
              </div>
            </Modal>
            <div className=" flex flex-wrap">
              {profilePosts?.data?.data.map((t, i) => (
                <FeedBox
                  quote={t.text}
                  bgColor={t.background}
                  fontColor={t.fontColor}
                  font={t.font}
                  isLiked={t.isLiked}
                  userName={t.username}
                  isFollowing={t.isFollowing}
                  tags={t.tag}
                  postId={t.id}
                  comments={t.comments}
                  likes={t.likes}
                  name={t.name !== undefined ? t.name : t.userName}
                  key={i}
                  time={t.time}
                  page={0}
                  mutator={postMutator}
                  setCommentOpen={setcommentOpen}
                  setPostId={setcurrPostId}
                  setPageOffset={setscrollYoffset}
                  setLikeOpen={setlikesOpen}
                  calculateVisited={false}
                  showFollowButton={false}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

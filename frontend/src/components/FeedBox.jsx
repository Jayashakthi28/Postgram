import React, { useRef, useState, useEffect } from "react";
import PostBox from "./PostBox";
import {
  IconButton,
  Button,
  Stack,
  Chip,
  Avatar,
  Typography,
} from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Skeleton from "react-loading-skeleton";
import { api } from "../utils/api";
import moment from "moment/moment";

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

const ActionCard = ({ icon, text, className,onClick=()=>{} }) => {
  return (
    <div
      className={` p-1 flex font-bubbler font-bold ${className} cursor-pointer mr-1 text-lg w-[80px]`}
      onClick={onClick}
    >
      {text===undefined && <span></span>}
      <IconButton sx={{ width: "30px", height: "30px", padding: "10px" }}>
        {icon}
      </IconButton>
      {text!==undefined && <span className=" ml-1">{text}</span>}
    </div>
  );
};

const UserViewer = ({ username, name, isFollowing, mutator, page,showFollowButton }) => {
  
  const navigate = useNavigate();
  return (
    <div className=" p-2 flex w-full items-center">
      <Avatar {...stringAvatar(name)} />
      <Typography
        variant="h6"
        component="h6"
        sx={{
          whiteSpace: "nowrap",
          width: "220px",
          overflow: "hidden",
          marginLeft: "10px",
          marginRight: "10px",
          textOverflow: "ellipsis",
          fontFamily: "Bubbler",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => {
          navigate(`/profile/${username}`);
        }}
      >
        {username}
      </Typography>

      {isFollowing ? (
        showFollowButton&&<Button
          variant="contained"
          sx={{
            backgroundColor: "#f82e9d",
            color: "white",
            fontWeight: "600",
            width: "80px",
          }}
          onClick={() => {
            mutator.mutateAsync({
              page: page,
              forQuery: "unfollow",
              data: { username: username },
            });
          }}
        >
          UnFollow
        </Button>
      ) : (
        showFollowButton&&<Button
          variant="contained"
          sx={{
            backgroundColor: "#a72ef8",
            color: "white",
            fontWeight: "600",
            width: "80px",
          }}
          onClick={() => {
            mutator.mutateAsync({
              page: page,
              forQuery: "follow",
              data: { username: username },
            });
          }}
        >
          Follow
        </Button>
      )}
    </div>
  );
};

function useOnScreen(ref, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current === null) return;
      observer.unobserve(ref.current);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return isIntersecting;
}

export default function FeedBox({
  quote,
  bgColor,
  fontColor,
  font,
  isLiked,
  userName,
  isFollowing,
  tags,
  postId,
  comments,
  likes,
  name,
  time,
  page,
  mutator,
  setCommentOpen,
  setPostId,
  setPageOffset,
  calculateVisited=true,
  showFollowButton=true
}) {
  let formatter = Intl.NumberFormat("en", { notation: "compact" });
  let boxShadow = "rgb(248,147,46)";
  const ref = useRef();
  const onScreen = useOnScreen(ref, "-300px");
  const [visited, setVisited] = useState(false);
  useEffect(() => {
    if (onScreen && !visited && calculateVisited) {
      api.get(`/visited/${postId}`);
      setVisited(true);
    }
  }, [onScreen]);

  return (
    <div className={` p-7 shadow-card w-fit mx-auto rounded-md my-4 transition-all`} ref={ref} id={postId}>
      <UserViewer
        name={name}
        username={userName}
        isFollowing={isFollowing}
        key={() => uidv4()}
        mutator={mutator}
        page={page}
        showFollowButton={showFollowButton}
      />
      <PostBox
        quote={quote}
        bgColor={bgColor}
        fontColor={fontColor}
        font={font}
        key={postId}
      />
      <Stack
        direction="row"
        spacing="1"
        sx={{
          margin: "4px 0"
        }}
      >
        <div>
          {isLiked ? (
            <ActionCard
              icon={<ThumbUpRoundedIcon />}
              text={` ${formatter.format(likes)}`}
              key={() => uuidv4()}
              onClick={() => {
                mutator.mutateAsync({
                  page: page,
                  forQuery: "unlike",
                  data: { postId: postId },
                });
              }}
            />
          ) : (
            <ActionCard
              icon={<ThumbUpOutlinedIcon />}
              text={`${formatter.format(likes)}`}
              key={() => uuidv4()}
              onClick={() => {
                mutator.mutateAsync({
                  page: page,
                  forQuery: "like",
                  data: { postId: postId },
                });
              }}
            />
          )}
        </div>
        <div>
          <ActionCard
            icon={<ChatBubbleOutlineOutlinedIcon color="" />}
            text={`${formatter.format(comments)}`}
            key={() => uuidv4()}
            onClick={()=>{
                setPageOffset(window.pageYOffset);
                setPostId(postId);
                setCommentOpen(true);
            }}
          />
        </div>
        <div>
          <ActionCard
            icon={<FileDownloadOutlinedIcon color="" />}
            key={() => uuidv4()}
          />
        </div>
      </Stack>
      <Stack
        direction="row"
        sx={{ width: "400px" }}
        flexWrap={"wrap"}
        alignItems="center"
      >
        {tags.map((t, i) => (
          <Chip
            avatar={
              <Avatar
                sx={{ bgcolor: `${bgColor}`, color: `${fontColor} !important` }}
              >
                ＃
              </Avatar>
            }
            label={t}
            variant="outlined"
            sx={{ margin: "2px" }}
            key={i}
          />
        ))}
      </Stack>
      <Typography fontSize="0.8rem" sx={{ margin: "2px", marginLeft: "0.5rem" }}>
        {moment(time).fromNow()}
      </Typography>
    </div>
  );
}

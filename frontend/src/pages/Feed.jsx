import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { api } from "../utils/api";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import PostBox from "../components/PostBox";
import FeedBox from "../components/FeedBox";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Comments from "../components/Comments";
import Likes from "../components/Likes";

let currTopic = "post";
let currPage = 0;

export default function Feed() {
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

  const postMutator = useMutation(putPostData, {
    onSuccess: (data, variable) => {
      queryClient.setQueryData(["feed"], (oldData) => {
        let temp = { ...oldData };
        if (
          variable.forQuery === "follow" ||
          variable.forQuery === "unfollow"
        ) {
          temp.pages.forEach((currPage, i) => {
            let currData = [];
            currPage.data.forEach((t) => {
              if (t.username === variable.data.username) {
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
        } else if (
          variable.forQuery === "like" ||
          variable.forQuery === "unlike"
        ) {
          let currPage = temp.pages[variable.page];
          let retArr = [];
          currPage.data.forEach((t) => {
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
          currPage.data = retArr;
          temp.pages[variable.page] = currPage;
        }
        return temp;
      });
    },
    onSettled: () => {
      postMutator.reset();
    },
  });
  const queryClient = useQueryClient();
  const [commentOpen, setcommentOpen] = useState(false);
  const [likesOpen,setlikesOpen]=useState(false);
  const [currPostId, setcurrPostId] = useState("");
  const [scrollYoffset, setscrollYoffset] = useState(window.pageYOffset);
  const fetchPosts = async ({ pageParam = { topic: "post", page: 0 } }) => {
    let { topic, page } = pageParam;
    if (topic === "post") {
      return await api.get("/post");
    } else {
      return await api.get(`/post/${topic}/${page}`);
    }
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("feed", fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length === 0 || lastPage.hasNext === false) {
        if (lastPage.type === "recommended") {
          return { topic: "visited", page: 0 };
        } else if (lastPage.type === "visited") {
          return { topic: "random", page: 0 };
        }
      } else {
        if (lastPage.type === "recommended") {
          return { topic: "post", page: +lastPage.page + 1 };
        }
        return { topic: lastPage.type, page: +lastPage.page + 1 };
      }
    },
  });
  let lastPage = data?.pages.length - 1;
  useEffect(() => {
    window.scroll(0, scrollYoffset);
  }, [commentOpen,likesOpen]);
  if (data?.pages[lastPage]?.data.length === 0 && data?.pages[lastPage]?.type!=="random" ) {
    fetchNextPage();
  }
  return (
    <>
      {commentOpen && (
        <Comments setCommentOpen={setcommentOpen} postId={currPostId} />
      )}
      {likesOpen && (
        <Likes currPostId={currPostId} setLikeOpen={setlikesOpen}/>
      )}
      <InfiniteScroll
        dataLength={data?.pages?.length || 0}
        className={` bg-[url('/src/assets/bg.svg')] bg-fixed ${
          (commentOpen||likesOpen)
            ? "!h-[calc(100vh-144px)] !overflow-hidden"
            : "!h-auto !overflow-auto min-h-screen"
        }`}
        next={() => fetchNextPage()}
        hasMore={hasNextPage === undefined ? true : hasNextPage}
        loader={
          <div className=" w-[400px] mx-auto">
            <Skeleton height={400} enableAnimation />
          </div>
        }
        endMessage={
          <div className=" mx-auto w-[400px] text-center font-bubbler font-bold text-2xl my-5">
            Thats all we got for you 😬
          </div>
        }
      >
        {data?.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map((t, idx) => (
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
                key={idx}
                time={t.time}
                page={i}
                mutator={postMutator}
                setCommentOpen={setcommentOpen}
                setLikeOpen={setlikesOpen}
                setPostId={setcurrPostId}
                setPageOffset={setscrollYoffset}
              />
            ))}
          </React.Fragment>
        ))}
      </InfiniteScroll>
    </>
  );
}

import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { api } from "../utils/api";
import { useInfiniteQuery } from "react-query";
import PostBox from "../components/PostBox";
import FeedBox from "../components/FeedBox";
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

let currTopic = "post";
let currPage = 0;
export default function Feed() {
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
  let lastPage=data?.pages.length-1;
  console.log(lastPage);
  if(data?.pages[lastPage]?.data.length===0 && lastPage!==2){
    fetchNextPage();
  }
  return (
    <InfiniteScroll dataLength={data?.pages?.length||0} className=" bg-[url('/src/assets/bg.svg')] bg-fixed min-h-screen" next={()=>(fetchNextPage())} hasMore={(hasNextPage===undefined)?true:hasNextPage} loader={<Skeleton height={400} width={400} className=" mx-auto" enableAnimation/>} endMessage={<div className=" mx-auto w-[400px] text-center font-bubbler font-bold text-2xl my-5">Thats all we got for you 😬</div>}>
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
              name={(t.name!==undefined)?t.name:t.userName}
              key={idx}
              time={t.time}
            />
          ))}
        </React.Fragment>
      ))}
    </InfiniteScroll>
  );
}

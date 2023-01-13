import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div className=" w-full h-[calc(100vh-142.27px)] flex justify-center items-center">
      <ReactLoading color="#000000" />
    </div>
  );
}

import { Typography } from "@mui/material";
import React from "react";
import { useState } from "react";

export default function ColourPicker({
  legendName,
  defaultValue,
  setValue,
  className,
}) {
  const [isFocused, setIsfocused] = useState(false);
  return (
    <div
      className={` flex flex-col items-center border-[1.5px]  border-gray-300 p-1 rounded hover:border-black hover:cursor-pointer ${className} ${
        isFocused ? "!border-[#d8b4fe] !border-[2px]" : "border-gray:300"
      }`}
      onMouseEnter={() => {
        setIsfocused(false);
      }}
      onMouseLeave={() => {
        setIsfocused(false);
      }}
    >
      <Typography variant="h6">{legendName}</Typography>
      <input
        type="color"
        defaultValue={defaultValue}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onClick={(e) => {
          console.log("clicking")
          setIsfocused(true);
        }}
      />
    </div>
  );
}

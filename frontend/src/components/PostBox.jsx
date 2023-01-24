import React from "react";

export default function PostBox({ quote, bgColor, fontColor, font, className }) {
  return (
    <div
      className={`w-[400px] h-[400px] bg-[${bgColor}] text-${fontColor} font-${font} text-3xl flex items-center justify-center whitespace-pre-wrap flex-wrap p-2 text-center overflow-hidden ${className}`}
      style={{
        "fontFamily":font||"bubbler",
        "backgroundColor":bgColor,
        "color":fontColor
      }}
    >
      {quote}
    </div>
  );
}

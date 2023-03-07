import React from "react";

export default function PostBox({ quote, bgColor, fontColor, font, className,reference}) {
  return (
    <div
      className={`w-[400px] h-[400px] postBox:w-[200px] postBox:h-[200px] postBox:text-base bg-[${bgColor}] text-${fontColor} font-${font} text-3xl flex items-center justify-center whitespace-pre-wrap flex-wrap p-2 text-center overflow-hidden relative ${className}`}
      style={{
        "fontFamily":font||"bubbler",
        "backgroundColor":bgColor,
        "color":fontColor
      }}
      ref={reference}
    >
      {quote}
    </div>
  );
}

import React from "react";

export default function SlotPlaceholder({ left, top, width, height, onClick }) {
  return (
    <div
      className="absolute rounded-lg border-2 border-dashed border-gray-300 bg-white/60 flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition"
      style={{
        left,
        top,
        width,
        height,
      }}
      onClick={onClick}
    >
      <div className="text-gray-600 flex flex-col items-center">
        <span className="text-2xl font-bold">+</span>
        <span className="text-xs">Add image</span>
      </div>
    </div>
  );
}

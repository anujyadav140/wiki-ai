"use client";
import { Divider } from "@mui/material";
import { LoremIpsum } from "./lorem";

export default function MainContent() {
  return (
    <>
      <div className="divide-y divide-purple-700">
        <div>Napoleon</div>
        <LoremIpsum />
      </div>
    </>
  );
}

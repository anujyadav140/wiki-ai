"use client";
import MainContent from "@/app/components/content";
import React from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/app/components/sidebar/sidebar";

export default function WikiAiPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const linkUrl = searchParams.get("linkUrl");
  const wikiName = searchParams.get("wikiName");
  return (
    <>
      <main className="overflow-x-hidden">
        <div className="bg-back flex h-screen object-cover">
          {/* <Sidebar navBar="isNavBar" left="isLeft" /> */}
          {/* <div className="flex items-center justify-center flex-grow flex-col">*/}
            <MainContent name={wikiName} link={linkUrl} />
          {/* </div> */}
        </div>
      </main>
    </>
  );
}

"use client"
import MainContent from "@/app/components/content";
import Tab from "@/app/components/tabs/tab";
import React from "react";
import { useSearchParams } from 'next/navigation'

export default function WikiAiPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const linkUrl = searchParams.get('linkUrl')
  const wikiName = searchParams.get('wikiName');
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* <h1>ID: {params.id}</h1>
      <h1>name: {wikiName}</h1>
      <h1>Search: {linkUrl}</h1> */}
      <div
        className="scrollbar-track shadow-indigo max-h-screen 
        w-2/3 overflow-y-auto overflow-x-hidden rounded-xl bg-white bg-opacity-30   p-4 text-sm  font-medium
          text-gray-600 shadow-xl
       scrollbar-thin scrollbar-thumb-indigo-600"
      >
        <MainContent name={wikiName} link={linkUrl} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-center py-4">
        <Tab />
      </div>
    </main>
  );
}

import React from "react";
import Tab from "../components/tabs/tab";
import MainContent from "../components/content";

export default function WikiAiPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-end">
      <div
        className="scrollbar-track shadow-indigo max-h-screen 
        w-2/3 overflow-y-auto overflow-x-hidden rounded-xl bg-white bg-opacity-30   p-4 text-sm  font-medium
          text-gray-600 shadow-xl
       scrollbar-thin scrollbar-thumb-indigo-600"
      >
        <MainContent />
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-center py-4">
        <Tab />
      </div>
    </main>
  );
}

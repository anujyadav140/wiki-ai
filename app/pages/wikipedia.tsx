import React from "react";
import Tab from "../components/tabs/tab";

export default function WikiAiPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-end">
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center w-full py-4">
        <Tab />
      </div>
    </main>
  );
}

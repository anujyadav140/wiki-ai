import React from "react";
import Tab from "../components/tabs/tab";

export default function WikiAiPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-end">
      <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-center py-4">
        <Tab />
      </div>
    </main>
  );
}

"use client"
import Search from "../components/search";
import Sidebar from "../components/sidebar/sidebar";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <div className="flex h-screen bg-back object-cover">
        <Sidebar left="isLeft" />
        <div className="flex-grow flex flex-col">
          <Search />
        </div>
      </div>
    </main>
  );
}

"use client"
import Search from "../components/search";
import Sidebar from "../components/sidebar/sidebar";

export default function HomePage() {

  return (
    <main>
      <div className={"w-full h-screen bg-back object-cover flex"}>
        <Sidebar />
        <div className="flex-grow flex flex-col">
          <Search />
        </div>
      </div>
    </main>
  );
}

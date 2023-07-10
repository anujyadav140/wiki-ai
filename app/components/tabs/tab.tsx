"use client";
import React, { useState } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { VscSymbolKeyword } from "react-icons/vsc";
import { HiOutlineListBullet } from "react-icons/hi2";

function Tab() {
  const [activeTab, setActiveTab] = useState(1);

  const changeTab = (tabIndex: React.SetStateAction<number>) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="max-w-3xl mx-auto px-8 sm:px-0">
      <div className="sm:w-7/12 sm:mx-auto">
        <div
          role="tablist"
          aria-label="tabs"
          className="relative w-max mx-auto h-12 grid grid-cols-3 items-center px-[3px] rounded-full bg-gray-900/20 overflow-hidden shadow-2xl shadow-900/20 transition"
        >
          <div
            className={`absolute indicator h-11 my-auto top-0 bottom-0 left-0 rounded-full bg-white shadow-md transition-transform ${
              activeTab === 1
                ? "transform translate-x-0"
                : activeTab === 2
                ? "transform translate-x-full"
                : "transform translate-x-full translate-x-full"
            }`}
          ></div>
          <button
            role="tab"
            aria-selected={activeTab === 1}
            aria-controls="panel-1"
            id="tab-1"
            tabIndex={activeTab === 1 ? 0 : -1}
            onClick={() => changeTab(1)}
            className={`relative flex items-center h-10 px-6 tab rounded-full ${
              activeTab === 1 ? "bg-white text-gray-800" : "text-gray-800"
            }`}
          >
            <AiOutlineFileText className="mr-1" />
            <span className="text-gray-800">Short Summary</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 2}
            aria-controls="panel-2"
            id="tab-2"
            tabIndex={activeTab === 2 ? 0 : -1}
            onClick={() => changeTab(2)}
            className={`relative flex items-center h-10 px-6 tab rounded-full ${
              activeTab === 2 ? "bg-white text-gray-800" : "text-gray-800"
            }`}
          >
            <HiOutlineListBullet className="mr-1" />
            <span className="text-gray-800">Bullet Points</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 3}
            aria-controls="panel-3"
            id="tab-3"
            tabIndex={activeTab === 3 ? 0 : -1}
            onClick={() => changeTab(3)}
            className={`relative flex items-center h-10 px-6 tab rounded-full ${
              activeTab === 3 ? "bg-white text-gray-800" : "text-gray-800"
            }`}
          >
            <VscSymbolKeyword className="mr-1" />
            <span className="text-gray-800">Keyword Search</span>
          </button>
        </div>
        <div className="mt-6 relative rounded-3xl bg-purple-50">
          <div
            role="tabpanel"
            id="panel-1"
            className={`tab-panel p-6 transition duration-300 ${
              activeTab === 1 ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Short Summary
            </h2>
            <p className="mt-4 text-gray-600">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas
              dolores voluptate temporibus, atque ab eos, delectus at ad hic
              voluptatem veritatis iure, nulla voluptates quod nobis doloremque
              eaque! Perferendis, soluta.
            </p>
          </div>
          <div
            role="tabpanel"
            id="panel-2"
            className={`absolute top-0 tab-panel p-6 transition duration-300 ${
              activeTab === 2 ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Bullet Points
            </h2>
            <p className="mt-4 text-gray-600">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas
              dolores voluptate temporibus, atque ab eos, delectus at ad hic
              voluptatem veritatis iure, nulla voluptates quod nobis doloremque
              eaque! Perferendis, soluta.
            </p>
          </div>
          <div
            role="tabpanel"
            id="panel-3"
            className={`absolute top-0 tab-panel p-6 transition duration-300 ${
              activeTab === 3 ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Keyword Search
            </h2>
            <p className="mt-4 text-gray-600">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas
              dolores voluptate temporibus, atque ab eos, delectus at ad hic
              voluptatem veritatis iure, nulla voluptates quod nobis doloremque
              eaque! Perferendis, soluta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tab;

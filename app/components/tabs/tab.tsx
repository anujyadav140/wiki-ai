"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { VscSymbolKeyword } from "react-icons/vsc";
import { HiOutlineListBullet } from "react-icons/hi2";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

function Tab() {
  const [activeTab, setActiveTab] = useState(0);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const changeTab = (tabIndex: React.SetStateAction<number>) => {
    setActiveTab(tabIndex);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 740);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.white,
    },
  }));

  return (
    <div>
      <div
        role="tablist"
        aria-label="tabs"
        className="relative w-max mx-auto h-12 grid grid-cols-3 items-center px-[3px] rounded-full bg-gray-900/20 overflow-hidden shadow-2xl shadow-900/20 transition"
      >
        <div
          className={`absolute indicator h-11 my-auto top-0 bottom-0 left-0 rounded-full bg-white shadow-md transition-transform ${
            activeTab === 0
              ? "transform translate-x-0"
              : activeTab === 1
              ? "transform translate-x-full"
              : "transform translate-x-full translate-x-full"
          }`}
        ></div>
        <LightTooltip
          title="Find a short summary for the highlighted wikipedia section"
          placement="top"
          arrow
        >
          <button
            role="tab"
            aria-selected={activeTab === 0}
            aria-controls="panel-1"
            id="tab-1"
            tabIndex={activeTab === 0 ? 0 : -1}
            onMouseEnter={() => changeTab(0)}
            className={`relative flex items-center h-10 px-6 tab rounded-full ${
              activeTab === 0 ? "bg-white text-gray-800" : "text-gray-800"
            }`}
          >
            <AiOutlineFileText className="mr-1" />
            {!isMobileScreen && (
              <span className="text-gray-800">Short Summary</span>
            )}
          </button>
        </LightTooltip>
        <LightTooltip
          title="Convert highlighted wikipedia section to bullet points"
          placement="top"
          arrow
        >
          <button
            role="tab"
            aria-selected={activeTab === 1}
            aria-controls="panel-2"
            id="tab-2"
            tabIndex={activeTab === 1 ? 0 : -1}
            onMouseEnter={() => changeTab(1)}
            className={`relative flex items-center h-10 px-6 tab rounded-full ${
              activeTab === 1 ? "bg-white text-gray-800" : "text-gray-800"
            }`}
          >
            <HiOutlineListBullet className="mr-1" />
            {!isMobileScreen && (
              <span className="text-gray-800">Bullet Points</span>
            )}
          </button>
        </LightTooltip>
        <LightTooltip
          title="Find keywords in wiki sections to find contextual articles"
          placement="top"
          arrow
        >
          <button
            role="tab"
            aria-selected={activeTab === 2}
            aria-controls="panel-3"
            id="tab-3"
            tabIndex={activeTab === 2 ? 0 : -1}
            onMouseEnter={() => changeTab(2)}
            className={`relative flex items-center h-10 px-6 tab rounded-full ${
              activeTab === 2 ? "bg-white text-gray-800" : "text-gray-800"
            }`}
          >
            <VscSymbolKeyword className="mr-1" />
            {!isMobileScreen && (
              <span className="text-gray-800">Keyword Search</span>
            )}
          </button>
        </LightTooltip>
      </div>
      <div className="mt-6 relative rounded-3xl bg-purple-50"></div>
    </div>
  );
}

export default Tab;

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
        className="relative mx-auto grid h-12 w-max grid-cols-3 items-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-300 via-purple-500 to-indigo-600 px-[3px] shadow-2xl transition drop-shadow-xl hover:drop-shadow-2xl"
      >
        <div
          className={`indicator absolute bottom-0 left-0 top-0 my-auto h-11 rounded-full bg-white shadow-md transition-transform ${
            activeTab === 0
              ? "translate-x-0 transform"
              : activeTab === 1
              ? "translate-x-full transform"
              : "translate-x-full translate-x-full transform"
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
            className={`tab relative flex h-10 items-center rounded-full px-6 ${
              activeTab === 0 ? "bg-white text-black" : "text-black"
            }`}
          >
            <AiOutlineFileText className="mr-1" />
            {!isMobileScreen && (
              <span className="text-black">Short Summary</span>
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
            className={`tab relative flex h-10 items-center rounded-full px-6 ${
              activeTab === 1 ? "bg-white text-black" : "text-black"
            }`}
          >
            <HiOutlineListBullet className="mr-1" />
            {!isMobileScreen && (
              <span className="text-black">Bullet Points</span>
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
            className={`tab relative flex h-10 items-center rounded-full px-6 ${
              activeTab === 2 ? "bg-white text-black" : "text-black"
            }`}
          >
            <VscSymbolKeyword className="mr-1" />
            {!isMobileScreen && (
              <span className="text-black">Keyword Search</span>
            )}
          </button>
        </LightTooltip>
      </div>
      {/* <div className="relative mt-6 rounded-3xl bg-purple-50"></div> */}
    </div>
  );
}

export default Tab;

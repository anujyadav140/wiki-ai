import React from "react";
import { dataWeb } from "./data";

const SidebarData = ({toggle}:{toggle:any}) => {
  return (
    <div className="">
      {dataWeb.map((data) => {
        return (
          <div
            className={`${
              toggle ? "last:w-[3.6rem]" : "last:w-[17rem]"
            } sidebar last:absolute left-4 bottom-4`}
            key={data.id}
          >
            <div className="mr-8 text-[1.7rem] text-brown">{data.icon}</div>
            <div
              className={`${
                toggle ? "opacity-0 delay-200" : ""
              } text-[1rem] text-brown whitespace-pre`}
            >
              {data.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarData;
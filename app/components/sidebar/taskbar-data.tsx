import React from "react";
import { dataTaskBar } from "./data";

const TaskbarData = ({toggle}:{toggle:any}) => {
  return (
    <div className="">
      {dataTaskBar.map((data) => {
        return (
          <div
            className={`${
              toggle ? "last:w-[3.6rem]" : "last:w-[17rem]"
            } sidebar`}
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

export default TaskbarData;
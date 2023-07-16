import React, { useState } from "react";
import { dataTaskBar } from "./data";

const TaskbarData = (props: any) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleClick = (index: number) => {
    const clickedData = dataTaskBar[index].text;
    // console.log("Clicked button:", clickedData);
    setSelectedItem(index);
    props.handleClick(clickedData); // Trigger the handleClick function from the parent component
  };

  return (
    <div className="">
      {dataTaskBar.map((data, index) => {
        const isSelected = selectedItem === index;
        return (
          <div
            className={`${
              props.toggle ? "last:w-[3.6rem]" : "last:w-[17rem]"
            } sidebar`}
            key={data.id}
            onClick={() => handleClick(index)} // Add onClick event handler
            style={{ background: isSelected ? "white" : "transparent" }}
          >
            <div className="mr-8 text-[1.7rem] text-brown">{data.icon}</div>
            <div
              className={`${
                props.toggle ? "opacity-0 delay-200" : ""
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

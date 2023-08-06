import React, { useState, useEffect } from "react";
import { dataTaskBar } from "./data";

const TaskbarData = (props: any) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleClick = (index: number) => {
    const clickedData = dataTaskBar[index].text;
    setSelectedItem(index);
    props.handleClick(clickedData);
  };

  useEffect(() => {
    if (props.newCheckboxChecked) {
      setSelectedItem(null);
    }
  }, [props.newCheckboxChecked]);


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
            onClick={() => handleClick(index)}
            style={{
              background: isSelected ? "white" : "transparent",
              opacity: props.newCheckboxChecked ? "1" : "",
            }}
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

import React, { useState, ChangeEvent, useEffect } from "react";
import { BiChevronLeft } from "react-icons/bi";
import UserProfile from "./sidebar-profile";
import SidebarData from "./sidebar-data";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { dataWeb } from "./data";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import { Divider, ListItemButton } from "@mui/material";

const Sidebar = () => {
  const [toggle, setToggle] = useState(true);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 740) {
        setIsMobileScreen(true);
      } else {
        setIsMobileScreen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div>
      {isMobileScreen ? (
        <div
          className="absolute -left-5 top-[7rem] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-glass"
          onClick={handleToggle}
        >
          <BiChevronLeft
            className={`${
              toggle ? "rotate-180" : ""
            } text-3xl transition-all duration-300`}
          />
          <Drawer
            anchor="left"
            open={!toggle}
            onClose={handleToggle}
            PaperProps={{
              style: {
                backgroundColor: "white",
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              },
            }}
          >
            <List>
              {dataWeb.map((item, index) => (
                <div key={item.id}>
                  {index === dataWeb.length - 1 && <Divider />}{" "}
                  {/* Add a divider before the last item */}
                  <ListItemButton component="a" href="#">
                    <ListItem>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  </ListItemButton>
                </div>
              ))}
            </List>
          </Drawer>
        </div>
      ) : (
        <div className={`${toggle ? "w-[5.8rem]" : ""} sidebar-container`}>
          <UserProfile toggle={toggle} />
          <SidebarData toggle={toggle} />
          <div
            className="absolute -left-5 top-[7rem] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-glass"
            onClick={handleToggle}
          >
            <BiChevronLeft
              className={`${
                toggle ? "rotate-180" : ""
              } text-3xl transition-all duration-300`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

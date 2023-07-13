import React, { useState, ChangeEvent, useEffect } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import UserProfile from "./sidebar-profile";
import SidebarData from "./sidebar-data";
import TaskbarData from "./taskbar-data";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { dataNavBar } from "./data";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import { Divider, ListItemButton } from "@mui/material";

const Sidebar = (props: any) => {
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

  const renderIcon = () => {
    if (props.right) {
      return <BiChevronRight className={`${toggle ? "rotate-180" : ""} text-3xl transition-all duration-300`} />;
    } else if (props.left) {
      return <BiChevronLeft className={`${toggle ? "rotate-180" : ""} text-3xl transition-all duration-300`} />;
    } else {
      return null;
    }
  };

  return (
    <>
    {props.navBar ? (
    <div>
      {isMobileScreen ? (
        <div
          className="absolute -left-5 top-[7rem] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-glass"
          onClick={handleToggle}
        >
          {renderIcon()}
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
              {dataNavBar.map((item, index) => (
                <div key={item.id}>
                  {index === dataNavBar.length - 1 && <Divider />}
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
            {renderIcon()}
          </div>
        </div>
      )}
    </div>
    //this is the taskbar
    ) : (
      <div>
      {isMobileScreen ? (
        <div
          className="absolute -left-5 top-[7rem] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-glass"
          onClick={handleToggle}
        >
          {renderIcon()}
          <Drawer
            anchor="right"
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
              {dataNavBar.map((item, index) => (
                <div key={item.id}>
                  {index === dataNavBar.length - 1 && <Divider />}
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
          {/* <UserProfile toggle={toggle} /> */}
          <TaskbarData toggle={toggle} />
          <div
            className="absolute -left-5 top-[7rem] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-glass"
            onClick={handleToggle}
          >
            {renderIcon()}
          </div>
        </div>
      )}
    </div>
    )}
    </>
  );
};

export default Sidebar;

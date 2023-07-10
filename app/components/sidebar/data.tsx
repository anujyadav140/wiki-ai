import { FiUser, FiLogOut } from "react-icons/fi";
import { AiOutlineFileSearch, AiOutlineMessage } from "react-icons/ai";
import { BsFolder, BsWallet2, BsBookmarks } from "react-icons/bs";
import { BiAlignLeft, BiImages } from "react-icons/bi";

export const dataWeb = [
  {
    id: 1,
    icon: <AiOutlineFileSearch />,
    text: "Wikipedia Search",
  },
  {
    id: 2,
    icon: <BiAlignLeft />,
    text: "Continue Your Reading",
  },
  {
    id: 3,
    icon: <BsBookmarks />,
    text: "Your Bookmarks",
  },
  {
    id: 4,
    icon: <BiImages />,
    text: "Wikipedia Images",
  },
  {
    id: 5,
    icon: <AiOutlineMessage />,
    text: "Messages",
  },
  // {
  //   id: 6,
  //   icon: <BsFolder />,
  //   text: "File Manager",
  // },
  // {
  //   id: 7,
  //   icon: <BsWallet2 />,
  //   text: "Wallet",
  // },
  {
    id: 6,
    icon: <FiLogOut />,
    text: "Logout",
  },
];
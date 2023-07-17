import { FiLogOut } from "react-icons/fi";
import { AiOutlineFileSearch, AiOutlineFileText, AiOutlineMessage } from "react-icons/ai";
import { BsEmojiSunglasses, BsBookmarks } from "react-icons/bs";
import { BiAlignLeft, BiImages } from "react-icons/bi";
import { HiOutlineListBullet } from "react-icons/hi2";
import { VscSymbolKeyword } from "react-icons/vsc";
import { LiaPagelines } from "react-icons/lia";

export const dataNavBar = [
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
  {
    id: 6,
    icon: <FiLogOut />,
    text: "Logout",
  },
];

export const dataTaskBar = [
  {
    id: 1,
    icon: <AiOutlineFileText />,
    text: "Short Summary",
  },
  {
    id: 2,
    icon: <HiOutlineListBullet />,
    text: "Bullet Points",
  },
  {
    id: 3,
    icon: <LiaPagelines />,
    text: "Poetic Form",
  },
  {
    id: 4,
    icon: <BsEmojiSunglasses />,
    text: "Summary with Emojis 😃",
  },
]
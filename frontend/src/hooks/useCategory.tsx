"use client";
import { FaShoppingCart } from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import { ImSpoonKnife } from "react-icons/im";
import {
  MdEmojiTransportation,
  MdHome,
  MdOutlineCastForEducation,
  MdOutlineSportsEsports,
} from "react-icons/md";
import { PiMoneyLight } from "react-icons/pi";
import { TbMoneybag } from "react-icons/tb";

const useCategory = () => {
  function categoryToIcon(categoryName: string) {
    switch (categoryName) {
      case "Food":
        return <ImSpoonKnife size={20} />;
      case "Transportation":
        return <MdEmojiTransportation size={20} />;
      case "Entertainment":
        return <MdOutlineSportsEsports size={20} />;
      case "Shopping":
        return <FaShoppingCart size={20} />;
      case "Health":
        return <GiHealthNormal size={20} />;
      case "Education":
        return <MdOutlineCastForEducation size={20} />;
      case "Life":
        return <MdHome size={20} />;
      case "Investment":
        return <TbMoneybag size={20} />;
      default:
        return <PiMoneyLight size={20} />;
    }
  }

  return {
    categoryToIcon,
  };
};

export default useCategory;

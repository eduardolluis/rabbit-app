import Link from "next/link";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";

const Topbar = () => {
  return (
    <div className="primary text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 ">
        <div className="hidden md:flex items-center space-x-4">
          {/* META LOGO */}
          <Link
            href="/"
            className="hover:text-gray-300 transition-transform duration-300 cursor-pointer  hover:scale-110"
          >
            <TbBrandMeta className="h-5 w-5" />
          </Link>
          {/*  INSTAGRAM LOGO */}
          <Link
            href="https://www.instagram.com/eduardo.lluis/"
            target="_blank"
            className="hover:text-gray-300 transition-transform duration-300 cursor-pointer  hover:scale-110"
          >
            <IoLogoInstagram className="h-5 w-5" />
          </Link>
          {/* TWITTER LOGO  */}
          <Link
            href="/"
            className="hover:text-gray-300 transition-transform duration-300 cursor-pointer  hover:scale-110"
          >
            <RiTwitterXLine className="h-4 w-4" />
          </Link>
        </div>
        <div className="text-sm text-center flex-grow">
          <span> We ship worldwide - Fast and reliable shipping!</span>
        </div>
        <div className="text-sm hidden md:block">
          <Link
            href=""
            className="hover:text-gray-300 transition-transform duration-300 cursor-pointer  "
          >
            +1 (849) 407 0063
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

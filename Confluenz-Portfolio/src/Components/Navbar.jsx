import React from "react";
import { NavLink  } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const [hasTog, sethasTog] = React.useState(false);

  function A() {
    setMenuOpen(!isMenuOpen);
    sethasTog(true);
  }

  function B() {
    setMenuOpen(!isMenuOpen);
  }

  const navLinkClasses = ({ isActive }) => `
  relative text-gray-300 font-display after:content-[''] after:absolute after:right-0 after:-bottom-1 
  after:h-[2px] after:bg-gray-300 after:transition-all after:duration-200 leading-4 hover:after:w-full
  ${isActive ? 'after:w-full' : 'after:w-0'}
`;
const mobileNavLinkClasses= ({isActive})=> `font-medium text-slate-300 border-b-2 border-slate-300 hover:bg-slate-500 p-4 rounded-md
${isActive ? `bg-slate-500` : ``}`;

  return (
    <>
      <div
        id="overlay"
        className={`${
          isMenuOpen ? "" : "hidden"
        } fixed inset-0 bg-gray-400 bg-opacity-50 duration-75`}
        onClick={B}
      ></div>

      <nav id="navbar" className="bg-local flex p-4 justify-between items-center bg-gradient-to-b from-gray-800 via-gray-900 to-black border-b-2 border-gray-800">
        <NavLink to="/Photowalks" className="min-w-fit">
          <img src="./src/assets/conf.png" alt="conf-logo" className="w-20" />
        </NavLink>
        <div id="nav-menu" className="hidden md:flex gap-10">
          <NavLink
            to="/"
            className={navLinkClasses}
          >
            Home
          </NavLink>
          <ScrollLink
            to="portfolio" // ID of the Portfolio section
            smooth={true}
            duration={500}
            offset={-70} // Adjust offset for fixed navbar height
            className="relative text-gray-300 font-display after:content-[''] after:absolute after:right-0 after:-bottom-1 
              after:h-[2px] after:bg-gray-300 after:transition-all after:duration-200 leading-4 hover:after:w-full after:w-0"
          >
            Portfolio
          </ScrollLink>

          <NavLink
            to="/Photowalks"
            className={navLinkClasses}
          >
            Photowalks
          </NavLink>
          <NavLink
            to="/Events"
            className={navLinkClasses}
          >
            Events
          </NavLink>
          <NavLink
            to="/AboutUs"
            className={navLinkClasses}
          >
            About us
          </NavLink>
        </div>

        <NavLink to="/Instagram" className="hover:scale-125 transition-all duration-200">
          <i className="fa-brands fa-instagram text-white w-12 fa-xl hidden md:inline"></i>
        </NavLink>

        <button id="toggle" className="m-1 md:hidden" onClick={A}>
          <i className="fa-solid fa-bars fa-2xl text-white"></i>
        </button>

        <div
          id="ham-menu"
          className={`${
            isMenuOpen
              ? "animate-slideIn"
              : hasTog
              ? "animate-slideOut"
              : "hidden"
          } inset-0 md:hidden bg-black z-40 flex flex-col px-6 pb-8 pt-3 w-2/3 min-w-fit fixed h-screen`}
        >
          <NavLink to="/Photowalks" className="min-w-fit">
            <img src="./src/assets/conf.png" alt="conf-logo" className="w-20" />
          </NavLink>
          <div className="w-full h-1 bg-slate-300 mt-4 rounded-full"></div>
          <NavLink
            to="/"
            className={mobileNavLinkClasses}
          >
            Home
          </NavLink>
          <ScrollLink
            to="portfolio" // ID of the Portfolio section
            smooth={true}
            duration={500}
            offset={-70} // Adjust offset for fixed navbar height
            className="font-medium text-slate-300 border-b-2 border-slate-300 hover:bg-slate-500 p-4 rounded-md"
          >
            Portfolio
          </ScrollLink>
          <NavLink
            to="/Photowalks"
            className={mobileNavLinkClasses}
          >
            Photowalks
          </NavLink>
          <NavLink
            to="/Events"
            className={mobileNavLinkClasses}
          >
            Events
          </NavLink>
          <NavLink
            to="/AboutUs"
            className={mobileNavLinkClasses}
          >
            About Us
          </NavLink>
        </div>
      </nav>
    </>
  );
}

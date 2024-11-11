import React from "react";
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const [isMenuOpen, setMenuOpen] = React.useState(false);
    const [hasTog, sethasTog] = React.useState(false);

    function toggleMenu() {
        setMenuOpen(!isMenuOpen);
        sethasTog(true);
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    const navLinkClasses = ({ isActive }) => `
  relative text-gray-300 font-display after:content-[''] after:absolute after:right-0 after:-bottom-1 
  after:h-[2px] after:bg-gray-300 after:transition-all after:duration-200 leading-4 
  ${isActive ? 'after:w-full' : 'after:w-0'}
`;

    const mobileNavLinkClasses= ({isActive})=> `font-medium text-slate-300 border-b-2 border-slate-300 hover:bg-slate-500 p-4 rounded-md
    ${isActive ? `bg-slate-500` : ``}`;

    return (
        <>
            {/* Overlay for mobile menu */}
            <div
                id="overlay"
                className={`${isMenuOpen ? "" : "hidden"
                    } fixed inset-0 bg-gray-400 bg-opacity-50 duration-75`}
                onClick={closeMenu}
            ></div>

            {/* Navbar */}
            <nav className="bg-local flex p-4 justify-between items-center bg-gradient-to-b from-gray-800 via-gray-900 to-black border-b-2 border-gray-800">
                <NavLink to="/photowalks" className="min-w-fit">
                    <img src="./src/assets/conf.png" alt="conf-logo" className="w-20" />
                </NavLink>

                {/* Desktop menu NavLinks */}
                <div id="nav-menu" className="hidden md:flex gap-10">
                    <NavLink to="/" className={navLinkClasses}>
                        Home
                    </NavLink>
                    <NavLink to="/categories" className={navLinkClasses}>
                        Categories
                    </NavLink>
                    <NavLink to="/photowalks" className={navLinkClasses}>
                        Photowalks
                    </NavLink>
                    <NavLink to="/events" className={navLinkClasses}>
                        Events
                    </NavLink>
                    <NavLink to="/member-form" className={navLinkClasses}>
                        Member
                    </NavLink>
                </div>

                {/* Instagram NavLink (visible only on desktop) */}
                <div><i className="fa-solid fa-lock text-white  text-2xl"></i></div>

                {/* Mobile menu toggle button */}
                <button id="toggle" className="m-1 md:hidden" onClick={toggleMenu}>
                    <i className="fa-solid fa-bars fa-2xl text-white"></i>
                </button>

                {/* Mobile menu */}
                <div
                    id="ham-menu"
                    className={`${isMenuOpen ? "animate-slideIn" : hasTog ? "animate-slideOut" : "hidden"
                        } inset-0 md:hidden bg-black z-40 flex flex-col px-6 pb-8 pt-3 w-2/3 min-w-fit fixed h-screen`}
                >
                    <NavLink to="/photowalks" onClick={closeMenu} className="min-w-fit">
                        <img src="./src/assets/conf.png" alt="conf-logo" className="w-20" />
                    </NavLink>
                    <div className="w-full h-1 bg-slate-300 mt-4 rounded-full"></div>

                    {/* Mobile menu NavLinks */}
                    <NavLink to="/" onClick={closeMenu} className={mobileNavLinkClasses}>
                        Home
                    </NavLink>
                    <NavLink to="/categories" onClick={closeMenu} className={mobileNavLinkClasses}>
                        Categories
                    </NavLink>
                    <NavLink to="/photowalks" onClick={closeMenu} className={mobileNavLinkClasses}>
                        Photowalks
                    </NavLink>
                    <NavLink to="/events" onClick={closeMenu} className={mobileNavLinkClasses}>
                        Events
                    </NavLink>
                    <NavLink to="/member-form" onClick={closeMenu} className={mobileNavLinkClasses}>
                        Members
                    </NavLink>
                    {/* <NavLink to="/contact" onClick={closeMenu} className={mobileNavLinkClasses}>
                        Contact Us
                    </NavLink> */}
                </div>
            </nav>
        </>
    );
}

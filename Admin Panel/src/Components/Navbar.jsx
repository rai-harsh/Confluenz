import React from "react";
import { Link } from 'react-router-dom';

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
                <Link to="/photowalks" className="min-w-fit">
                    <img src="./src/assets/conf.png" alt="conf-logo" className="w-20" />
                </Link>
                
                {/* Desktop menu links */}
                <div id="nav-menu" className="hidden md:flex gap-10">
                    <Link to="/" className="relative text-gray-300 font-display leading-4 hover:underline">
                        Home
                    </Link>
                    <Link to="/categories" className="relative text-gray-300 font-display leading-4 hover:underline">
                        Categories
                    </Link>
                    <Link to="/photowalks" className="relative text-gray-300 font-display leading-4 hover:underline">
                        Photowalks
                    </Link>
                    <Link to="/events" className="relative text-gray-300 font-display leading-4 hover:underline">
                        Events
                    </Link>
                    <Link to="/member-form" className="relative text-gray-300 font-display leading-4 hover:underline">
                        Member
                    </Link>
                </div>

                {/* Instagram link (visible only on desktop) */}
                <Link to="/instagram" className="hover:scale-125 transition-all duration-200 hidden md:inline">
                    <i className="fa-brands fa-instagram text-white w-12 fa-xl"></i>
                </Link>

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
                    <Link to="/photowalks" onClick={closeMenu} className="min-w-fit">
                        <img src="./src/assets/conf.png" alt="conf-logo" className="w-20" />
                    </Link>
                    <div className="w-full h-1 bg-slate-300 mt-4 rounded-full"></div>

                    {/* Mobile menu links */}
                    <Link to="/" onClick={closeMenu} className="font-medium text-slate-300 border-b-2 border-slate-300 hover:bg-slate-500 p-4 rounded-md">
                        Home
                    </Link>
                    <Link to="/portfolio" onClick={closeMenu} className="font-medium text-slate-300 border-b-2 border-slate-300 hover:bg-slate-500 p-4 rounded-md">
                        Portfolio
                    </Link>
                    <Link to="/photowalks" onClick={closeMenu} className="font-medium text-slate-300 border-b-2 border-slate-300 hover:bg-slate-500 p-4 rounded-md">
                        Photowalks
                    </Link>
                    <Link to="/events" onClick={closeMenu} className="font-medium text-slate-300 border-b-2 border-slate-300 hover:bg-slate-500 p-4 rounded-md">
                        Events
                    </Link>
                    <Link to="/member-form" onClick={closeMenu} className="font-medium text-slate-300 border-b-2 border-slate-300 hover:bg-slate-500 p-4 rounded-md">
                        Members
                    </Link>
                    <Link to="/contact" onClick={closeMenu} className="font-medium text-slate-300 border-b-2 border-slate-300 hover:bg-slate-500 p-4 rounded-md">
                        Contact Us
                    </Link>
                </div>
            </nav>
        </>
    );
}

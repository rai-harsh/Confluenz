import React from "react";
import { Link as ScrollLink } from 'react-scroll';
import { NavLink } from 'react-router-dom';

export default function Footer() {
    const quickLinks = [
        { name: "Home", path: "/" },
        { name: "Portfolio", path: "portfolio", isScrollLink: true }, // Scroll link for Portfolio
        { name: "Photowalks", path: "/Photowalks" },
        { name: "Events", path: "/Events" },
        { name: "About us", path: "/AboutUs" }
    ];

    const linkElements = quickLinks.map((link, index) => (
        link.isScrollLink ? (
            <ScrollLink
                key={index}
                to={link.path}
                smooth={true}
                duration={500}
                    offset={-70}
                className="text-gray-300 font-display transition-transform duration-300 hover:translate-x-2"
            >
                {link.name}
            </ScrollLink>
        ) : (
            <NavLink
                key={index}
                to={link.path}
                className="text-gray-300 font-display transition-transform duration-300 hover:translate-x-2"
            >
                {link.name}
            </NavLink>
        )
    ));

    const socials = ["instagram", "linkedin", "youtube"].map((item, index) => (
        <div className="flex gap-3 items-center group relative" key={index}>
            <i className={`fa-brands fa-${item} text-gray-300 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`}></i>
            <a href="#" className="text-gray-300 font-display transition-transform duration-300 group-hover:translate-x-2">
                {item}
            </a>
        </div>
    ));

    return (
        <div className="bg-black py-20">
            <div className="w-3/4 mx-auto gap-10 flex flex-col justify-between sm:flex-row">
                <div className="flex gap-16 flex-col sm:flex-row">
                    <div className="footer-sec">
                        <h4 className="footer-heading">Quick Links</h4>
                        {linkElements}
                    </div>
                    <div className="footer-sec">
                        <h4 className="footer-heading">Socials</h4>
                        {socials}
                    </div>
                </div>
                <div className="footer-sec w-full sm:w-1/4 min-w-40">
                    <h4 className="footer-heading">Have a question</h4>
                    <div className="flex items-baseline gap-3">
                        <i className="fa-solid fa-location-dot text-white"></i>
                        <p className="text-gray-300">
                            Dr. Akhilesh Das Gupta Institute of Professional Studies, Zero Pusta Rd, Shastri Park, New Delhi
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-phone text-white"></i>
                        <p className="text-gray-300">9354514584</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-envelope text-white"></i>
                        <p className="text-gray-300">harshst0@gmial.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

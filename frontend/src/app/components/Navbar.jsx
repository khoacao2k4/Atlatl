"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiBookOpen, FiInfo } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import NavDropdown from "./NavDropdown";
import { FiKey } from "react-icons/fi";
import { RiLoopLeftFill } from "react-icons/ri";

const resourceItems = [
    { 
      name: "BLOGS & TOOLS", 
      desc: "The latest news and calculators", 
      href: "/resources", 
      icon: <FiBookOpen className="w-6 h-6 md:w-8 md:h-8" /> 
    },
    { 
      name: "FAQ", 
      desc: "Quick answers to your common questions", 
      href: "/resources/faq", 
      icon: <FiInfo className="w-6 h-6 md:w-8 md:h-8" /> 
    },
  ];

  const aboutUsItems = [
    {
      name: "MEET THE TEAM",
      desc: "Experts Dedicated to Your Growth",
      href: "/team",
      icon: <IoPersonOutline className="w-6 h-6 md:w-8 md:h-8" />
    },
    {
      name: "WHY ATLATL",
      desc: "Why Clients Choose Atlatl",
      href: "/why-atlatl",
      icon: <FiKey className="w-6 h-6 md:w-8 md:h-8" />
    },
    {
      name: "PROCESS",
      desc: "The Atlatl Way of Working",
      href: "/process",
      icon: <RiLoopLeftFill className="w-6 h-6 md:w-8 md:h-8" />
    },
  ];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // State for mobile resources dropdown toggle
  const [openMobileMenu, setOpenMobileMenu] = useState(null);

  const closeMenu = () => {
    setIsOpen(false);
    setOpenMobileMenu(null); // Reset mobile sub-menu on close
  };

  useEffect(() => {
    if (isOpen) {
      // Disable scroll
      document.body.style.overflow = "hidden";
    } else {
      // Enable scroll
      document.body.style.overflow = "unset";
    }
    // Cleanup function: Ensure scroll is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMobileSubMenu = (menuName) => {
    setOpenMobileMenu(prevName => prevName === menuName ? null : menuName);
  };

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setOpenMobileMenu(null); // Close any open mobile sub-menu on resize
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  const menuItems = [
    { name: "ABOUT US", href: "", subMenu: aboutUsItems }, // Mark this as having a submenu
    { name: "SERVICES", href: "/services" },
    { name: "RESOURCES", href: '', subMenu: resourceItems }, // Mark this as having a submenu
    { name: "CONTACT US", href: "/contact-us" },
  ];

  const navLinkStyles = `
    text-black font-songer leading-none group transition duration-300 ease-in-out hover:text-bold-blue
    text-lg max-lg:text-3xl flex items-center gap-1
  `;
  const underlineStyles = `
    absolute -bottom-1 left-0 h-0.5 bg-bold-blue transition-all duration-300 
    w-0 group-hover:w-full
  `;
  const loginButtonStyles = `
    py-3 px-8 bg-bold-blue shadow-md rounded-full
    text-white font-bold font-songer text-lg text-center

    hover:bg-white hover:text-bold-blue hover:cursor-pointer hover:ring-2 hover:ring-bold-blue
    transition-all duration-300 transform

    max-lg:text-3xl max-lg:w-[200px]
  `;

  return (
    <nav className="w-full h-[100px] bg-white flex items-center justify-between px-6 lg:px-12 z-100">      
      {/* 1. Logo */}
      <div className="z-110">
        <Link href="/">
          <img
            src="/images/atlatl-logo.png"
            alt="Logo"
            className="w-[113px] h-[113px] object-contain"
          />
        </Link>
      </div>

      {/* 2. Desktop Menu */}
      <div className="hidden lg:flex items-center gap-10">
        {menuItems.map((item, index) => {
          if ("subMenu" in item) {
            return (
              <NavDropdown 
                key={"dropdown-" + index}
                item={item}
                subItems={item.subMenu}
                navLinkStyles={navLinkStyles}
                underlineStyles={underlineStyles}
              />
            );
          } else {
            // Standard Links
            return (
              <Link key={index} href={item.href} className={`${navLinkStyles} relative`}>
                {item.name}
                <span className={underlineStyles} />
              </Link>
            );
          }
        })}
        <Link href="/client-experience" className={loginButtonStyles}>
          LOGIN
        </Link>
      </div>

      {/* 3. Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden z-110 text-3xl text-black"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* 4. Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 bg-white z-100 flex flex-col pt-[25vh] items-center gap-12
          transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {menuItems.map((item, index) => {
          const isCurrentMenuOpen = openMobileMenu === item.name;

          if ("subMenu" in item) {
            // --- MOBILE RESOURCES ACCORDION ---
            return (
              <div key={index} className="flex flex-col items-center w-full">
                <button 
                  onClick={() => toggleMobileSubMenu(item.name)}
                  className={`${navLinkStyles} relative`}
                >
                  {item.name}
                  
                  {/* Arrow (Absolute Positioned to keep text centered) */}
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                    <img 
                      src="/images/triangle_blue.svg" 
                      alt="toggle"
                      className={`w-4 h-auto object-contain transition-transform duration-300 
                        ${isCurrentMenuOpen && "rotate-180"}`}
                    />
                  </div>
                </button>
                
                <div className={`
                    flex flex-col gap-4 w-full transition-all duration-300 ease-in-out overflow-hidden
                    ${isCurrentMenuOpen ? "max-h-[200px] opacity-100 mt-4 mb-2" : "max-h-0 opacity-0"}
                `}>
                   {item.subMenu.map((subItem, subIndex) => (
                      <Link 
                        key={subIndex} 
                        href={subItem.href}
                        onClick={closeMenu}
                        // Styled as simple text links, smaller than parent
                        className="font-songer text-xl text-darker-bold-blue hover:text-bold-blue transition-colors text-center"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                </div>
              </div>
            )
          } else {
            return (
              <Link
                key={index}
                href={item.href}
                className={navLinkStyles}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            )
          }
        })}
        
        <Link href="/log-in" className={loginButtonStyles} onClick={closeMenu}>
          LOGIN
        </Link>
      </div>
    </nav>
  );
}
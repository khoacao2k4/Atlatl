"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiBookOpen, FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsCalculator } from "react-icons/bs";
import NavDropdown from "./NavDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // State for mobile resources dropdown toggle
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
    setIsMobileResourcesOpen(false); // Reset mobile sub-menu on close
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

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define Sub-menu items for Resources
  const resourceItems = [
    { 
      name: "BLOGS", 
      desc: "The latest news, updates and info", 
      href: "/blogs", 
      icon: <FiBookOpen className="w-6 h-6 md:w-8 md:h-8" /> 
    },
    { 
      name: "RESOURCES", 
      desc: "Calculators, more", 
      href: "/resources", 
      icon: <BsCalculator className="w-6 h-6 md:w-8 md:h-8" /> 
    },
    { 
      name: "FAQ", 
      desc: "Quick answers to your common questions", 
      href: "/resources/faq", 
      icon: <FiInfo className="w-6 h-6 md:w-8 md:h-8" /> 
    },
  ];

  const menuItems = [
    { name: "ABOUT US", href: "/why-atlatl" },
    { name: "SERVICES", href: "/services" },
    { name: "RESOURCES", href: "/resources", hasSubMenu: true }, // Mark this as having a submenu
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
    <nav className="w-full h-[100px] bg-white flex items-center justify-between px-6 lg:px-12 z-50">      
      {/* 1. Logo */}
      <div className="z-50">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[113px] h-[113px] object-contain"
          />
        </Link>
      </div>

      {/* 2. Desktop Menu */}
      <div className="hidden lg:flex items-center gap-10">
        {menuItems.map((item, index) => {
          if (item.hasSubMenu) {
            return (
              <NavDropdown 
                key={"dropdown-" + index}
                item={item}
                subItems={resourceItems}
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
        <Link href="/log-in" className={loginButtonStyles}>
          LOGIN
        </Link>
      </div>

      {/* 3. Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden z-50 text-3xl text-black"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* 4. Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 bg-white z-40 flex flex-col pt-[25vh] items-center gap-8
          transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {menuItems.map((item, index) => {
          if (item.hasSubMenu) {
            // --- MOBILE RESOURCES ACCORDION ---
            return (
              <div key={index} className="flex flex-col items-center w-full">
                <button 
                  onClick={() => setIsMobileResourcesOpen(!isMobileResourcesOpen)}
                  className={`${navLinkStyles} relative`}
                >
                  {item.name}
                  
                  {/* Arrow (Absolute Positioned to keep text centered) */}
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                    <img 
                      src="/images/graphic_arrow.svg" 
                      alt="toggle"
                      className={`w-4 h-auto object-contain transition-transform duration-300 
                        ${isMobileResourcesOpen ? "-rotate-90" : "rotate-90"}`}
                    />
                  </div>
                </button>
                
                <div className={`
                    flex flex-col gap-4 w-full transition-all duration-300 ease-in-out overflow-hidden
                    ${isMobileResourcesOpen ? "max-h-[200px] opacity-100 mt-4 mb-2" : "max-h-0 opacity-0"}
                `}>
                   {resourceItems.map((subItem, subIndex) => (
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
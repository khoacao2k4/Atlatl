"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => { // Ensure scroll is disabled when menu is open
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

  useEffect(() => { // Close menu on resize, fix the bug when the menu is open + reisze to large -->cannot scroll
    const handleResize = () => {
      // Tailwind's 'lg' breakpoint is usually 1024px
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "ABOUT US", href: "/why-atlatl" },
    { name: "SERVICES", href: "/services" },
    { name: "RESOURCES", href: "/resources" },
    { name: "CONTACT US", href: "/contact-us" },
  ];

  const navLinkStyles = `
    text-black font-songer leading-none group transition duration-300 ease-in-out hover:text-bold-blue
    text-lg max-lg:text-3xl 
  `;
  const underlineStyles = `
    mt-[3px] block h-0.5 bg-bold-blue transition-all duration-300 
    max-w-0 group-hover:max-w-full
  `;
  const loginButtonStyles = `
    py-3 px-8 bg-bold-blue shadow-md rounded-full
    text-white font-bold font-songer text-lg text-center

    hover:bg-white hover:text-bold-blue hover:cursor-pointer hover:ring-2 hover:ring-bold-blue
    transition-all duration-300 transform
    
    // Mobile specific sizing
    max-lg:text-3xl max-lg:w-3/4 max-lg:h-[60px]
  `;

  return (
    <nav className="w-full h-[100px] bg-white flex items-center justify-between px-6 lg:px-12 border-b border-[#e5e5e5] z-50">
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
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} className={navLinkStyles}>
            {item.name}
            <span className={underlineStyles} />
          </Link>
        ))}
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
          fixed inset-0 bg-white z-40 flex flex-col justify-center items-center gap-12
          transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={navLinkStyles}
            onClick={closeMenu}
          >
            {item.name}
            <span className={underlineStyles} />
          </Link>
        ))}
        <Link href="/log-in" className={loginButtonStyles} onClick={closeMenu}>
          LOGIN
        </Link>
      </div>
    </nav>
  );
}
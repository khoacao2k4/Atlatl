"use client";

import Link from "next/link";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { FaRegEnvelope, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const quickLinkItems = [
    { name: "Home", href: "/" },
    { name: "Why Atlatl", href: "/why-atlatl" },
    { name: "Our Services", href: "/" },
    { name: "Meet The Team", href: "/" },
    { name: "Client Experience", href: "/" },
    { name: "Contact Us", href: "/" },
    { name: "FAQ", href: "/" },
    { name: "Blog", href: "/" },
  ];

  const moreInfoItems = [
    { name: "Privacy Policy", href: "/" },
    { name: "From ADV2A", href: "/" },
    { name: "From CRS", href: "/" },
  ];

  const headingStyles = "font-songer text-3xl mb-4";
  const underlineStyles = `
    block h-0.5 bg-white transition-all duration-300 
    max-w-0 group-hover:max-w-full
  `;
  const listItemStyles = "flex items-center gap-5";

  return (
    <footer
      className="
      relative w-full bg-dark-blue text-white font-work-sans
      p-12
      flex flex-col gap-10 lg:flex-row lg:justify-around lg:items-start
    "
    >
      {/* Column 1: Atlatl Advisers Information */}
      <div className="flex flex-col gap-2">
        <h1 className={headingStyles}>ATLATL ADVISERS</h1>
        <ul className="flex flex-col gap-2 text-base">
          <li className={listItemStyles}>
            <FaLocationDot size={20}/>
            <div>
              2921 Landmark Pl, Suite 501, Madison, WI 53713
            </div>
          </li>
          <li className={listItemStyles}>
            <FaRegEnvelope size={20}/>
            <Link href="mailto:info@atlantladvisers.com" className="group">
              info@atlantladvisers.com
              <span className={underlineStyles} />
            </Link>
          </li>
          <li className={listItemStyles}>
            <FaPhone size={20}/>
            <Link href="tel:6083514500" className="group">
              608-351-4500
              <span className={underlineStyles} />
            </Link>
          </li>
        </ul>
      </div>

      {/* Column 2: Quick Links */}
      <div>
        <h1 className={headingStyles}>QUICK LINKS</h1>
        <nav className="flex flex-col items-start gap-2 text-base">
          {quickLinkItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group"
              >
                {item.name}
                <span className={underlineStyles} />
              </Link>
            ))}
        </nav>
      </div>

      {/* Column 3: More Information */}
      <div>
        <h1 className={headingStyles}>MORE INFORMATION</h1>
        <nav className="flex flex-col items-start gap-2 text-base">
          {moreInfoItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group"
              >
                {item.name}
                <span className={underlineStyles} />
              </Link>
            ))}
        </nav>
      </div>

      {/* Column 4: Connect With Us */}
      <div>
        <h1 className={headingStyles}>CONNECT WITH US</h1>
        <div className="flex gap-2 text-[30px]">
          <Link
            href="https://www.linkedin.com/company/atlatladvisers/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            <FaLinkedin />
          </Link>
          <Link
            href="https://www.instagram.com/atlatladvisers/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            <FaInstagram />
          </Link>
        </div>
      </div>

      {/* Copyright Footer */}
      {/* Mobile: Static position, centered, with margin top.
          Desktop (lg+): Absolute position bottom right
      */}
      <div
        className="
        text-white text-base mt-8 text-center
        lg:absolute lg:bottom-2.5 lg:right-5 lg:mt-0
        flex flex-col gap-2
        "
      >
        <div className="flex justify-center gap-5">
          <img src="/app-store.svg" alt="App Store" className="w-[150px]" />
          <img src="/google-play.svg" alt="Google Play" className="w-[200px]" />
        </div>
        <p>© 2025 Atlatl Advisers. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo with Link to Home */}
      <div className="navbar-logo">
        <Link href="/">
          <img src="/logo.png" alt="Logo" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link href="/about-us">About Us</Link>
        <Link href="/services">Services</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/contact-us">Contact Us</Link>
        <Link href="/log-in" className="login-button">Log In</Link>
      </div>
    </nav>
  );
}

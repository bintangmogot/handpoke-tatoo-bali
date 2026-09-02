"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "FAQ", href: "/faq" },
    { name: "Journal", href: "/blog" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "glass-panel shadow-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-heading font-bold text-2xl tracking-wider text-primary group-hover:text-accent transition-colors">
            DOTLINETATTU
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-secondary hover:text-accent transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/booking"
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-medium text-sm rounded-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_20px_rgba(234,88,12,0.5)]"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary p-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className={`md:hidden bg-surface border-t border-border transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-64' : 'max-h-0'}`}>
          <div className="flex flex-col px-4 py-4 space-y-4">
            <Link href="/about" className="text-secondary hover:text-accent transition-colors font-sans text-xs tracking-widest uppercase py-2">About</Link>
            <Link href="/services" className="text-secondary hover:text-accent transition-colors font-sans text-xs tracking-widest uppercase py-2">Services</Link>
            <Link href="/gallery" className="text-secondary hover:text-accent transition-colors font-sans text-xs tracking-widest uppercase py-2">Gallery</Link>
            <Link href="/blog" className="text-secondary hover:text-accent transition-colors font-sans text-xs tracking-widest uppercase py-2">Journal</Link>
            <Link href="/faq" className="text-secondary hover:text-accent transition-colors font-sans text-xs tracking-widest uppercase py-2">FAQ</Link>
            <Link href="/booking" className="text-accent font-bold font-sans text-xs tracking-widest uppercase py-2">Book Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}

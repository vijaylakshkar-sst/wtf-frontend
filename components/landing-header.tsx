"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MenuIcon } from "@/components/icons";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header className={`site-header container${isScrolled || isMenuOpen ? " scrolled" : ""}`}>
      <Link className="logo" href="/" aria-label="WTF home">wtf?</Link>
      <nav className={`desktop-nav${isMenuOpen ? " open" : ""}`} aria-label="Main navigation">
        <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it works</a>
        <a href="#for-builders" onClick={() => setIsMenuOpen(false)}>For builders</a>
        <a href="#for-suppliers" onClick={() => setIsMenuOpen(false)}>For suppliers</a>
        <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
      </nav>
      <Link className="button button-small button-cream" href="/sign-in">Sign in</Link>
      <button className="mobile-menu" aria-expanded={isMenuOpen} aria-label="Toggle navigation" onClick={() => setIsMenuOpen((open) => !open)}><MenuIcon /></button>
    </header>
  );
}

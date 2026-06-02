"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MenuIcon } from "@/components/icons";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header className={`site-header container${isScrolled ? " scrolled" : ""}`}>
      <Link className="logo" href="/" aria-label="WTF home">wtf?</Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#how-it-works">How it works</a>
        <a href="#for-builders">For builders</a>
        <a href="#for-suppliers">For suppliers</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <Link className="button button-small button-cream" href="/sign-in">Sign in</Link>
      <button className="mobile-menu" aria-label="Open navigation"><MenuIcon /></button>
    </header>
  );
}

import Link from "next/link";

const footerLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#for-builders", label: "For builders" },
  { href: "/#for-suppliers", label: "For suppliers" },
  { href: "/sign-in", label: "Sign in" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link className="logo" href="/" aria-label="WTF home">wtf?</Link>
          <small>&copy; {new Date().getFullYear()} WTF? All rights reserved.</small>
        </div>
        <nav aria-label="Footer navigation">
          {footerLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}

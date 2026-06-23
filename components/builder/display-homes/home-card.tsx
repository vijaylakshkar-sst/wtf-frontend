"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EditIcon, EyeIcon, MapPinIcon, MoreIcon } from "@/components/icons";
import { displayHomeSlug, type DisplayHome } from "@/components/builder/display-homes/data";

export function HomeCard({ home }: { home: DisplayHome }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const statusClass = home.status.toLowerCase().replace(" ", "-");

  useEffect(() => {
    const closeMenu = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeMenu);

    return () => document.removeEventListener("pointerdown", closeMenu);
  }, []);

  return (
    <article className="home-card">
      <div className="home-image" style={{ backgroundImage: `url("${home.image}")`, backgroundPosition: home.position }}>
        <span className={`home-status ${statusClass}`}>{home.status}</span>
        <div className="home-actions" ref={menuRef}>
          <button
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            aria-label={`More options for ${home.name}`}
            className="home-more-button"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            <MoreIcon size={17} />
          </button>
          {isMenuOpen ? (
            <div className="home-action-menu" role="menu">
              <button onClick={() => { setIsMenuOpen(false); router.push("/builder/display-homes/create"); }} role="menuitem" type="button">
                <EditIcon size={15} /> Edit
              </button>
              <button onClick={() => { setIsMenuOpen(false); router.push(`/builder/display-homes/${displayHomeSlug(home.name)}`); }} role="menuitem" type="button">
                <EyeIcon size={15} /> Preview
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="home-card-body">
        <h2>{home.name}</h2>
        <p className="home-address"><MapPinIcon size={12} /> {home.address}</p>
        <div className="home-numbers">
          <span><strong>{home.visits}</strong><small>Visits</small></span>
          <span><strong>{home.leads}</strong><small>Leads</small></span>
          <span><strong>{home.rooms}</strong><small>Rooms</small></span>
        </div>
        <div className="home-progress-copy"><span>Tagged products<strong>{home.products}</strong></span><span>Setup completion<strong>{home.completion}%</strong></span></div>
        <div className="home-progress"><i style={{ width: `${home.completion}%` }} /></div>
      </div>
    </article>
  );
}

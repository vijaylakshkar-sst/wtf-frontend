import { ChartIcon, EditIcon, EyeIcon, MapPinIcon, MoreIcon } from "@/components/icons";
import type { displayHomes } from "@/components/builder/display-homes/data";

type DisplayHome = (typeof displayHomes)[number];

export function HomeCard({ home }: { home: DisplayHome }) {
  const statusClass = home.status.toLowerCase().replace(" ", "-");

  return (
    <article className="home-card">
      <div className="home-image" style={{ backgroundImage: `url("${home.image}")`, backgroundPosition: home.position }}>
        <span className={`home-status ${statusClass}`}>{home.status}</span>
        <button aria-label={`More options for ${home.name}`}><MoreIcon size={17} /></button>
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
      <footer>
        <a href="#"><ChartIcon size={14} /> Analytics</a>
        <a href="#"><EditIcon size={14} /> Edit</a>
        <a href="#"><EyeIcon size={14} /> Preview</a>
        <button aria-label={`More actions for ${home.name}`}><MoreIcon size={15} /></button>
      </footer>
    </article>
  );
}

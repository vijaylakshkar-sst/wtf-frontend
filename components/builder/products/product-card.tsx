import { ChartIcon, CheckIcon, EditIcon, EyeIcon, MoreIcon, SparklesIcon, FlagIcon } from "@/components/icons";
import type { Product } from "@/components/builder/products/data";

const statusLabels = {
  Verified: "Verified & live",
  "AI mapped": "AI mapped",
  Flagged: "Flagged",
  Draft: "Draft",
};

export function ProductCard({ product, onAction }: { product: Product; onAction: (action: string) => void }) {
  const statusClass = product.status.toLowerCase().replace(" ", "-");

  return (
    <article className={`product-card ${statusClass}`}>
      <div className="product-card-image" style={{ backgroundImage: `url("${product.image}")`, backgroundPosition: product.imagePosition }}>
        <span>{product.status}</span>
        <button aria-label={`More options for ${product.name}`} onClick={() => onAction(`Opened menu for ${product.name}`)} type="button"><MoreIcon size={17} /></button>
      </div>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p>{product.supplier}</p>
        <small>{product.room} <b>&bull;</b> {product.category}</small>
        <em><StatusIcon status={product.status} /> {statusLabels[product.status]}</em>
      </div>
      <footer>
        <button onClick={() => onAction(`Viewing ${product.name}`)} type="button"><EyeIcon size={14} /> View</button>
        <button onClick={() => onAction(`Editing ${product.name}`)} type="button"><EditIcon size={14} /> Edit</button>
        {product.status === "Flagged" ? (
          <>
            <button onClick={() => onAction(`Mapping ${product.name}`)} type="button"><SparklesIcon size={14} /> Map product</button>
            <button onClick={() => onAction(`Reviewing ${product.name}`)} type="button"><FlagIcon size={14} /> Review</button>
          </>
        ) : (
          <button onClick={() => onAction(`Opening analytics for ${product.name}`)} type="button"><ChartIcon size={14} /> Analytics</button>
        )}
        <button aria-label={`More actions for ${product.name}`} onClick={() => onAction(`Opened actions for ${product.name}`)} type="button"><MoreIcon size={14} /></button>
      </footer>
    </article>
  );
}

function StatusIcon({ status }: { status: Product["status"] }) {
  if (status === "Flagged") return <FlagIcon size={13} />;
  if (status === "AI mapped") return <SparklesIcon size={13} />;
  return <CheckIcon size={13} />;
}

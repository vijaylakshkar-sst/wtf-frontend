import { useEffect, useRef, useState } from "react";
import { CheckIcon, EditIcon, EyeIcon, MoreIcon, SparklesIcon, FlagIcon, FilterIcon } from "@/components/icons";
import type { Product } from "@/components/builder/products/data";

export function ProductCard({
  product,
  onEditRequest,
  onViewRequest,
  onMapRequest,
  onStatusRequest,
}: {
  product: Product;
  onEditRequest: (product: Product) => void;
  onViewRequest: (product: Product) => void;
  onMapRequest: (product: Product) => void;
  onStatusRequest: (product: Product) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const statusClass = product.status.toLowerCase().replace(" ", "-");

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <article className={`product-card ${statusClass}`} ref={menuRef}>
      <div className="product-card-image" style={{ backgroundImage: `url("${product.image}")`, backgroundPosition: product.imagePosition }}>
        <span className={`product-card-status ${statusClass}`}>
          <StatusIcon status={product.status} />
          {product.status}
        </span>
        <button aria-label={`More options for ${product.name}`} onClick={() => setIsMenuOpen((current) => !current)} type="button"><MoreIcon size={17} /></button>
      </div>
      {isMenuOpen ? (
        <div className="product-card-menu" role="menu">
          <button onClick={() => { onViewRequest(product); setIsMenuOpen(false); }} type="button"><EyeIcon size={14} /> View</button>
          <button onClick={() => { onEditRequest(product); setIsMenuOpen(false); }} type="button"><EditIcon size={14} /> Edit</button>
          {product.status === "Flagged" ? (
            <button onClick={() => { onMapRequest(product); setIsMenuOpen(false); }} type="button"><SparklesIcon size={14} /> Map</button>
          ) : null}
          <button onClick={() => { onStatusRequest(product); setIsMenuOpen(false); }} type="button"><FilterIcon size={14} /> Update status</button>
        </div>
      ) : null}
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p>{product.supplier}</p>
        <small>{product.room} <b>&bull;</b> {product.category}</small>
      </div>
    </article>
  );
}

function StatusIcon({ status }: { status: Product["status"] }) {
  if (status === "Flagged") return <FlagIcon size={13} />;
  if (status === "AI mapped") return <SparklesIcon size={13} />;
  return <CheckIcon size={13} />;
}

"use client";

import { useMemo, useState } from "react";
import { PdfPanel } from "@/components/builder/products/upload-pdf/pdf-panel";
import { extractedProducts } from "@/components/builder/display-homes/create/workflow-data";
import { SparklesIcon } from "@/components/icons";
import { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";

type ProductStatus = (typeof extractedProducts)[number]["status"] | "mapped";
type ProductItem = (typeof extractedProducts)[number] & {
  status: ProductStatus;
};

type AiProductResultsStepProps = {
  onMapProduct?: () => void;
};

const initialProducts: ProductItem[] = extractedProducts.map((product) => ({
  ...product,
  status: product.status === "flagged" ? "flagged" : product.status,
}));

export function AiProductResultsStep({ onMapProduct = () => {} }: AiProductResultsStepProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [notice, setNotice] = useState("Review the extracted products before publishing.");

  const approvedCount = useMemo(
    () => products.filter((product) => product.status === "approved" || product.status === "mapped").length,
    [products],
  );

  const approveProduct = (productName: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.name === productName
          ? { ...product, status: product.status === "flagged" ? "mapped" : "approved" }
          : product,
      ),
    );
    setNotice(`${productName} approved.`);
  };

  const verifyAll = () => {
    setProducts((current) => current.map((product) => ({ ...product, status: product.status === "flagged" ? "mapped" : "approved" })));
    setNotice("All extracted products approved.");
  };

  const handleMapProduct = (productName: string) => {
    approveProduct(productName);
    onMapProduct();
  };

  return (
    <StepShell step={createDisplayHomeSteps[6]}>
      <div className="create-home-ai-callout">
        <SparklesIcon size={22} />
        <div>
          <strong>AI-powered Products</strong>
          <p>Upload your Products - AI identifies products,category, product codes, colors. You review before publishing.</p>
        </div>
      </div>

      <PdfPanel
        index="04"
        title="AI extracted products"
        action={<button onClick={verifyAll} type="button">Verify all</button>}
      >
        <div className="pdf-panel-note">{approvedCount} of {products.length} products approved</div>
        <div className="pdf-extracted-list">
          {products.map((product) => {
            const isApproved = product.status === "approved" || product.status === "mapped";
            const buttonLabel = product.status === "flagged" ? "Map & Approve" : isApproved ? "Approved" : "Approve";

            return (
              <article className={product.status} key={product.name}>
                <span style={{ backgroundImage: `url("${product.image}")` }} />
                <div>
                  <strong>{product.name}</strong>
                  <small>
                    {product.code} - {product.supplier} - {product.confidence}
                  </small>
                  <em>{product.status === "approved" ? "AI matched" : product.status === "pending" ? "No image" : "Flagged"}</em>
                </div>
                <button
                  disabled={isApproved}
                  onClick={() =>
                    product.status === "flagged" ? handleMapProduct(product.name) : approveProduct(product.name)
                  }
                  type="button"
                >
                  {buttonLabel}
                </button>
              </article>
            );
          })}
        </div>
      </PdfPanel>

      <div className="product-pdf-notice">{notice}</div>
    </StepShell>
  );
}

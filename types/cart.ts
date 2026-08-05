/** A snapshot of a chosen add-on. Name and price are kept for display; `key` is authoritative. */
export interface SelectedAddOn {
  key: string;
  name: string;
  price: number;
}

export interface CartItem {
  /**
   * Identifies a cart line. The same product with different add-ons is a different line at a
   * different price, so the product id alone is not enough to key on.
   */
  lineId: string;
  productId: string;
  name: string;
  slug: string;
  /** The product's own price, before add-ons. */
  basePrice: number;
  /** basePrice plus every selected add-on — the per-unit price actually charged. */
  price: number;
  addOns: SelectedAddOn[];
  image: string | null;
  quantity: number;
}

/**
 * Add-on keys are sorted so that picking B then C and picking C then B collapse onto the same
 * cart line instead of creating two identical-looking entries.
 */
export function buildLineId(productId: string, addOnKeys: string[]) {
  if (addOnKeys.length === 0) return productId;
  return `${productId}::${[...addOnKeys].sort().join(",")}`;
}

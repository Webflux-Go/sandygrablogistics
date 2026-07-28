const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

// Prices are stored in kobo (Paystack's smallest unit) throughout — this is the one place that
// converts back to Naira for display.
export function formatNaira(kobo: number) {
  return nairaFormatter.format(kobo / 100);
}

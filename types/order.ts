export interface CheckoutContactInfo {
  email: string;
  name: string;
  phone: string;
  address: string;
}

// Payment status — owned by the Paystack callback/webhook. Never written by admin UI.
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

// Fulfillment status — owned by the admin dashboard. Deliberately a separate column so a
// retried Paystack webhook can't stomp an admin's progress.
export type FulfillmentStatus =
  | "unfulfilled"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export const FULFILLMENT_STATUSES: FulfillmentStatus[] = [
  "unfulfilled",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export type OrderEmailKind = "confirmation" | "status_update" | "admin_alert";

export interface OrderItemRecord {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderEmailRecord {
  id: string;
  kind: OrderEmailKind;
  recipient: string;
  subject: string;
  status: "sent" | "failed";
  error: string | null;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  email: string;
  status: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paystackReference: string | null;
  totalAmount: number;
  currency: string;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  createdAt: string;
}

export interface OrderWithDetails extends OrderRecord {
  items: OrderItemRecord[];
  emails: OrderEmailRecord[];
}

export interface OrderStats {
  totalRevenue: number;
  orderCount: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  unfulfilledCount: number;
}

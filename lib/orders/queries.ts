import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  OrderRecord,
  OrderWithDetails,
  OrderItemRecord,
  OrderEmailRecord,
  OrderStats,
  PaymentStatus,
} from "@/types/order";

// Every caller here is already gated — by getAdminUser() on the admin side, or by an unguessable
// Paystack reference on the customer side — so these use the service-role client, matching how
// orders are read/written everywhere else (guest checkout leaves no auth.uid() for RLS to scope).

const ORDER_COLUMNS =
  "id, email, status, fulfillment_status, paystack_reference, total_amount, currency, shipping_name, shipping_phone, shipping_address, created_at";

type OrderRow = {
  id: string;
  email: string;
  status: PaymentStatus;
  fulfillment_status: OrderRecord["fulfillmentStatus"];
  paystack_reference: string | null;
  total_amount: number;
  currency: string;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  created_at: string;
};

function mapOrder(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    fulfillmentStatus: row.fulfillment_status,
    paystackReference: row.paystack_reference,
    totalAmount: row.total_amount,
    currency: row.currency,
    shippingName: row.shipping_name,
    shippingPhone: row.shipping_phone,
    shippingAddress: row.shipping_address,
    createdAt: row.created_at,
  };
}

export async function listOrders(statusFilter?: PaymentStatus): Promise<OrderRecord[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  let query = supabase.from("orders").select(ORDER_COLUMNS).order("created_at", { ascending: false });
  if (statusFilter) query = query.eq("status", statusFilter);

  const { data, error } = await query;
  if (error) {
    console.warn("[orders] listOrders failed:", error);
    return [];
  }
  return (data as OrderRow[]).map(mapOrder);
}

/**
 * A customer's own orders, newest first.
 *
 * Matches on user_id OR email: orders placed as a guest — including everything from before
 * checkout started attaching user_id — carry only the email. Supabase has verified the caller
 * owns that address, so surfacing those is correct and is what shoppers expect after signing up
 * with the address they checked out with.
 */
export async function getOrdersForUser(params: {
  userId: string;
  email: string;
}): Promise<OrderRecord[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    // The email is quoted because PostgREST parses commas and parens as filter syntax — an
    // address containing either would otherwise corrupt the expression.
    .or(`user_id.eq.${params.userId},email.eq."${params.email.replace(/"/g, '')}"`)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[orders] getOrdersForUser failed:", error);
    return [];
  }
  return (data as OrderRow[]).map(mapOrder);
}

/** Line items for a set of orders, grouped by order id — avoids a query per order in the list. */
export async function getItemsForOrders(
  orderIds: string[]
): Promise<Record<string, OrderItemRecord[]>> {
  const supabase = getSupabaseAdminClient();
  if (!supabase || orderIds.length === 0) return {};

  const { data, error } = await supabase
    .from("order_items")
    .select("id, order_id, product_id, product_name, unit_price, quantity")
    .in("order_id", orderIds);

  if (error) {
    console.warn("[orders] getItemsForOrders failed:", error);
    return {};
  }

  const grouped: Record<string, OrderItemRecord[]> = {};
  for (const row of data as {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  }[]) {
    (grouped[row.order_id] ??= []).push({
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      unitPrice: row.unit_price,
      quantity: row.quantity,
    });
  }
  return grouped;
}

export async function getOrderStats(): Promise<OrderStats> {
  const empty: OrderStats = {
    totalRevenue: 0,
    orderCount: 0,
    paidCount: 0,
    pendingCount: 0,
    failedCount: 0,
    unfulfilledCount: 0,
  };

  const supabase = getSupabaseAdminClient();
  if (!supabase) return empty;

  const { data, error } = await supabase
    .from("orders")
    .select("status, fulfillment_status, total_amount");

  if (error) {
    console.warn("[orders] getOrderStats failed:", error);
    return empty;
  }

  const rows = data as Pick<OrderRow, "status" | "fulfillment_status" | "total_amount">[];

  return rows.reduce<OrderStats>((stats, row) => {
    stats.orderCount += 1;
    if (row.status === "paid") {
      stats.paidCount += 1;
      stats.totalRevenue += row.total_amount;
      // Only paid orders are worth chasing for fulfillment.
      if (row.fulfillment_status === "unfulfilled") stats.unfulfilledCount += 1;
    } else if (row.status === "pending") {
      stats.pendingCount += 1;
    } else if (row.status === "failed") {
      stats.failedCount += 1;
    }
    return stats;
  }, { ...empty });
}

async function attachDetails(order: OrderRecord): Promise<OrderWithDetails> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ...order, items: [], emails: [] };

  const [itemsResult, emailsResult] = await Promise.all([
    supabase
      .from("order_items")
      .select("id, product_id, product_name, unit_price, quantity")
      .eq("order_id", order.id),
    supabase
      .from("order_emails")
      .select("id, kind, recipient, subject, status, error, created_at")
      .eq("order_id", order.id)
      .order("created_at", { ascending: false }),
  ]);

  const items: OrderItemRecord[] = (itemsResult.data ?? []).map((row) => ({
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    unitPrice: row.unit_price,
    quantity: row.quantity,
  }));

  const emails: OrderEmailRecord[] = (emailsResult.data ?? []).map((row) => ({
    id: row.id,
    kind: row.kind,
    recipient: row.recipient,
    subject: row.subject,
    status: row.status,
    error: row.error,
    createdAt: row.created_at,
  }));

  return { ...order, items, emails };
}

export async function getOrderWithDetails(orderId: string): Promise<OrderWithDetails | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) return null;
  return attachDetails(mapOrder(data as OrderRow));
}

export async function getOrderByReference(reference: string): Promise<OrderWithDetails | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (error || !data) return null;
  return attachDetails(mapOrder(data as OrderRow));
}

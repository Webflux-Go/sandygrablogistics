"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/auth/admin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getOrderWithDetails } from "@/lib/orders/queries";
import { sendStatusUpdate } from "@/lib/email/notifications";
import { FULFILLMENT_STATUSES, type FulfillmentStatus } from "@/types/order";

export interface AdminActionResult {
  error: string | null;
}

export async function updateFulfillmentStatus(
  orderId: string,
  status: FulfillmentStatus
): Promise<AdminActionResult> {
  // Re-checked here, not just in the (protected) layout — a Server Action can be invoked
  // directly, so the page-level gate alone is not an authorization boundary.
  const admin = await getAdminUser();
  if (!admin) return { error: "Not authorized." };

  if (!FULFILLMENT_STATUSES.includes(status)) {
    return { error: "Unknown status." };
  }

  const existing = await getOrderWithDetails(orderId);
  if (!existing) return { error: "Order not found." };
  if (existing.fulfillmentStatus === status) return { error: null };

  const supabase = getSupabaseAdminClient();
  if (!supabase) return { error: "Database isn't configured." };

  const { error } = await supabase
    .from("orders")
    .update({ fulfillment_status: status })
    .eq("id", orderId);

  if (error) {
    console.warn("[admin] updateFulfillmentStatus failed:", error);
    return { error: "Could not update the order." };
  }

  await sendStatusUpdate({ ...existing, fulfillmentStatus: status });

  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${orderId}`);

  return { error: null };
}

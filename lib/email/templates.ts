import { formatNaira } from "@/lib/format";
import type { FulfillmentStatus, OrderItemRecord, OrderRecord } from "@/types/order";

export interface EmailContent {
  subject: string;
  html: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(heading: string, body: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#171717;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
      <p style="margin:0 0 24px;font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#737373;">Sandygrabs</p>
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;">${escapeHtml(heading)}</h1>
      ${body}
    </div>
  </body>
</html>`;
}

function itemsTable(items: OrderItemRecord[], totalAmount: number) {
  const rows = items
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;font-size:14px;">${escapeHtml(item.productName)} &times; ${item.quantity}</td>
        <td style="padding:8px 0;font-size:14px;text-align:right;">${formatNaira(item.unitPrice * item.quantity)}</td>
      </tr>`
    )
    .join("");

  return `<table style="width:100%;border-collapse:collapse;margin:16px 0;">
    ${rows}
    <tr>
      <td style="padding:12px 0 0;border-top:1px solid #e5e5e5;font-size:14px;font-weight:600;">Total</td>
      <td style="padding:12px 0 0;border-top:1px solid #e5e5e5;font-size:14px;font-weight:600;text-align:right;">${formatNaira(totalAmount)}</td>
    </tr>
  </table>`;
}

function referenceLine(order: OrderRecord) {
  if (!order.paystackReference) return "";
  return `<p style="margin:16px 0 0;font-size:12px;color:#a3a3a3;">Reference: ${escapeHtml(order.paystackReference)}</p>`;
}

export function orderConfirmationEmail(
  order: OrderRecord,
  items: OrderItemRecord[]
): EmailContent {
  const name = order.shippingName ? escapeHtml(order.shippingName.split(" ")[0]) : "there";

  return {
    subject: "Your Sandygrabs order is confirmed",
    html: layout(
      "Thanks for your order",
      `<p style="margin:0;font-size:14px;line-height:1.6;color:#525252;">Hi ${name}, we've received your payment and started preparing your order.</p>
       ${itemsTable(items, order.totalAmount)}
       ${
         order.shippingAddress
           ? `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#525252;"><strong style="color:#171717;">Delivering to</strong><br>${escapeHtml(order.shippingAddress)}</p>`
           : ""
       }
       ${referenceLine(order)}`
    ),
  };
}

const STATUS_COPY: Record<FulfillmentStatus, { subject: string; heading: string; body: string }> = {
  unfulfilled: {
    subject: "Update on your Sandygrabs order",
    heading: "Your order is being prepared",
    body: "We're getting your order ready and will let you know as soon as it ships.",
  },
  processing: {
    subject: "Your Sandygrabs order is being processed",
    heading: "We're processing your order",
    body: "Your items are being picked and packed. We'll email you again when it's on the way.",
  },
  shipped: {
    subject: "Your Sandygrabs order has shipped",
    heading: "Your order is on the way",
    body: "Your order has left our warehouse and is on its way to you.",
  },
  delivered: {
    subject: "Your Sandygrabs order has been delivered",
    heading: "Your order has arrived",
    body: "Your order has been marked as delivered. We hope you love it — reply to this email if anything isn't right.",
  },
  cancelled: {
    subject: "Your Sandygrabs order was cancelled",
    heading: "Your order has been cancelled",
    body: "This order has been cancelled. If you were charged, your refund is being processed.",
  },
  refunded: {
    subject: "Your Sandygrabs order was refunded",
    heading: "Your refund is on its way",
    body: "We've issued a refund for this order. It can take a few business days to appear on your statement.",
  },
};

export function statusUpdateEmail(order: OrderRecord): EmailContent {
  const copy = STATUS_COPY[order.fulfillmentStatus];

  return {
    subject: copy.subject,
    html: layout(
      copy.heading,
      `<p style="margin:0;font-size:14px;line-height:1.6;color:#525252;">${copy.body}</p>
       ${referenceLine(order)}`
    ),
  };
}

export function newOrderAlertEmail(
  order: OrderRecord,
  items: OrderItemRecord[]
): EmailContent {
  return {
    subject: `New order — ${formatNaira(order.totalAmount)}`,
    html: layout(
      "New paid order",
      `<p style="margin:0;font-size:14px;line-height:1.6;color:#525252;">
         <strong style="color:#171717;">${escapeHtml(order.shippingName ?? "Guest")}</strong><br>
         ${escapeHtml(order.email)}${order.shippingPhone ? `<br>${escapeHtml(order.shippingPhone)}` : ""}
       </p>
       ${itemsTable(items, order.totalAmount)}
       ${
         order.shippingAddress
           ? `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#525252;"><strong style="color:#171717;">Ship to</strong><br>${escapeHtml(order.shippingAddress)}</p>`
           : ""
       }
       ${referenceLine(order)}`
    ),
  };
}

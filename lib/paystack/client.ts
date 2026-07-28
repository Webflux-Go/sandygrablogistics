import "server-only";

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const secretKey = process.env.PAYSTACK_SECRET_KEY;

export interface InitTransactionParams {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface InitTransactionResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface VerifyTransactionResult {
  status: string;
  reference: string;
  amountKobo: number;
  currency: string;
  email: string;
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  const res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  const body = await res.json();
  if (!res.ok || body.status === false) {
    throw new Error(body.message ?? `Paystack request failed (${res.status})`);
  }

  return body.data as T;
}

export async function initTransaction(
  params: InitTransactionParams
): Promise<InitTransactionResult> {
  const data = await paystackFetch<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  return {
    authorizationUrl: data.authorization_url,
    accessCode: data.access_code,
    reference: data.reference,
  };
}

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const data = await paystackFetch<{
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer: { email: string };
  }>(`/transaction/verify/${encodeURIComponent(reference)}`);

  return {
    status: data.status,
    reference: data.reference,
    amountKobo: data.amount,
    currency: data.currency,
    email: data.customer.email,
  };
}

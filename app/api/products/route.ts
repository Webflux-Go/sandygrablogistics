import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/sanity/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const products = await getProducts({ categorySlug, search });
  return NextResponse.json({ products });
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug") || undefined;
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "6", 10) || 6, 24);
    if (!slug) {
      return NextResponse.json({ ok: false, error: "missing_slug" }, { status: 400 });
    }

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("products_external")
      .select(
        `product_id, source, title, price, currency,
         products:products!inner ( id, images, category_slug )`
      )
      .eq("source", "aliexpress")
      .eq("products.category_slug", slug)
      .order("price", { ascending: true })
      .limit(limit);
    if (error) throw error;

    const items = (data || []).map((row: any) => {
      const img = Array.isArray(row?.products?.images) ? row.products.images[0] : null;
      return {
        id: row?.products?.id || row.product_id,
        name: row?.title || "",
        name_es: row?.title || "",
        image_url: img || "",
        price_cents: typeof row?.price === "number" ? Math.round(row.price * 100) : 0,
        category_slug: slug,
      };
    });

    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

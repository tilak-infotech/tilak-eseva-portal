import { NextRequest, NextResponse } from "next/server";
import { ALL_SERVICES, CATEGORIES } from "@/lib/services-data";

export const dynamic = "force-static";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.trim();
  const limit = Math.min(parseInt(searchParams.get("limit") || "1000", 10), 600);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

  let services = ALL_SERVICES;

  if (category) {
    services = services.filter((s) => s.category === category);
  }

  if (q) {
    const lower = q.toLowerCase();
    services = services.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.summary.toLowerCase().includes(lower) ||
        s.tags.join(" ").toLowerCase().includes(lower) ||
        s.ministry.toLowerCase().includes(lower) ||
        s.subcategory?.toLowerCase().includes(lower)
    );
  }

  const total = services.length;
  const slice = services.slice(offset, offset + limit);

  return NextResponse.json({
    services: slice.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      category: s.category,
      subcategory: s.subcategory,
      summary: s.summary,
      ministry: s.ministry,
      officialPortal: s.officialPortal,
      fee: s.fee,
      serviceCharge: s.serviceCharge,
      processingTime: s.processingTime,
      popularity: s.popularity,
      tags: s.tags,
      online: s.online,
    })),
    total,
    offset,
    limit,
    categories: CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, icon: c.icon })),
  });
}

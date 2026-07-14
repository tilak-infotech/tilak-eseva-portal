import { NextRequest, NextResponse } from "next/server";
import { ALL_SERVICES, CATEGORIES } from "@/lib/services-data";

export const dynamic = "force-static";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();

  if (!q) {
    return NextResponse.json({ results: [], query: "" });
  }

  const scored: Array<{ service: typeof ALL_SERVICES[number]; score: number }> = [];

  for (const s of ALL_SERVICES) {
    let score = 0;
    const name = s.name.toLowerCase();
    const summary = s.summary.toLowerCase();
    const tags = s.tags.join(" ").toLowerCase();
    const ministry = s.ministry.toLowerCase();
    const sub = s.subcategory?.toLowerCase() || "";

    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 60;
    else if (name.includes(q)) score += 40;
    if (summary.includes(q)) score += 15;
    if (tags.includes(q)) score += 20;
    if (ministry.includes(q)) score += 10;
    if (sub.includes(q)) score += 12;
    for (const t of s.tags) {
      if (t.toLowerCase().includes(q)) score += 8;
    }

    if (score > 0) scored.push({ service: s, score });
  }

  scored.sort((a, b) => b.score - a.score || b.service.popularity - a.service.popularity);

  const results = scored.slice(0, 30).map(({ service: s, score }) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    category: s.category,
    categoryName: CATEGORIES.find((c) => c.slug === s.category)?.name,
    subcategory: s.subcategory,
    summary: s.summary,
    ministry: s.ministry,
    fee: s.fee,
    serviceCharge: s.serviceCharge,
    processingTime: s.processingTime,
    popularity: s.popularity,
    online: s.online,
    score,
  }));

  return NextResponse.json({ results, query: q, total: results.length });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

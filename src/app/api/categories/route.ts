import { NextResponse } from "next/server";
import { ALL_SERVICES, TOTAL_SERVICES } from "@/lib/services-data";
import { CATEGORIES } from "@/lib/categories";

export const dynamic = "force-static";

export async function GET() {
  const byCategory = CATEGORIES.map((c) => {
    const list = ALL_SERVICES.filter((s) => s.category === c.slug);
    return {
      slug: c.slug,
      name: c.name,
      shortName: c.shortName,
      icon: c.icon,
      accent: c.accent,
      ministry: c.ministry,
      description: c.description,
      count: list.length,
    };
  });

  return NextResponse.json({
    totalServices: TOTAL_SERVICES,
    totalCategories: CATEGORIES.length,
    categories: byCategory,
  });
}

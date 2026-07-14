import { NextResponse } from "next/server";
import { ALL_SERVICES, TOTAL_SERVICES } from "@/lib/services-data";
import { CATEGORIES } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET() {
  const onlineCount = ALL_SERVICES.filter((s) => s.online).length;
  const categoryCounts = CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: ALL_SERVICES.filter((s) => s.category === c.slug).length,
  }));

  // Ministries count
  const ministries = new Set(ALL_SERVICES.map((s) => s.ministry));

  return NextResponse.json({
    totalServices: TOTAL_SERVICES,
    totalCategories: CATEGORIES.length,
    totalOnlineServices: onlineCount,
    totalMinistries: ministries.size,
    categoryCounts,
    avgProcessingTime: "7-30 days",
    assistedBy: "Tilak Infotech",
    contactPhone: "+91 70196 31612",
    contactEmail: "tilakinfotech@gmail.com",
  });
}

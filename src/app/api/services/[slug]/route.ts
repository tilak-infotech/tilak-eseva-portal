import { NextRequest, NextResponse } from "next/server";
import { getServiceBySlug } from "@/lib/services-data";
import { db } from "@/lib/db";
import { incrementServiceView } from "@/lib/service-stats";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  incrementServiceView(slug).catch(() => {});

  let stats = { views: 0, applications: 0 };
  try {
    const stat = await db.serviceStat.findUnique({ where: { serviceSlug: slug } });
    if (stat) stats = { views: stat.views, applications: stat.applications };
  } catch {
    // DB not ready
  }

  return NextResponse.json({ service, stats });
}

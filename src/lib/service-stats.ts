import { db } from "@/lib/db";

const localViewCache = new Map<string, number>();

export async function incrementServiceView(slug: string) {
  // Track locally first
  localViewCache.set(slug, (localViewCache.get(slug) || 0) + 1);
  try {
    await db.serviceStat.upsert({
      where: { serviceSlug: slug },
      update: { views: { increment: 1 } },
      create: { serviceSlug: slug, views: 1 },
    });
  } catch {
    // DB may not be ready; ignore
  }
}

export async function incrementServiceApplication(slug: string) {
  try {
    await db.serviceStat.upsert({
      where: { serviceSlug: slug },
      update: { applications: { increment: 1 } },
      create: { serviceSlug: slug, applications: 1 },
    });
  } catch {
    // ignore
  }
}

export function getLocalViews(slug: string) {
  return localViewCache.get(slug) || 0;
}

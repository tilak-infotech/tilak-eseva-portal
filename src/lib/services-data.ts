// Tilak E-Seva Portal — Services catalog aggregator.
// Each category's services live in ./services/<category-slug>.ts and are merged here.

import type { GovernmentService, ServiceCategorySlug } from "./types";
import { CATEGORIES, CATEGORY_MAP } from "./categories";

import { identityDocuments } from "./services/identity-documents";
import { incomeTaxGst } from "./services/income-tax-gst";
import { citizenshipImmigration } from "./services/citizenship-immigration";
import { landProperty } from "./services/land-property";
import { educationScholarships } from "./services/education-scholarships";
import { healthFamily } from "./services/health-family";
import { employmentLabour } from "./services/employment-labour";
import { welfareSchemes } from "./services/welfare-schemes";
import { businessMsme } from "./services/business-msme";
import { transportVehicles } from "./services/transport-vehicles";
import { utilities } from "./services/utilities";
import { policeLaw } from "./services/police-law";
import { agriculture } from "./services/agriculture";
import { pensions } from "./services/pensions";
import { electionsVoting } from "./services/elections-voting";
import { seniorCitizens } from "./services/senior-citizens";
import { womenChild } from "./services/women-child";
import { certificates } from "./services/certificates";
import { courtLegal } from "./services/court-legal";
import { defenceVeterans } from "./services/defence-veterans";
import { postalBanking } from "./services/postal-banking";
import { rtiGrievances } from "./services/rti-grievances";
import { municipalLocal } from "./services/municipal-local";
import { disasterManagement } from "./services/disaster-management";
import { tourismCulture } from "./services/tourism-culture";
import { environmentForests } from "./services/environment-forests";
import { scienceTech } from "./services/science-tech";
import { foreignTrade } from "./services/foreign-trade";
import { cooperatives } from "./services/cooperatives";
import { digitalServices } from "./services/digital-services";

export const ALL_SERVICES: GovernmentService[] = [
  ...identityDocuments,
  ...incomeTaxGst,
  ...citizenshipImmigration,
  ...landProperty,
  ...educationScholarships,
  ...healthFamily,
  ...employmentLabour,
  ...welfareSchemes,
  ...businessMsme,
  ...transportVehicles,
  ...utilities,
  ...policeLaw,
  ...agriculture,
  ...pensions,
  ...electionsVoting,
  ...seniorCitizens,
  ...womenChild,
  ...certificates,
  ...courtLegal,
  ...defenceVeterans,
  ...postalBanking,
  ...rtiGrievances,
  ...municipalLocal,
  ...disasterManagement,
  ...tourismCulture,
  ...environmentForests,
  ...scienceTech,
  ...foreignTrade,
  ...cooperatives,
  ...digitalServices,
];

// Quick lookup maps
export const SERVICE_BY_SLUG = new Map(ALL_SERVICES.map((s) => [s.slug, s]));

export const SERVICES_BY_CATEGORY: Record<
  ServiceCategorySlug,
  GovernmentService[]
> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.slug] = ALL_SERVICES.filter((s) => s.category === c.slug);
    return acc;
  },
  {} as Record<ServiceCategorySlug, GovernmentService[]>
);

export function getServiceBySlug(slug: string): GovernmentService | undefined {
  return SERVICE_BY_SLUG.get(slug);
}

export function getCategory(slug: string) {
  return CATEGORY_MAP[slug as ServiceCategorySlug];
}

export function searchServices(query: string, limit = 50): GovernmentService[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored: Array<{ service: GovernmentService; score: number }> = [];
  for (const s of ALL_SERVICES) {
    let score = 0;
    const name = s.name.toLowerCase();
    const summary = s.summary.toLowerCase();
    const tags = s.tags.join(" ").toLowerCase();
    const ministry = s.ministry.toLowerCase();
    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 60;
    else if (name.includes(q)) score += 40;
    if (summary.includes(q)) score += 15;
    if (tags.includes(q)) score += 20;
    if (ministry.includes(q)) score += 10;
    for (const t of s.tags) {
      if (t.toLowerCase().includes(q)) score += 8;
    }
    if (s.subcategory?.toLowerCase().includes(q)) score += 12;
    if (score > 0) scored.push({ service: s, score });
  }
  scored.sort((a, b) => b.score - a.score || b.service.popularity - a.service.popularity);
  return scored.slice(0, limit).map((x) => x.service);
}

export function getPopularServices(limit = 12): GovernmentService[] {
  return [...ALL_SERVICES].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function getOnlineServices(limit = 50): GovernmentService[] {
  return ALL_SERVICES.filter((s) => s.online)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export const TOTAL_SERVICES = ALL_SERVICES.length;
export const TOTAL_CATEGORIES = CATEGORIES.length;

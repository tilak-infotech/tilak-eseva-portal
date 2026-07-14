// Tilak E-Seva Portal — Core types for the services catalog & applications.

export type ServiceCategorySlug =
  | "identity-documents"
  | "income-tax-gst"
  | "citizenship-immigration"
  | "land-property"
  | "education-scholarships"
  | "health-family"
  | "employment-labour"
  | "welfare-schemes"
  | "business-msme"
  | "transport-vehicles"
  | "utilities"
  | "police-law"
  | "agriculture"
  | "pensions"
  | "elections-voting"
  | "senior-citizens"
  | "women-child"
  | "certificates"
  | "court-legal"
  | "defence-veterans"
  | "postal-banking"
  | "rti-grievances"
  | "municipal-local"
  | "disaster-management"
  | "tourism-culture"
  | "environment-forests"
  | "science-tech"
  | "foreign-trade"
  | "cooperatives"
  | "digital-services";

export interface ServiceCategory {
  slug: ServiceCategorySlug;
  name: string;
  shortName: string;
  description: string;
  /** lucide-react icon name */
  icon: string;
  /** Tailwind gradient classes for the category badge */
  accent: string;
  ministry: string;
}

export interface GovernmentService {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategorySlug;
  subcategory?: string;
  /** One-line summary for cards / search results. */
  summary: string;
  /** Full description (2-4 sentences). */
  description: string;
  /** Ministry / department that owns the service. */
  ministry: string;
  /** Official portal / website. */
  officialPortal: string;
  officialUrl: string;
  /** Who can apply. */
  eligibility: string[];
  /** Documents the applicant must provide. */
  documentsRequired: string[];
  /** Fee in INR (0 means free). Use number. */
  fee: number;
  feeNote?: string;
  /** Expected processing time, human readable. */
  processingTime: string;
  /** Step-by-step how to apply. */
  howToApply: string[];
  /** Tilak Infotech service charge for assisted applications (INR). */
  serviceCharge: number;
  /** Popularity 1-100 (for sorting "popular"). */
  popularity: number;
  /** Tags for search. */
  tags: string[];
  /** Whether the citizen can apply fully online. */
  online: boolean;
}

export interface ApplicationStatusStep {
  key: string;
  label: string;
  description: string;
}

export const APPLICATION_STEPS: ApplicationStatusStep[] = [
  { key: "Submitted", label: "Submitted", description: "Application received and queued." },
  { key: "Payment Verified", label: "Payment Verified", description: "Service fee confirmed." },
  { key: "Under Review", label: "Under Review", description: "Our team is processing your request." },
  { key: "Completed", label: "Completed", description: "Service delivered. Report sent." },
];

export const STATUS_ORDER = APPLICATION_STEPS.map((s) => s.key);

export function statusStepIndex(status: string): number {
  const i = STATUS_ORDER.indexOf(status);
  return i === -1 ? 0 : i;
}

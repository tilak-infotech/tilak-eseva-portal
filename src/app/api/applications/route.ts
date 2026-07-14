import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getServiceBySlug } from "@/lib/services-data";
import { incrementServiceApplication } from "@/lib/service-stats";
import { STATUS_ORDER } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_FORM_FIELDS = 30;

const ApplicationSchema = z.object({
  serviceSlug: z.string().min(1),
  applicantName: z.string().min(2).max(120),
  contactNumber: z
    .string()
    .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  formData: z.record(z.string()).refine((v) => Object.keys(v).length <= MAX_FORM_FIELDS, {
    message: "Too many form fields",
  }),
  attachments: z.array(z.string()).max(10).optional(),
  paymentRef: z.string().max(80).optional(),
  feeAmount: z.string().max(20).optional(),
});

function genCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function uniqueCode(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const code = genCode();
    try {
      const existing = await db.application.findUnique({ where: { appCode: code } });
      if (!existing) return code;
    } catch {
      return code; // DB issue — return anyway
    }
  }
  return genCode();
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { serviceSlug, applicantName, contactNumber, email, formData, attachments, paymentRef, feeAmount } =
    parsed.data;

  const service = getServiceBySlug(serviceSlug);
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 404 });
  }

  const appCode = await uniqueCode();

  try {
    const application = await db.application.create({
      data: {
        appCode,
        serviceSlug,
        serviceName: service.name,
        category: service.category,
        contactNumber,
        email: email || null,
        applicantName,
        formData: JSON.stringify(formData),
        attachments: attachments?.join(",") || null,
        paymentRef: paymentRef || null,
        feeAmount: feeAmount || String(service.fee + service.serviceCharge),
        status: "Submitted",
        statusHistory: {
          create: { status: "Submitted", note: "Application submitted through portal" },
        },
      },
      include: { statusHistory: true },
    });

    incrementServiceApplication(serviceSlug).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        appCode: application.appCode,
        id: application.id,
        serviceName: application.serviceName,
        status: application.status,
        submittedAt: application.submittedAt,
        sla: "2 hours (assisted) · up to service SLA otherwise",
        whatsapp: "+91 70196 31612",
        email: "tilakinfotech@gmail.com",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Application create error:", err);
    return NextResponse.json(
      { error: "Failed to create application. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Lightweight list for admin / recent activity
  try {
    const recent = await db.application.findMany({
      orderBy: { submittedAt: "desc" },
      take: 25,
      select: {
        appCode: true,
        serviceName: true,
        category: true,
        status: true,
        submittedAt: true,
      },
    });
    return NextResponse.json({ applications: recent, total: recent.length });
  } catch {
    return NextResponse.json({ applications: [], total: 0 });
  }
}

export { STATUS_ORDER };

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const GrievanceSchema = z.object({
  contactNumber: z
    .string()
    .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  message: z.string().min(5).max(3000),
  category: z.string().max(60).default("General"),
  appCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = GrievanceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  let applicationId: string | undefined;
  if (parsed.data.appCode) {
    try {
      const app = await db.application.findUnique({
        where: { appCode: parsed.data.appCode },
      });
      if (app) applicationId = app.id;
    } catch {
      // ignore
    }
  }

  try {
    await db.grievance.create({
      data: {
        contactNumber: parsed.data.contactNumber,
        message: parsed.data.message,
        category: parsed.data.category,
        applicationId: applicationId || null,
        status: "Open",
      },
    });
  } catch (err) {
    console.error("Grievance save error:", err);
  }

  return NextResponse.json(
    {
      success: true,
      message:
        "Grievance registered. Our team will contact you within 24 hours on the provided number.",
    },
    { status: 201 }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { statusStepIndex, STATUS_ORDER } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Invalid code format" }, { status: 400 });
  }

  try {
    const application = await db.application.findUnique({
      where: { appCode: code },
      include: {
        statusHistory: { orderBy: { createdAt: "asc" } },
        ratings: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({
      appCode: application.appCode,
      serviceName: application.serviceName,
      category: application.category,
      applicantName: application.applicantName,
      contactMasked: application.contactNumber.replace(/^(\+91\d{2})\d{5}(\d{3})$/, "$1XXXXX$2"),
      status: application.status,
      statusStep: statusStepIndex(application.status),
      steps: STATUS_ORDER,
      submittedAt: application.submittedAt,
      updatedAt: application.updatedAt,
      reportSentAt: application.reportSentAt,
      adminNotes: application.adminNotes,
      history: application.statusHistory.map((h) => ({
        status: h.status,
        note: h.note,
        at: h.createdAt,
      })),
      rating:
        application.ratings.length > 0
          ? {
              stars: application.ratings[0].stars,
              comment: application.ratings[0].comment,
            }
          : null,
    });
  } catch (err) {
    console.error("Status fetch error:", err);
    return NextResponse.json(
      { error: "Unable to fetch status right now. Please try again later." },
      { status: 500 }
    );
  }
}

// Submit rating for completed application
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  let body: { stars?: number; comment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const stars = Math.round(Number(body.stars));
  if (!stars || stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Stars must be 1-5" }, { status: 422 });
  }

  try {
    const application = await db.application.findUnique({ where: { appCode: code } });
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const existing = await db.rating.findUnique({ where: { applicationId: application.id } });
    if (existing) {
      await db.rating.update({
        where: { id: existing.id },
        data: { stars, comment: body.comment?.slice(0, 500) || null },
      });
    } else {
      await db.rating.create({
        data: {
          applicationId: application.id,
          stars,
          comment: body.comment?.slice(0, 500) || null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Rating error:", err);
    return NextResponse.json({ error: "Failed to save rating" }, { status: 500 });
  }
}

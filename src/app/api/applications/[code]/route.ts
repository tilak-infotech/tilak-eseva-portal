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

    // Sync status from Google Sheets/Apps Script if configured
    const appscriptUrl = process.env.APPSCRIPT_URL;
    if (appscriptUrl && appscriptUrl.includes("macros/s/")) {
      try {
        const sheetRes = await fetch(`${appscriptUrl}?action=status&code=${code}`, {
          signal: AbortSignal.timeout(3500), // 3.5 seconds timeout
        });
        if (sheetRes.ok) {
          const sheetData = await sheetRes.json();
          if (sheetData.success && sheetData.status) {
            const statusFromSheet = sheetData.status;
            const adminNotesFromSheet = sheetData.adminNotes || null;
            const reportSentAtFromSheet = sheetData.reportSentAt || null;

            if (statusFromSheet !== application.status) {
              await db.application.update({
                where: { id: application.id },
                data: {
                  status: statusFromSheet,
                  adminNotes: adminNotesFromSheet || application.adminNotes,
                  reportSentAt: reportSentAtFromSheet ? new Date(reportSentAtFromSheet) : application.reportSentAt,
                  statusHistory: {
                    create: {
                      status: statusFromSheet,
                      note: `Status synchronized from Google Sheets: ${adminNotesFromSheet || "Updated by administrator"}`,
                    },
                  },
                },
              });

              // Update in-memory references
              application.status = statusFromSheet;
              application.adminNotes = adminNotesFromSheet || application.adminNotes;
              if (reportSentAtFromSheet) {
                application.reportSentAt = new Date(reportSentAtFromSheet);
              }
              const updatedHistory = await db.statusEvent.findMany({
                where: { applicationId: application.id },
                orderBy: { createdAt: "asc" },
              });
              application.statusHistory = updatedHistory;
            }
          }
        }
      } catch (err) {
        console.error("Apps Script status sync error:", err);
      }
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

    const existing = await db.rating.findFirst({ where: { applicationId: application.id } });
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

    // Forward rating to Google Sheets/Apps Script
    const appscriptUrl = process.env.APPSCRIPT_URL;
    if (appscriptUrl && appscriptUrl.includes("macros/s/")) {
      fetch(appscriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rating",
          appCode: code,
          rating: stars,
          comment: body.comment || "",
        }),
      }).catch((err) => {
        console.error("Apps Script rating forward error:", err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Rating error:", err);
    return NextResponse.json({ error: "Failed to save rating" }, { status: 500 });
  }
}

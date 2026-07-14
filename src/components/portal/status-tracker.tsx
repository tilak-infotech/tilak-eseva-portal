"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  PackageCheck,
  Star,
  Send,
  AlertCircle,
} from "lucide-react";

import type { ApplicationStatusStep } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialCode?: string;
}

interface StatusResponse {
  appCode?: string;
  serviceName?: string;
  category?: string;
  applicantName?: string;
  contactMasked?: string;
  status?: string;
  statusStep?: number;
  steps?: string[];
  submittedAt?: string;
  updatedAt?: string;
  reportSentAt?: string | null;
  adminNotes?: string | null;
  history?: Array<{ status: string; note: string | null; at: string }>;
  rating?: { stars: number; comment: string | null } | null;
  error?: string;
}

const STEP_ICONS = [FileText, ShieldCheck, Clock, PackageCheck];

export function StatusTracker({ open, onOpenChange, initialCode }: Props) {
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<StatusResponse | null>(null);
  const [stars, setStars] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [submittingRating, setSubmittingRating] = React.useState(false);

  React.useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      onOpenChange(true);
      setTimeout(() => doSearch(initialCode), 200);
    }
  }, [initialCode]);

  React.useEffect(() => {
    if (!open) {
      setData(null);
      setStars(0);
      setComment("");
    }
  }, [open]);

  const doSearch = async (c?: string) => {
    const query = (c || code).trim();
    if (!/^\d{6}$/.test(query)) {
      toast.error("Enter a valid 6-digit tracking code");
      return;
    }
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`/api/applications/${query}`);
      const json: StatusResponse = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Application not found");
        return;
      }
      setData(json);
      if (json.rating) {
        setStars(json.rating.stars);
        setComment(json.rating.comment || "");
      }
    } catch {
      toast.error("Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (!data?.appCode || stars < 1) {
      toast.error("Select a star rating (1-5)");
      return;
    }
    setSubmittingRating(true);
    try {
      const res = await fetch(`/api/applications/${data.appCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars, comment }),
      });
      if (!res.ok) {
        toast.error("Could not save rating");
        return;
      }
      toast.success("Thank you for your feedback!");
    } catch {
      toast.error("Network error");
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[92vh] w-[95vw] max-w-lg overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b p-5">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Track Your Application
          </DialogTitle>
          <DialogDescription>
            Enter the 6-digit code you received on submission.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          <div className="mb-4 flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="e.g. 847291"
              inputMode="numeric"
              className="font-mono text-lg tracking-widest"
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
            />
            <Button onClick={() => doSearch()} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Track
            </Button>
          </div>

          {data && (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card/40 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Code
                  </span>
                  <span className="font-mono text-lg font-bold text-primary">{data.appCode}</span>
                </div>
                <div className="text-sm font-medium">{data.serviceName}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{data.category}</Badge>
                  <span>Applicant: {data.applicantName}</span>
                  <span>·</span>
                  <span>Contact: {data.contactMasked}</span>
                </div>
              </div>

              {/* Progress steps */}
              <div>
                <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                  Application Progress
                </div>
                <div className="space-y-3">
                  {(data.steps || []).map((stepName, i) => {
                    const Icon = STEP_ICONS[i] || CheckCircle2;
                    const done = (data.statusStep ?? 0) >= i;
                    const current = (data.statusStep ?? 0) === i;
                    return (
                      <div key={stepName} className="flex items-start gap-3">
                        <div
                          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                            done
                              ? "border-india-green bg-india-green/15 text-india-green"
                              : current
                              ? "border-saffron bg-saffron/15 text-saffron"
                              : "border-muted bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className={`text-sm font-medium ${done || current ? "" : "text-muted-foreground"}`}>
                            {stepName}
                          </div>
                          {current && (
                            <div className="text-xs text-saffron">In progress</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border bg-card/30 p-3">
                  <div className="text-muted-foreground">Submitted</div>
                  <div className="font-medium">
                    {data.submittedAt ? new Date(data.submittedAt).toLocaleString("en-IN") : "—"}
                  </div>
                </div>
                <div className="rounded-lg border bg-card/30 p-3">
                  <div className="text-muted-foreground">Last Update</div>
                  <div className="font-medium">
                    {data.updatedAt ? new Date(data.updatedAt).toLocaleString("en-IN") : "—"}
                  </div>
                </div>
              </div>

              {data.adminNotes && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span><strong>Note:</strong> {data.adminNotes}</span>
                  </p>
                </div>
              )}

              {/* Rating (only if completed) */}
              {data.status === "Completed" && (
                <div className="rounded-xl border bg-card/40 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-saffron" />
                    <span className="text-sm font-medium">
                      {data.rating ? "Update your rating" : "Rate your experience"}
                    </span>
                  </div>
                  <div className="mb-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setStars(n)}
                        className="rounded p-1 transition hover:scale-110"
                        aria-label={`Rate ${n} stars`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            n <= stars
                              ? "fill-saffron text-saffron"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience (optional)"
                    className="mb-3 min-h-[70px]"
                  />
                  <Button onClick={submitRating} disabled={submittingRating} size="sm" className="gap-2">
                    {submittingRating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Submit Feedback
                  </Button>
                </div>
              )}

              <Separator />

              <div className="text-xs text-muted-foreground">
                Need help? WhatsApp <strong className="text-foreground">+91 70196 31612</strong> with your code.
              </div>
            </div>
          )}

          {!data && !loading && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Search className="mx-auto mb-3 h-10 w-10 opacity-30" />
              Enter your 6-digit code above to see live status.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { ApplicationStatusStep };

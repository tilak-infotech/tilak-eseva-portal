"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  FileText,
  CreditCard,
  CheckCircle2,
  Loader2,
  Copy,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

import type { GovernmentService } from "@/lib/types";
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
import { Progress } from "@/components/ui/progress";

interface Props {
  service: GovernmentService | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onTrack: (code: string) => void;
}

interface ApiResponse {
  success?: boolean;
  appCode?: string;
  serviceName?: string;
  status?: string;
  submittedAt?: string;
  sla?: string;
  whatsapp?: string;
  email?: string;
  error?: string;
  details?: unknown;
}

const STEPS = ["Applicant", "Service Details", "Payment", "Review", "Done"] as const;

export function ApplyDialog({ service, open, onOpenChange, onTrack }: Props) {
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<ApiResponse | null>(null);

  const [applicantName, setApplicantName] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [paymentRef, setPaymentRef] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setStep(0);
      setResult(null);
    }
  }, [open]);

  if (!service) return null;

  const totalFee = service.fee + service.serviceCharge;

  const validateStep = (s: number): boolean => {
    if (s === 0) {
      if (applicantName.trim().length < 2) {
        toast.error("Please enter your full name");
        return false;
      }
      if (!/^(\+91)?[6-9]\d{9}$/.test(contactNumber.trim())) {
        toast.error("Enter a valid 10-digit Indian mobile number");
        return false;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Enter a valid email or leave blank");
        return false;
      }
    }
    if (s === 1) {
      if (details.trim().length < 10) {
        toast.error("Please describe what you need (min 10 characters)");
        return false;
      }
    }
    if (s === 2) {
      if (paymentRef.trim().length < 4) {
        toast.error("Enter your UPI reference / transaction ID");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: service.slug,
          applicantName: applicantName.trim(),
          contactNumber: contactNumber.trim(),
          email: email.trim(),
          formData: { details: details.trim() },
          paymentRef: paymentRef.trim(),
          feeAmount: String(totalFee),
        }),
      });
      const data: ApiResponse = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Submission failed. Please try again.");
        return;
      }
      setResult(data);
      setStep(STEPS.length - 1);
      toast.success(`Application ${data.appCode} submitted!`);
    } catch {
      toast.error("Network error. Please check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    if (result?.appCode) {
      navigator.clipboard.writeText(result.appCode);
      toast.success("Application code copied");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[92vh] w-[95vw] max-w-xl overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b p-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            Apply: <span className="text-primary">{service.name}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Ministry: {service.ministry} · Govt Fee ₹{service.fee} + Tilak ₹{service.serviceCharge} = ₹{totalFee}
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 pt-4">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </span>
            <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-1.5" />
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-5">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-1.5 block">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="As per Aadhaar / PAN"
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1.5 block">Mobile Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value.replace(/[^\d+]/g, ""))}
                    placeholder="+91 98XXXXXXXX"
                    className="pl-9"
                    inputMode="tel"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  We&apos;ll contact you on this number with updates.
                </p>
              </div>
              <div>
                <Label htmlFor="email" className="mb-1.5 block">Email (optional)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Service Summary</Label>
                <p className="rounded-lg border bg-card/40 p-3 text-sm">{service.summary}</p>
              </div>
              <div>
                <Label htmlFor="details" className="mb-1.5 block">What do you need help with? *</Label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. I need to update my address on my Aadhaar card. Current address: ... New address: ..."
                  className="min-h-[120px]"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Provide accurate details so our team can prepare your application.
                </p>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                  <FileText className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  You may be asked to share documents (Aadhaar, photos, etc.) on WhatsApp after submission.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Government Fee</span>
                  <span className="font-semibold">₹{service.fee.toLocaleString("en-IN")}</span>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tilak Service Charge</span>
                  <span className="font-semibold">₹{service.serviceCharge.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-medium">Total Payable</span>
                  <span className="text-xl font-bold text-primary">₹{totalFee.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="rounded-xl border border-saffron/30 bg-saffron/5 p-4">
                <p className="mb-2 text-sm font-medium">Pay via UPI</p>
                <div className="flex items-center gap-3 rounded-lg bg-background/60 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-saffron/20 text-saffron">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">tilakinfotech@upi</p>
                    <p className="text-xs text-muted-foreground">Scan or pay ₹{totalFee} to this UPI ID</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      window.open(`upi://pay?pa=tilakinfotech@upi&pn=TilakInfotech&am=${totalFee}&cu=INR`, "_blank");
                    }}
                  >
                    Open UPI
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="payref" className="mb-1.5 block">UPI Transaction / Reference ID *</Label>
                <Input
                  id="payref"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. 4567XXXXXX89"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Found in your UPI app after payment.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Review your application
              </h3>
              {[
                ["Service", service.name],
                ["Applicant", applicantName],
                ["Mobile", contactNumber],
                ["Email", email || "—"],
                ["Details", details.slice(0, 120) + (details.length > 120 ? "…" : "")],
                ["Payment Ref", paymentRef],
                ["Total Fee", `₹${totalFee.toLocaleString("en-IN")}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b pb-2 text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-right font-medium">{v}</span>
                </div>
              ))}
              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-india-green" />
                By submitting, you confirm the details are correct and authorize Tilak Infotech to process this application on your behalf.
              </p>
            </div>
          )}

          {step === 4 && result && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-india-green/15 text-india-green">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="mb-1 text-xl font-bold">Application Submitted!</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Your application for <strong>{result.serviceName}</strong> has been received.
              </p>

              <div className="mx-auto mb-4 max-w-xs rounded-xl border bg-card/60 p-4">
                <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  Your Tracking Code
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-3xl font-bold tracking-wider text-primary">
                    {result.appCode}
                  </span>
                  <Button size="icon" variant="ghost" onClick={copyCode} className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="mb-4 text-sm text-muted-foreground">
                SLA: {result.sla}. Save this code — you&apos;ll need it to track status.
              </p>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  onClick={() => {
                    onOpenChange(false);
                    onTrack(result.appCode!);
                  }}
                  className="gap-2"
                >
                  Track Status <ArrowRight className="h-4 w-4" />
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a
                    href={`https://wa.me/917019631612?text=${encodeURIComponent(
                      `Hello Tilak Infotech, I just submitted application ${result.appCode} for ${result.serviceName}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        {step < 4 && (
          <div className="flex items-center justify-between border-t p-4">
            <Button variant="ghost" onClick={back} disabled={step === 0} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Badge variant="outline" className="text-xs">
              Total: ₹{totalFee.toLocaleString("en-IN")}
            </Badge>
            {step < 3 ? (
              <Button onClick={next} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={submitting} className="gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>Submit Application</>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

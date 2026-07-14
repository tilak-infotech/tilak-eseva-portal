"use client";

import * as React from "react";
import {
  ExternalLink,
  CheckCircle2,
  FileText,
  IndianRupee,
  Clock,
  ListChecks,
  UserCheck,
  ShieldCheck,
  Globe,
  Tag,
} from "lucide-react";

import type { GovernmentService } from "@/lib/types";
import { getCategory } from "@/lib/services-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DynamicIcon } from "./dynamic-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  service: GovernmentService | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApply: (s: GovernmentService) => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card/40 p-3">
      <div className="mt-0.5 rounded-md bg-primary/10 p-1.5 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm font-medium leading-snug">{value}</div>
      </div>
    </div>
  );
}

export function ServiceDetailDialog({ service, open, onOpenChange, onApply }: Props) {
  if (!service) return null;
  const category = getCategory(service.category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[92vh] w-[95vw] max-w-3xl overflow-hidden p-0 sm:rounded-2xl">
        <ScrollArea className="max-h-[92vh]">
          <div className="p-6 sm:p-8">
            <DialogHeader className="mb-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {category && (
                  <Badge variant="secondary" className="gap-1.5">
                    {category.icon && <DynamicIcon name={category.icon} className="h-3 w-3" />}
                    {category.name}
                  </Badge>
                )}
                {service.subcategory && (
                  <Badge variant="outline" className="text-muted-foreground">
                    {service.subcategory}
                  </Badge>
                )}
                {service.online ? (
                  <Badge className="gap-1 bg-india-green/15 text-india-green hover:bg-india-green/20">
                    <Globe className="h-3 w-3" /> Online
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-500">
                    Visit Office
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-balance text-2xl font-bold leading-tight sm:text-3xl">
                {service.name}
              </DialogTitle>
              <DialogDescription className="mt-2 text-pretty text-base leading-relaxed">
                {service.summary}
              </DialogDescription>
            </DialogHeader>

            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              {service.description}
            </p>

            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={IndianRupee}
                label="Government Fee"
                value={
                  <span>
                    {service.fee === 0 ? (
                      <span className="text-india-green">Free</span>
                    ) : (
                      <>₹{service.fee.toLocaleString("en-IN")}</>
                    )}
                    {service.feeNote && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({service.feeNote})
                      </span>
                    )}
                  </span>
                }
              />
              <InfoRow icon={Clock} label="Processing Time" value={service.processingTime} />
              <InfoRow icon={Tag} label="Ministry / Dept" value={service.ministry} />
              <InfoRow
                icon={ShieldCheck}
                label="Tilak Service Charge"
                value={
                  <span>
                    ₹{service.serviceCharge.toLocaleString("en-IN")}{" "}
                    <span className="text-xs text-muted-foreground">(assisted)</span>
                  </span>
                }
              />
            </div>

            <Tabs defaultValue="apply" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="apply">How to Apply</TabsTrigger>
                <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                <TabsTrigger value="docs">Documents</TabsTrigger>
                <TabsTrigger value="portal">Portal</TabsTrigger>
              </TabsList>

              <TabsContent value="apply" className="mt-4">
                <ol className="space-y-3">
                  {service.howToApply.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 text-sm leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </TabsContent>

              <TabsContent value="eligibility" className="mt-4">
                <ul className="space-y-2">
                  {service.eligibility.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <UserCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-india-green" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="docs" className="mt-4">
                <ul className="space-y-2">
                  {service.documentsRequired.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="portal" className="mt-4 space-y-3">
                <InfoRow icon={Globe} label="Official Portal" value={service.officialPortal} />
                <a
                  href={service.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {service.officialUrl}
                </a>
                <Separator className="my-3" />
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => onApply(service)}
                className="flex-1 gap-2"
                size="lg"
              >
                <ListChecks className="h-4 w-4" />
                Apply via Tilak E-Seva
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <a href={service.officialUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" /> Official Site
                </a>
              </Button>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-india-green" />
              Documents stored securely. SLA: 2 hours assisted. WhatsApp +91 70196 31612.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

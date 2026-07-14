"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Search,
  Building2,
  Globe,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  Loader2,
  ExternalLink,
  Headset,
  Landmark,
  Award,
  Zap,
  FileText,
  PackageCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  ALL_SERVICES,
  getPopularServices,
  searchServices,
  TOTAL_SERVICES,
} from "@/lib/services-data";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import type { GovernmentService, ServiceCategorySlug } from "@/lib/types";
import { DynamicIcon } from "@/components/portal/dynamic-icon";
import { ThemeToggle } from "@/components/portal/theme-toggle";
import { ServiceDetailDialog } from "@/components/portal/service-detail-dialog";
import { ApplyDialog } from "@/components/portal/apply-dialog";
import { StatusTracker } from "@/components/portal/status-tracker";

type SortKey = "popular" | "name" | "fee-low" | "fee-high";

export default function Home() {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<ServiceCategorySlug | "all">("all");
  const [sort, setSort] = React.useState<SortKey>("popular");
  const [onlineOnly, setOnlineOnly] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(24);

  const [detailService, setDetailService] = React.useState<GovernmentService | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [applyService, setApplyService] = React.useState<GovernmentService | null>(null);
  const [applyOpen, setApplyOpen] = React.useState(false);
  const [trackerOpen, setTrackerOpen] = React.useState(false);
  const [trackCode, setTrackCode] = React.useState<string>("");

  const debouncedQuery = React.useDeferredValue(query, "");

  const filteredServices = React.useMemo(() => {
    let list = ALL_SERVICES;
    if (activeCategory !== "all") {
      list = list.filter((s) => s.category === activeCategory);
    }
    if (onlineOnly) {
      list = list.filter((s) => s.online);
    }
    if (debouncedQuery.trim()) {
      const results = searchServices(debouncedQuery, 600);
      const set = new Set(results.map((r) => r.slug));
      list = list.filter((s) => set.has(s.slug));
    }
    const sorted = [...list];
    switch (sort) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "fee-low":
        sorted.sort((a, b) => a.fee + a.serviceCharge - (b.fee + b.serviceCharge));
        break;
      case "fee-high":
        sorted.sort((a, b) => b.fee + b.serviceCharge - (a.fee + a.serviceCharge));
        break;
      default:
        sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [activeCategory, onlineOnly, debouncedQuery, sort]);

  const popular = React.useMemo(() => getPopularServices(8), []);

  const openDetail = (s: GovernmentService) => {
    setDetailService(s);
    setDetailOpen(true);
  };

  const openApply = (s: GovernmentService) => {
    setDetailOpen(false);
    setApplyService(s);
    setApplyOpen(true);
  };

  const openTracker = (code?: string) => {
    setTrackCode(code || "");
    setTrackerOpen(true);
  };

  const popularCategories = React.useMemo(
    () =>
      [...CATEGORIES]
        .sort(
          (a, b) =>
            ALL_SERVICES.filter((s) => s.category === b.slug).length -
            ALL_SERVICES.filter((s) => s.category === a.slug).length
        )
        .slice(0, 12),
    []
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* ===== Tricolor accent bar ===== */}
      <div className="tricolor-bar h-1 w-full" />

      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black border border-border shadow-lg">
              <Landmark className="h-5 w-5" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background text-[8px] font-bold text-foreground">
                TI
              </span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight sm:text-base">
                Tilak E-Seva Portal
              </div>
              <div className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
                Indian Government Services · 500+ Online
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <a href="#categories">Categories</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#services">All Services</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#how-it-works">How it Works</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#contact">Contact</a>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openTracker()}
              className="hidden gap-2 sm:flex"
            >
              <ShieldCheck className="h-4 w-4" /> Track Status
            </Button>
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-2">
                  <Button variant="ghost" asChild className="justify-start">
                    <a href="#categories">Categories</a>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <a href="#services">All Services</a>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <a href="#how-it-works">How it Works</a>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <a href="#contact">Contact</a>
                  </Button>
                  <Button onClick={() => openTracker()} className="mt-2 gap-2">
                    <ShieldCheck className="h-4 w-4" /> Track Status
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden border-b">
          <div className="grid-pattern absolute inset-0 opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 gap-1.5 border-saffron/40 bg-saffron/5 text-saffron">
                <Sparkles className="h-3 w-3" />
                A single gateway to {TOTAL_SERVICES}+ Indian Government services
              </Badge>
              <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                All Indian Government <span className="gradient-text">e-Services</span> in one portal
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
                Aadhaar, PAN, Passport, Voter ID, Income Tax, GST, pensions, certificates, welfare
                schemes and much more. Apply online, track status, and get assisted by{" "}
                <strong className="text-foreground">Tilak Infotech</strong>.
              </p>

              {/* Search */}
              <div className="mx-auto mt-7 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search 500+ services — e.g. Aadhaar, ITR, passport, PM-KISAN…"
                    className="h-14 rounded-2xl border-2 pl-12 pr-28 text-base shadow-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 gap-1.5"
                    onClick={() =>
                      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Search <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="text-muted-foreground">Popular:</span>
                  {["Aadhaar", "PAN Card", "Passport", "PM-KISAN", "ITR Filing", "Voter ID"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setQuery(t);
                        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="rounded-full border bg-card/60 px-3 py-1 text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Globe, label: "Services", value: `${TOTAL_SERVICES}+` },
                  { icon: Building2, label: "Categories", value: `${CATEGORIES.length}` },
                  { icon: ShieldCheck, label: "Online", value: `${ALL_SERVICES.filter((s) => s.online).length}+` },
                  { icon: Clock, label: "SLA", value: "2 hrs" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="glass rounded-xl p-3 text-center transition hover:border-primary/40"
                  >
                    <stat.icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Popular services ===== */}
        <section className="border-b bg-card/20">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                  <TrendingUp className="h-5 w-5 text-foreground" />
                  Most Popular Services
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  The most-applied-for government services on our portal.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {popular.map((s) => {
                const cat = CATEGORY_MAP[s.category];
                return (
                  <button
                    key={s.slug}
                    onClick={() => openDetail(s)}
                    className="spotlight-card group glass relative flex flex-col gap-2 rounded-2xl p-4 text-left transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat?.accent || "from-primary/20 to-primary/5 text-primary"}`}
                      >
                        <DynamicIcon name={cat?.icon || "Landmark"} className="h-5 w-5" />
                      </div>
                      {s.online && (
                        <Badge variant="secondary" className="gap-1 bg-neutral-100 dark:bg-neutral-900 text-xs text-muted-foreground border">
                          <Globe className="h-2.5 w-2.5" /> Online
                        </Badge>
                      )}
                    </div>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                      {s.name}
                    </h3>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{s.summary}</p>
                    <div className="mt-auto flex items-center justify-between pt-1 text-xs">
                      <span className="text-muted-foreground">
                        {s.fee === 0 ? (
                          <span className="font-medium text-foreground">Free</span>
                        ) : (
                          <>₹{s.fee}</>
                        )}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-primary opacity-0 transition group-hover:opacity-100">
                        View <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== Categories ===== */}
        <section id="categories" className="scroll-mt-20 border-b">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Browse by Category</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {CATEGORIES.length} categories spanning every major Indian ministry and service.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {CATEGORIES.map((c) => {
                const count = ALL_SERVICES.filter((s) => s.category === c.slug).length;
                const isActive = activeCategory === c.slug;
                return (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setActiveCategory(c.slug);
                      setQuery("");
                      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-lg ${
                      isActive ? "border-primary bg-primary/5" : "glass"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent}`}
                    >
                      <DynamicIcon name={c.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="line-clamp-1 text-sm font-semibold">{c.shortName}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{count} services</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== All Services explorer ===== */}
        <section id="services" className="scroll-mt-20 border-b">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">All Services</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredServices.length} of {TOTAL_SERVICES} services shown
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setOnlineOnly((v) => !v)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    onlineOnly
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Online only
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs font-medium text-foreground outline-none transition hover:border-primary/40"
                >
                  <option value="popular">Most popular</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="fee-low">Fee (low to high)</option>
                  <option value="fee-high">Fee (high to low)</option>
                </select>
              </div>
            </div>

            {/* Category pills */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  activeCategory === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({TOTAL_SERVICES})
              </button>
              {popularCategories.map((c) => {
                const count = ALL_SERVICES.filter((s) => s.category === c.slug).length;
                return (
                  <button
                    key={c.slug}
                    onClick={() => setActiveCategory(c.slug)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      activeCategory === c.slug
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.shortName} ({count})
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            {filteredServices.length === 0 ? (
              <div className="rounded-2xl border border-dashed py-16 text-center">
                <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No services match your filters. Try a different search or category.
                </p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("all");
                    setOnlineOnly(false);
                  }}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredServices.slice(0, visibleCount).map((s) => (
                  <ServiceCard
                    key={s.slug}
                    service={s}
                    onClick={() => openDetail(s)}
                    onApply={() => openApply(s)}
                  />
                ))}
              </div>
            )}

            {visibleCount < filteredServices.length && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount((c) => c + 24)}
                  className="gap-2"
                >
                  Load more services
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Showing {Math.min(visibleCount, filteredServices.length)} of {filteredServices.length}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ===== How it works ===== */}
        <section id="how-it-works" className="scroll-mt-20 border-b bg-card/20">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">How Tilak E-Seva Works</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                From search to delivery in 4 simple steps.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Search,
                  title: "1. Search & Select",
                  desc: "Browse 500+ services by category or search. Pick the one you need.",
                },
                {
                  icon: FileText,
                  title: "2. Apply Online",
                  desc: "Fill your details, upload documents, and pay the service charge.",
                },
                {
                  icon: Headset,
                  title: "3. We Process",
                  desc: "Tilak Infotech team verifies and submits your application to the department.",
                },
                {
                  icon: PackageCheck,
                  title: "4. Track & Receive",
                  desc: "Track status with your 6-digit code. Receive your service within SLA.",
                },
              ].map((step, i) => (
                <div key={i} className="glass relative rounded-2xl p-5">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-900 text-foreground border">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 text-sm font-bold">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Secure & Private", desc: "Documents stored securely, never shared with third parties." },
                { icon: Zap, title: "Fast Turnaround", desc: "2-hour SLA on assisted applications. Real-time status updates." },
                { icon: Award, title: "Trusted by Citizens", desc: "Run by Tilak Infotech · +91 70196 31612 · tilakinfotech@gmail.com" },
              ].map((f, i) => (
                <div key={i} className="glass flex items-start gap-3 rounded-xl p-4">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{f.title}</h4>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Contact CTA ===== */}
        <section id="contact" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <Card className="glass overflow-hidden border-saffron/30">
              <CardContent className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Need help choosing a service?</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our team at Tilak Infotech will guide you to the right government service,
                    help with documentation, and process your application — all over WhatsApp or phone.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild className="gap-2">
                      <a
                        href="https://wa.me/917019631612"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" /> WhatsApp Us
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                      <a href="tel:+917019631612">
                        <Phone className="h-4 w-4" /> Call +91 70196 31612
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                      <a href="mailto:tilakinfotech@gmail.com">
                        <Mail className="h-4 w-4" /> Email
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3 rounded-xl border bg-card/40 p-5">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Hours:</strong> Mon–Sat, 9 AM – 7 PM IST</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <span><strong>SLA:</strong> 2-hour assisted delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    <span><strong>Assisted by:</strong> Tilak Infotech</span>
                  </div>
                  <Button
                    onClick={() => openTracker()}
                    variant="secondary"
                    className="mt-2 gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" /> Track an existing application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* ===== Footer (sticky to bottom) ===== */}
      <footer className="mt-auto border-t bg-card/30">
        <div className="tricolor-bar h-0.5 w-full opacity-60" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black">
                  <Landmark className="h-4 w-4" />
                </div>
                <span className="font-bold">Tilak E-Seva Portal</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                A unified citizen gateway to {TOTAL_SERVICES}+ Indian Government services.
                Powered by Tilak Infotech.
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quick Links
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#categories" className="hover:text-primary">All Categories</a></li>
                <li><a href="#services" className="hover:text-primary">All Services</a></li>
                <li><a href="#how-it-works" className="hover:text-primary">How it Works</a></li>
                <li><button onClick={() => openTracker()} className="hover:text-primary">Track Status</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Popular Categories
              </h4>
              <ul className="space-y-1.5 text-xs">
                {CATEGORIES.slice(0, 5).map((c) => (
                  <li key={c.slug}>
                    <button
                      onClick={() => {
                        setActiveCategory(c.slug);
                        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="hover:text-primary"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contact
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-muted-foreground" /> +91 70196 31612
                </li>
                <li className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-muted-foreground" /> tilakinfotech@gmail.com
                </li>
                <li className="flex items-center gap-1.5">
                  <MessageCircle className="h-3 w-3 text-primary" /> WhatsApp Support
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-5" />
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Tilak Infotech. All rights reserved.</p>
            <p className="text-center sm:text-right">
              Made for Digital India ·{" "}
              {TOTAL_SERVICES} services · {CATEGORIES.length} categories
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/917019631612?text=Hello%20Tilak%20Infotech%2C%20I%20need%20help%20with%20a%20government%20service"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black shadow-lg transition hover:scale-110 pulse-glow"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* ===== Dialogs ===== */}
      <ServiceDetailDialog
        service={detailService}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onApply={openApply}
      />
      <ApplyDialog
        service={applyService}
        open={applyOpen}
        onOpenChange={setApplyOpen}
        onTrack={openTracker}
      />
      <StatusTracker open={trackerOpen} onOpenChange={setTrackerOpen} initialCode={trackCode} />
    </div>
  );
}

// ===== Service Card sub-component =====
function ServiceCard({
  service,
  onClick,
  onApply,
}: {
  service: GovernmentService;
  onClick: () => void;
  onApply: () => void;
}) {
  const cat = CATEGORY_MAP[service.category];
  return (
    <div
      className="spotlight-card group glass relative flex flex-col rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <button onClick={onClick} className="flex flex-1 flex-col text-left">
        <div className="mb-2 flex items-center justify-between">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${cat?.accent || "from-primary/20 to-primary/5 text-primary"}`}
          >
            <DynamicIcon name={cat?.icon || "Landmark"} className="h-4 w-4" />
          </div>
          {service.online && (
            <Badge variant="secondary" className="gap-1 bg-neutral-100 dark:bg-neutral-900 text-[10px] text-muted-foreground border">
              <Globe className="h-2.5 w-2.5" /> Online
            </Badge>
          )}
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{service.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{service.summary}</p>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="line-clamp-1">{service.processingTime}</span>
        </div>
      </button>
      <div className="mt-3 flex items-center justify-between border-t pt-2">
        <span className="text-xs">
          {service.fee === 0 ? (
            <span className="font-medium text-foreground">Free</span>
          ) : (
            <>
              <span className="text-muted-foreground">Govt </span>
              <span className="font-medium">₹{service.fee}</span>
            </>
          )}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onApply}
          className="h-7 gap-1 px-2 text-xs text-primary hover:bg-primary/10"
        >
          Apply <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// unused imports guard
void ExternalLink;
void Loader2;
void Zap;

import React, { useState } from "react";
import { BookOpen, ArrowRight, Clock, Download, Headphones, FileText, X } from "lucide-react";
import { MainNavView } from "../layout/navViews";
import { INSIGHTS_RESOURCES, InsightResource } from "../../data/insightsContent";

interface InsightsViewProps {
  onSelectView: (view: MainNavView) => void;
  onOpenBriefWizard: () => void;
}

const FORMAT_META: Record<InsightResource["format"], { label: string; icon: React.ReactNode }> = {
  read: { label: "Read", icon: <BookOpen className="w-3.5 h-3.5" /> },
  download: { label: "Download", icon: <Download className="w-3.5 h-3.5" /> },
  listen: { label: "Listen", icon: <Headphones className="w-3.5 h-3.5" /> },
};

export const InsightsView: React.FC<InsightsViewProps> = ({ onSelectView, onOpenBriefWizard }) => {
  void onSelectView;
  void onOpenBriefWizard;
  const [openArticleId, setOpenArticleId] = useState<string | null>(null);
  const openArticle = INSIGHTS_RESOURCES.find((r) => r.id === openArticleId);
  const featured = INSIGHTS_RESOURCES[0]!;
  const rest = INSIGHTS_RESOURCES.slice(1);

  const handleResourceAction = (resource: InsightResource) => {
    if (resource.format === "read") {
      setOpenArticleId(resource.id);
    } else if (resource.fileUrl) {
      window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Page hero — deep navy band */}
      <section className="gw-page-hero relative overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="gw-glow-cyan top-0 left-1/3 h-[280px] w-[560px] -translate-x-1/2"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
          <span className="gw-eyebrow">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            NDH Strategic Intelligence &amp; Technical Dossiers
          </span>

          <h1 className="font-display max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Insights on Scoping, Pricing &amp; Shipping Software That Works.
          </h1>

          <p className="max-w-3xl text-base leading-relaxed">
            Original, practical articles, a free checklist, and a short audio explainer published
            directly by NDH Agency — no placeholder entries, no invented bylines.
          </p>
        </div>
      </section>

      {/* Porcelain body — elevated white cards */}
      <div className="gw-page-body">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {/* Featured Article */}
          <div className="gw-card grid grid-cols-1 items-center gap-8 p-8 sm:p-12 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-md bg-blue-950 text-blue-300 font-mono text-[11px] font-bold border border-blue-800">
                  {featured.tag}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{featured.readTime}</span>
                </span>
              </div>

              <h2
                onClick={() => handleResourceAction(featured)}
                className="text-2xl sm:text-3xl font-extrabold text-white hover:text-blue-400 cursor-pointer transition-colors leading-tight"
              >
                {featured.title}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">{featured.excerpt}</p>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
                <span className="font-bold text-white">Published by NDH Agency</span>
                <span>•</span>
                <span className="text-slate-400">{featured.date}</span>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
              <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
                Full Article — Free to Read
              </div>
              <p className="text-xs text-slate-300">
                A practical, real framework for scoping a project before you request a quote — read
                it in full, right here, no sign-up required.
              </p>
              <button
                onClick={() => handleResourceAction(featured)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-transform hover:scale-105"
              >
                Read Full Article →
              </button>
            </div>
          </div>

          {/* Resource Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {rest.map((resource) => {
              const meta = FORMAT_META[resource.format];
              return (
                <div
                  key={resource.id}
                  className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl hover:border-blue-500/60 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        {resource.tag}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        {meta.icon}
                        <span>{meta.label}</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => handleResourceAction(resource)}
                      className="font-bold text-base text-white hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {resource.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                      {resource.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <div>
                      <div className="font-bold text-white">NDH Agency</div>
                      <div className="text-[11px] text-blue-400">
                        {resource.fileSizeLabel || resource.readTime}
                      </div>
                    </div>
                    <button
                      onClick={() => handleResourceAction(resource)}
                      aria-label={`${meta.label} ${resource.title}`}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {openArticle && openArticle.body && (
        <div
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-eco-navy/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpenArticleId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="border-border bg-surface max-h-full w-full overflow-y-auto rounded-none border shadow-2xl sm:max-h-[85vh] sm:max-w-3xl sm:rounded-2xl"
          >
            <div className="border-border bg-surface/95 sticky top-0 z-10 flex items-start justify-between gap-4 border-b px-6 py-5 backdrop-blur-xl sm:px-10">
              <div className="space-y-2">
                <span className="bg-brand-subtle text-brand-soft border-primary/25 inline-flex items-center gap-1.5 rounded border px-2.5 py-0.5 font-mono text-[10px] font-bold">
                  <FileText className="w-3 h-3" />
                  {openArticle.tag}
                </span>
                <h2 className="text-foreground font-display text-xl leading-tight font-extrabold sm:text-2xl">
                  {openArticle.title}
                </h2>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>Published by NDH Agency</span>
                  <span>•</span>
                  <span>{openArticle.date}</span>
                  <span>•</span>
                  <span>{openArticle.readTime}</span>
                </div>
              </div>
              <button
                onClick={() => setOpenArticleId(null)}
                className="border-border bg-surface-raised text-muted-foreground hover:text-foreground shrink-0 rounded-xl border p-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 sm:px-10 py-8 space-y-5">
              {openArticle.body.map((para, i) => (
                <p key={i} className="text-foreground/85 text-sm leading-relaxed">
                  {para}
                </p>
              ))}

              <div className="border-border mt-4 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                <p className="text-muted-foreground text-xs">
                  Have a project in mind? Use this framework before your discovery call.
                </p>
                <button
                  onClick={() => {
                    setOpenArticleId(null);
                    onOpenBriefWizard();
                  }}
                  className="from-primary to-highlight rounded-xl bg-gradient-to-r px-5 py-2.5 text-xs font-extrabold whitespace-nowrap text-white shadow-lg shadow-primary/25"
                >
                  Start Your Project →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-4 text-slate-100">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-blue-500">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-white">Page Not Found</h2>
        <p className="mt-2 text-sm text-slate-400">
          The requested page or resource could not be found. Return to our main portal.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 shadow-lg shadow-blue-600/30"
          >
            Return to NDH Agency Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Runtime error caught by root boundary:", error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070A14] px-4 text-slate-100 font-sans">
      <div className="max-w-md text-center p-8 rounded-3xl bg-[#0F172A] border border-blue-900/40 shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
          <span className="text-xl font-bold">NDH</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Session Refresh</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error?.message ||
            "An operational session refresh is recommended. Please reload the interface."}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                router.invalidate();
                reset();
              }
            }}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-500 shadow-lg shadow-blue-600/30"
          >
            Refresh Interface
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/";
              }
            }}
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-200 transition-colors hover:bg-slate-800"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

const SCHEMA_ORG_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://agency.ndh.com.ng/#organization",
      name: "NDH Agency",
      alternateName: "Najeeb Digital Hub Agency",
      url: "https://agency.ndh.com.ng",
      logo: "https://agency.ndh.com.ng/logo.png",
      sameAs: [
        "https://www.facebook.com/share/1Be6HN8zjS/",
        "https://www.instagram.com/njb_digital_hub",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+234-902-993-2794",
          contactType: "customer service",
          email: "hello@ndh.com.ng",
          areaServed: ["NG", "GB", "US", "GH", "KE", "ZA"],
          availableLanguage: ["English", "French", "Arabic"],
        },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Marmaron Nufawa, Western Bye Pass",
        addressLocality: "Sokoto",
        addressRegion: "Sokoto State",
        postalCode: "840001",
        addressCountry: "NG",
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://agency.ndh.com.ng/#service",
      name: "NDH Agency Managed Digital Services Bureau",
      description:
        "High-velocity web engineering, mobile apps, brand identity, enterprise cloud architecture, and market research across Pan-Africa and global markets.",
      url: "https://agency.ndh.com.ng",
      provider: {
        "@id": "https://agency.ndh.com.ng/#organization",
      },
      priceRange: "$$$$",
      currenciesAccepted: "USD, NGN, GBP",
      paymentAccepted: "Credit Card, Paystack, Flutterwave, Stripe, Wire Transfer",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Digital Transformation & Engineering Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Enterprise Web & Cloud Engineering",
              description:
                "High-scale Next.js, React, Node.js and distributed cloud systems with sub-300ms latency.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Mobile Application Systems",
              description:
                "Cross-platform Flutter and native iOS/Android mobile applications with offline-first sync.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Brand Identity & Design Systems",
              description:
                "Comprehensive design languages, design tokens, and multi-market visual systems.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Pan-African & Diaspora Market Research",
              description:
                "Empirical consumer telemetry, regulatory fintech compliance, and macro-economic intelligence.",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://agency.ndh.com.ng/#website",
      url: "https://agency.ndh.com.ng",
      name: "NDH Agency | Managed Digital Services Bureau",
      publisher: {
        "@id": "https://agency.ndh.com.ng/#organization",
      },
    },
  ],
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { title: "NDH Agency | Managed Digital Services Bureau & Pan-African Tech Excellence" },
      {
        name: "description",
        content:
          "NDH Agency is a premium managed digital services bureau. We engineer enterprise software, mobile apps, brand systems, cloud architectures, and Pan-African market research with strict SLAs, dedicated PM oversight, and guaranteed delivery.",
      },
      {
        name: "keywords",
        content:
          "NDH Agency, Najeeb Digital Hub, digital agency Nigeria, software development company Lagos, mobile app development Africa, enterprise web engineering, brand identity systems, Paystack integration, fintech software Nigeria, cloud DevOps consulting",
      },
      { name: "author", content: "Najeeb Digital Hub (NDH)" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "NDH Agency" },
      { property: "og:title", content: "NDH Agency | Managed Digital Services Bureau" },
      {
        property: "og:description",
        content:
          "Top-tier digital engineering, brand systems, and market research for high-growth enterprises and global startups. Managed bureau model with dedicated PM leadership.",
      },
      { property: "og:url", content: "https://agency.ndh.com.ng" },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_NG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@NDHAgency" },
      { name: "twitter:creator", content: "@NDHAgency" },
      { name: "twitter:title", content: "NDH Agency | Managed Digital Services Bureau" },
      {
        name: "twitter:description",
        content:
          "Sovereign digital engineering, brand identity, and Pan-African market research. Dedicated PM layer with zero client-talent friction.",
      },
      {
        name: "twitter:image",
        content:
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80",
      },
      { name: "theme-color", content: "#0B0F19" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "canonical", href: "https://agency.ndh.com.ng" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://images.unsplash.com" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: SCHEMA_ORG_JSON,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#0B0F19] text-slate-100 antialiased selection:bg-blue-600/30 selection:text-white">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

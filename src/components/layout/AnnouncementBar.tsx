import React, { useEffect, useState } from "react";
import { useAnnouncement } from "../../lib/databaseStore";
import { X, ArrowRight, Zap } from "lucide-react";

interface AnnouncementBarProps {
  onActionClick: () => void;
}

interface Offer {
  badge: string;
  title: string;
  mobileTitle: string;
  actionText: string;
}

// A Jumia-style flash bar rotates through several live offers instead of
// showing one static message forever. These are seasonal/promotional
// framings of the same real "free discovery scope" offer the backend
// announcement singleton represents -- not separate, unverifiable claims.
const ROTATING_OFFERS: Offer[] = [
  {
    badge: "Q4 SPECIAL",
    title: "Q4 Digital Transformation Special: Free Technical Discovery & PM Consultation",
    mobileTitle: "Q4 Special: Free Discovery Call",
    actionText: "Claim Free Scope",
  },
  {
    badge: "BLACK FRIDAY",
    title: "Black Friday Week: Lock in your project scope before our busiest quarter fills up",
    mobileTitle: "Black Friday: Lock In Your Scope",
    actionText: "Start My Project",
  },
  {
    badge: "SALLAH OFFER",
    title: "Sallah Offer: Fast-tracked onboarding for new briefs submitted this week",
    mobileTitle: "Sallah: Fast-Tracked Onboarding",
    actionText: "Get Started",
  },
  {
    badge: "YEAR-END",
    title: "Year-End Push: Launch before January with a dedicated PM and no scope surprises",
    mobileTitle: "Year-End: Launch Before January",
    actionText: "Book My Slot",
  },
];

const ROTATE_MS = 5500;

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onActionClick }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [offerIndex, setOfferIndex] = useState(0);
  const announcement = useAnnouncement();

  useEffect(() => {
    if (!isVisible) return;
    const id = setInterval(() => {
      setOfferIndex((i) => (i + 1) % ROTATING_OFFERS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [isVisible]);

  // The backend-controlled announcement singleton still works as a kill
  // switch: if an admin explicitly deactivates it, the whole bar is hidden
  // sitewide. When active (the default), we show the flashy rotating set
  // below rather than only that one static message.
  if (!isVisible || !announcement || !announcement.active) return null;

  const offer = ROTATING_OFFERS[offerIndex]!;

  return (
    <aside
      aria-label="Announcements"
      className="relative z-50 overflow-hidden border-b border-eco-electric/20 bg-gradient-to-r from-eco-dark via-eco-navy to-eco-dark text-white text-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2">
        <div className="flex-1 min-w-0 flex items-center justify-center">
          <div
            key={offerIndex}
            className="animate-announcement-in flex min-w-0 items-center gap-1.5 sm:gap-2"
          >
            <span className="hidden sm:inline-flex shrink-0 items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              <Zap className="w-3 h-3 text-yellow-300" />
              <span>{offer.badge}</span>
            </span>

            <span className="font-medium text-slate-100 hidden sm:inline truncate">
              {offer.title}
            </span>
            <span className="font-medium text-slate-100 sm:hidden truncate">
              ⚡ {offer.mobileTitle}
            </span>
          </div>
        </div>

        <button
          onClick={onActionClick}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-white text-blue-900 font-bold hover:bg-slate-100 transition-all text-[11px] flex items-center gap-1 shadow-sm"
        >
          <span className="hidden xs:inline">{offer.actionText}</span>
          <span className="xs:hidden">Claim</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss announcement bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress sliver showing time until the next offer rotates in */}
      <div className="h-0.5 bg-black/20">
        <div
          key={offerIndex}
          className="h-full bg-white/70 animate-announcement-progress"
          style={{ animationDuration: `${ROTATE_MS}ms` }}
        />
      </div>
    </aside>
  );
};

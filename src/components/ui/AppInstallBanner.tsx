import React, { useState, useEffect } from "react";
import { Download, Smartphone, CheckCircle2, X, Share, Menu as MenuIcon } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface AppInstallBannerProps {
  onDismiss?: () => void;
}

const isIos = () =>
  typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

const isStandaloneDisplay = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari-specific standalone flag
    (window.navigator as unknown as { standalone?: boolean }).standalone === true);

export const AppInstallBanner: React.FC<AppInstallBannerProps> = ({ onDismiss }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [alreadyStandalone, setAlreadyStandalone] = useState(false);

  useEffect(() => {
    setAlreadyStandalone(isStandaloneDisplay());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // If the app is already running as an installed PWA, there's nothing to offer.
  if (alreadyStandalone) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Floating Mini App Install Trigger Pill (bottom-left) */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.08] border border-white/12 text-slate-200 text-xs font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105 group"
        >
          <div className="w-5 h-5 rounded-lg bg-primary/30 border border-eco-cyan/50 flex items-center justify-center text-eco-cyan group-hover:rotate-12 transition-transform">
            <Smartphone className="w-3 h-3" />
          </div>
          <span>Install App</span>
        </button>
      </div>

      {/* Install Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Install NDH Agency app"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-eco-navy border border-eco-cyan/25 p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-[var(--eco-on-dark-muted)] hover:text-white p-2 rounded-full hover:bg-white/[0.08] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-eco-glow to-cyan-500 p-0.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-eco-dark rounded-2xl flex items-center justify-center text-white">
                  <Smartphone className="w-7 h-7 text-eco-cyan" />
                </div>
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-eco-cyan/20 text-eco-cyan border border-eco-cyan/25">
                  PWA
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">NDH Agency OS</h3>
                <p className="text-xs text-[var(--eco-on-dark-muted)]">agency.ndh.com.ng</p>
              </div>
            </div>

            {installed ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Installed! Launch it from your home screen or app list.</span>
              </div>
            ) : deferredPrompt ? (
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary via-eco-glow to-cyan-600 hover:from-eco-cyan hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4" />
                  <span>Install NDH Agency App</span>
                </button>
                <div className="text-[11px] text-[var(--eco-on-dark-muted)] text-center">
                  Your browser will show its native install confirmation next.
                </div>
              </div>
            ) : isIos() ? (
              <div className="space-y-2.5 text-xs text-slate-200 bg-eco-dark p-4 rounded-2xl border border-white/10">
                <p className="font-bold text-white">Add to Home Screen on iOS:</p>
                <div className="flex items-center gap-2">
                  <Share className="w-4 h-4 text-eco-cyan shrink-0" />
                  <span>1. Tap the Share button in Safari</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-eco-cyan shrink-0" />
                  <span>2. Choose &quot;Add to Home Screen&quot;</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-slate-200 bg-eco-dark p-4 rounded-2xl border border-white/10">
                <p className="font-bold text-white">Install from your browser menu:</p>
                <div className="flex items-center gap-2">
                  <MenuIcon className="w-4 h-4 text-eco-cyan shrink-0" />
                  <span>
                    Look for &quot;Install app&quot; / &quot;Add to Home screen&quot; in your
                    browser&apos;s menu (⋮ or Share icon). Not every browser supports installing
                    this app.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

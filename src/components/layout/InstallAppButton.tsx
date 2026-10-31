import React, { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export const InstallAppButton: React.FC<{ onDone?: () => void; compact?: boolean }> = ({
  onDone,
  compact = false,
}) => {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOSDevice = /iphone|ipad|ipod/i.test(ua);
    const isStandalone =
      ("standalone" in navigator && Boolean(navigator.standalone)) ||
      window.matchMedia("(display-mode: standalone)").matches;
    setIos(isIOSDevice && !isStandalone);
    setInstalled(isStandalone);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) {
      setShowHelp(true);
      return;
    }
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
    onDone?.();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => void install()}
        disabled={installed}
        aria-describedby={showHelp ? "install-app-help" : undefined}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${compact ? "w-full text-left text-foreground/85 hover:bg-accent" : "border border-white/20 text-white hover:bg-white/10"}`}
      >
        {ios ? <Smartphone className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        {installed ? "App Installed" : "Install App"}
      </button>
      {showHelp && !installed && (
        <div id="install-app-help" role="status" className="absolute right-0 z-[70] mt-2 w-64 rounded-xl border border-border bg-surface p-3 text-xs leading-relaxed text-foreground shadow-xl">
          {ios ? "Tap Share, then 'Add to Home Screen'" : "To install, open this site in Chrome or your browser’s app menu and choose Install app."}
          <button type="button" onClick={() => setShowHelp(false)} className="ml-2 font-bold text-primary">Got it</button>
        </div>
      )}
    </div>
  );
};

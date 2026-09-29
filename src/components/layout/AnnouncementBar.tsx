import React, { useState } from 'react';
import { dbService } from '../../lib/databaseStore';
import { Sparkles, X, ArrowRight, Zap } from 'lucide-react';

interface AnnouncementBarProps {
  onActionClick: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onActionClick }) => {
  const [isVisible, setIsVisible] = useState(true);
  const announcement = dbService.getAnnouncement();

  if (!isVisible || !announcement.active) return null;

  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 text-white text-xs py-2 px-4 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 justify-center text-center">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1 shrink-0">
            <Zap className="w-3 h-3 text-yellow-300" />
            <span>{announcement.badge}</span>
          </span>
          <span className="font-medium text-slate-100 hidden sm:inline truncate">
            {announcement.title}
          </span>
          <span className="font-medium text-slate-100 sm:hidden truncate">
            ⚡ Q4 Special: Free Technical Discovery &amp; Scope
          </span>

          <button
            onClick={onActionClick}
            className="ml-2 px-2.5 py-0.5 rounded-lg bg-white text-blue-900 font-bold hover:bg-slate-100 transition-all text-[11px] shrink-0 flex items-center gap-1 shadow-sm"
          >
            <span>{announcement.actionText}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

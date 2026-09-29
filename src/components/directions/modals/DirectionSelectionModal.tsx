import React, { useState } from 'react';
import { DesignDirectionId } from '../../../types/ndh';
import { DIRECTION_CONFIGS } from '../DirectionStyles';
import {
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface DirectionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDirection: DesignDirectionId;
  onSelectDirection: (dir: DesignDirectionId) => void;
}

export const DirectionSelectionModal: React.FC<DirectionSelectionModalProps> = ({
  isOpen,
  onClose,
  currentDirection,
  onSelectDirection,
}) => {
  const [selectedDir, setSelectedDir] = useState<DesignDirectionId>(currentDirection);
  const [blendSelection, setBlendSelection] = useState<string>('pure');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeTheme = DIRECTION_CONFIGS[selectedDir];

  const selectionPayload = {
    selectedDirection: selectedDir,
    directionName: activeTheme.name,
    codename: activeTheme.codename,
    blendMode: blendSelection,
    timestamp: '2026-09-29T08:30:00Z',
    notes:
      blendSelection === 'hybrid_a_b_c'
        ? 'Hybrid Blend: Direction A dark HUD telemetry + Direction B editorial storytelling for case studies + Direction C linear bento ergonomics for PM/Talent dashboards'
        : `Pure adoption of ${activeTheme.name}`,
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(selectionPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-sm text-foreground">Design Direction Selection & Strategic Decision Matrix</h3>
              <p className="text-[10px] text-muted-foreground">
                Compare thinking, strengths, risks, and target audiences before approving production build
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Direction Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['direction-a', 'direction-b', 'direction-c'] as DesignDirectionId[]).map((dirId) => {
              const cfg = DIRECTION_CONFIGS[dirId];
              const isSelected = selectedDir === dirId;
              return (
                <div
                  key={dirId}
                  onClick={() => {
                    setSelectedDir(dirId);
                    onSelectDirection(dirId);
                  }}
                  className={`p-5 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/40 shadow-xl'
                      : 'bg-background border-border hover:border-border/80'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={cfg.badgeStyle}>{cfg.badge}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                    </div>

                    <h4 className="font-bold text-sm text-foreground">{cfg.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cfg.tagline}</p>

                    <div className="space-y-1.5 pt-2 text-[11px]">
                      <div className="font-semibold text-foreground">Key Strengths:</div>
                      <ul className="space-y-1 text-muted-foreground">
                        {cfg.strengths.slice(0, 2).map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 text-[10px] text-muted-foreground">
                    <div>
                      Target: <strong className="text-foreground">{cfg.targetAudience.split(',')[0]}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strategic Hybrid Blending Options */}
          <div className="p-5 rounded-xl bg-background border border-border space-y-3 text-xs">
            <h4 className="font-bold text-sm text-foreground">Blend / Hybrid Configuration Mode:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setBlendSelection('pure')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between ${
                  blendSelection === 'pure' ? 'bg-primary/10 border-primary text-foreground' : 'border-border text-muted-foreground'
                }`}
              >
                <div>
                  <span className="font-semibold block text-foreground">Pure Selected Direction</span>
                  <span className="text-[10px] text-muted-foreground">Adopt the active direction tokens across all portals</span>
                </div>
                <input
                  type="radio"
                  name="blend"
                  checked={blendSelection === 'pure'}
                  onChange={() => setBlendSelection('pure')}
                  className="w-4 h-4 text-primary"
                />
              </label>

              <label
                onClick={() => setBlendSelection('hybrid_a_b_c')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between ${
                  blendSelection === 'hybrid_a_b_c'
                    ? 'bg-primary/10 border-primary text-foreground'
                    : 'border-border text-muted-foreground'
                }`}
              >
                <div>
                  <span className="font-semibold block text-foreground">Strategic Hybrid Blend (Recommended)</span>
                  <span className="text-[10px] text-muted-foreground">
                    Dir A (Dark HUD Telemetry) + Dir B (Editorial Serifs on Work) + Dir C (Linear PM Bento)
                  </span>
                </div>
                <input
                  type="radio"
                  name="blend"
                  checked={blendSelection === 'hybrid_a_b_c'}
                  onChange={() => setBlendSelection('hybrid_a_b_c')}
                  className="w-4 h-4 text-primary"
                />
              </label>
            </div>
          </div>

          {/* Export / Decision Confirmation Payload */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground">Active Selection Choice:</span>
              <p className="text-muted-foreground">
                <strong>{activeTheme.name}</strong> • Blend Mode:{' '}
                <span className="font-mono text-primary">{blendSelection}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPayload}
                className="px-3.5 py-2 rounded-lg bg-background border border-border hover:bg-muted text-xs font-medium text-foreground flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Payload Copied!' : 'Copy Decision JSON'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Apply Direction</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

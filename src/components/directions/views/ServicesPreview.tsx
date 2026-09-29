import React, { useState } from 'react';
import { DesignDirectionId, ServiceDepartment, ServiceDepartmentInfo } from '../../../types/ndh';
import { DIRECTION_CONFIGS } from '../DirectionStyles';
import { SERVICE_DEPARTMENTS } from '../../../data/mockData';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Search,
} from 'lucide-react';

interface ServicesPreviewProps {
  direction: DesignDirectionId;
  onOpenBriefWizard: () => void;
}

export const ServicesPreview: React.FC<ServicesPreviewProps> = ({ direction, onOpenBriefWizard }) => {
  const config = DIRECTION_CONFIGS[direction];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<ServiceDepartment>('web_app_development');

  const filteredDepts = SERVICE_DEPARTMENTS.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const selectedDept: ServiceDepartmentInfo =
    SERVICE_DEPARTMENTS.find((d) => d.id === selectedDeptId) || SERVICE_DEPARTMENTS[0]!;

  return (
    <div className={`min-h-screen ${config.containerBg} py-12 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Layers className="w-3.5 h-3.5" />
            <span>Managed Service Matrix • Ten Core Departments</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl ${config.typographyHeading} text-foreground`}>
            World-Class Capabilities. Managed by Dedicated Project Managers.
          </h1>
          <p className={`text-base ${config.subtext} leading-relaxed`}>
            Every department is backed by vetted elite African talent, an experienced department lead, strict QA gates, and full intellectual property protection. No freelance bidding, no direct talent management overhead.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search capabilities, stacks, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenBriefWizard}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${config.accentBtn}`}
            >
              <span>Build Custom Scope</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 10 Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map((dept) => {
            const isSelected = selectedDeptId === dept.id;
            return (
              <div
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${config.cardBg} border ${
                  isSelected ? 'border-primary ring-2 ring-primary/20 shadow-xl' : `${config.cardBorder} hover:border-primary/50`
                } flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className={config.badgeStyle}>{dept.name.split('&')[0]}</span>
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{dept.averageTurnaroundDays}d SLA</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground">{dept.name}</h3>
                  <p className={`text-xs ${config.subtext} leading-relaxed line-clamp-3`}>{dept.description}</p>

                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Top Capabilities:</div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {dept.capabilities.slice(0, 3).map((cap, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground">Starting from:</div>
                    <div className={`text-base ${config.statValue}`}>${dept.startingBudgetUSD.toLocaleString()} USD</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBriefWizard();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive on Selected Department */}
        <div className={`p-8 rounded-2xl ${config.cardBg} border ${config.cardBorder} space-y-6 shadow-2xl`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-primary">Detailed Breakdown</span>
              <h2 className={`text-2xl font-bold text-foreground mt-1`}>{selectedDept.name}</h2>
              <p className={`text-sm ${config.subtext} mt-1`}>{selectedDept.tagline}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Lead Architect</div>
                <div className="font-semibold text-foreground text-sm">{selectedDept.leadName}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-foreground">Standard Deliverables Package</h4>
              <div className="space-y-2">
                {selectedDept.deliverables.map((del, i) => (
                  <div key={i} className="p-3 rounded-lg bg-background border border-border text-xs flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-foreground">Production Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDept.techStack.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-background border border-border font-mono text-xs text-foreground">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground space-y-1 mt-4">
                <div className="font-semibold text-foreground">Quality & SLA Guarantee:</div>
                <p>Every milestone undergoes strict PM code/asset reviews before client presentation. 100% IP ownership transferred upon settlement.</p>
              </div>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-background border border-border flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Tailored Proposal Engine:</div>
                <div className={`text-2xl ${config.statValue}`}>${selectedDept.startingBudgetUSD.toLocaleString()} USD</div>
                <div className="text-xs text-muted-foreground">₦{selectedDept.startingBudgetNGN.toLocaleString()} NGN equivalent</div>
                <p className="text-[11px] text-muted-foreground pt-2">
                  No public fixed pricing. Every proposal includes a tailored milestone schedule, PM allocation, and formal NDA.
                </p>
              </div>

              <button
                onClick={onOpenBriefWizard}
                className={`w-full py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 ${config.accentBtn}`}
              >
                <span>Initiate Proposal for {selectedDept.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

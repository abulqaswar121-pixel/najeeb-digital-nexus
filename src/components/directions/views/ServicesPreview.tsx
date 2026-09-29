import React, { useState } from 'react';
import { ServiceDepartment, ServiceDepartmentInfo } from '../../../types/ndh';
import { SERVICE_DEPARTMENTS } from '../../../data/mockData';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Search,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ServicesPreviewProps {
  direction?: string;
  onOpenBriefWizard: () => void;
}

export const ServicesPreview: React.FC<ServicesPreviewProps> = ({ onOpenBriefWizard }) => {
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
    <div className="min-h-screen bg-[#090D1A] text-slate-100 py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Managed Service Matrix • 10 Core Departments</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            World-Class Capabilities. Managed by Dedicated Project Managers.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every department is backed by vetted African engineering and design talent, an experienced department lead, strict QA gates, and full intellectual property escrow. Zero freelance bidding, zero communication chaos.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search capabilities, stacks (e.g. Next.js, Flutter, Brand, NDPR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={onOpenBriefWizard}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
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
                className={`p-6 rounded-2xl cursor-pointer transition-all bg-slate-900/90 border ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-2xl'
                    : 'border-slate-800 hover:border-blue-500/60 shadow-xl'
                } flex flex-col justify-between space-y-6 group`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800/80 text-[11px] font-semibold">
                      {dept.name.split('&')[0]}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{dept.averageTurnaroundDays}d SLA</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {dept.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Capabilities:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {dept.capabilities.slice(0, 3).map((cap, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Starting Investment:
                    </div>
                    <div className="text-sm font-mono font-bold text-blue-400">
                      ${dept.startingBudgetUSD.toLocaleString()} USD
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBriefWizard();
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 transition-all flex items-center gap-1"
                  >
                    <span>Scope</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Department Deep-Dive Box */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                Department Deep-Dive
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {selectedDept.name}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[11px] text-slate-400">Standard Delivery SLA</div>
                <div className="text-sm font-bold font-mono text-emerald-400">{selectedDept.averageTurnaroundDays} Days</div>
              </div>
              <button
                onClick={onOpenBriefWizard}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-transform hover:scale-105"
              >
                Initiate Department Brief
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Full Scope of Capabilities
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {selectedDept.capabilities.map((cap, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Engineered Tech Stacks
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDept.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Governance & Deliverables
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Dedicated PM SLA Oversight</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Clean Git Repositories & CI/CD Pipelines</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Full Intellectual Property Escrow Release</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

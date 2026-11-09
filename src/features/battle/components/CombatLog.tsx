import React from 'react';
import { Award } from 'lucide-react';
import type { DoctrinePlan, CampaignTarget } from '../types';

interface Props {
  selectedDoctrine: DoctrinePlan | null;
  combatLog: string[];
  currentTarget: CampaignTarget;
  strategicReport?: string;
}

export const CombatLog: React.FC<Props> = ({ selectedDoctrine, combatLog, currentTarget, strategicReport }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-800 p-3 gap-2 overflow-hidden">
      {/* Strategic Benchmark Output */}
      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
        <h3 className="m-0 mb-1.5 text-xs flex items-center gap-1.5 font-bold text-slate-200">
          <Award className="text-amber-400" size={14} /> Strategic Assessment
        </h3>
        <div className="text-[11px] text-slate-300 flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Target Node:</span>
            <strong className="text-emerald-400">{currentTarget.name}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Air Defense Grid:</span>
            <strong className="text-rose-400">{currentTarget.airDefenseDensity}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Doctrine:</span>
            <strong className="text-blue-400">{selectedDoctrine ? selectedDoctrine.name : 'None'}</strong>
          </div>
          {strategicReport && (
            <div className="mt-1 p-1.5 bg-slate-900 rounded border border-slate-800 text-[10px] text-sky-300 leading-tight">
              <strong>Outcome:</strong> {strategicReport}
            </div>
          )}
        </div>
      </div>

      {/* Operational & Combat Log Feed with Vertical Scroll */}
      <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-2.5 flex flex-col min-h-0">
        <h3 className="m-0 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">Operational Log</h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar text-[10px] font-mono flex flex-col gap-1.5 text-slate-300 pr-1">
          {combatLog.map((log, idx) => (
            <div key={idx} className="border-b border-slate-900/60 pb-1 leading-tight">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
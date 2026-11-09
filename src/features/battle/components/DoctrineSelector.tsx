import React from 'react';
import type { DoctrinePlan } from '../types';

interface Props {
  doctrines: DoctrinePlan[];
  selectedDoctrine: DoctrinePlan | null;
  onSelect: (doc: DoctrinePlan) => void;
  disabled: boolean;
}

export const DoctrineSelector: React.FC<Props> = ({ doctrines, selectedDoctrine, onSelect, disabled }) => {
  return (
    <div className="mt-4">
      <div className="text-xs font-bold text-slate-400 mb-2">SELECT OPERATIONAL DOCTRINE / CAMPAIGN PLAN</div>
      <div className="flex gap-3">
        {doctrines.map((doc) => {
          const Icon = doc.icon;
          const isSelected = selectedDoctrine?.id === doc.id;
          return (
            <div
              key={doc.id}
              onClick={() => !disabled && onSelect(doc)}
              className={`flex-1 p-3 rounded-lg border transition-colors ${
                disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              } ${
                isSelected ? 'bg-blue-950 border-blue-500 shadow-md shadow-blue-900/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} className="text-blue-400" />
                <strong className="text-xs">{doc.name}</strong>
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mb-1">{doc.doctrine}</div>
              <div className="text-[10px] text-slate-400 leading-tight mb-2">{doc.desc}</div>
              <div className="text-[10px] text-amber-300/90 italic border-t border-slate-800 pt-1">
                Tradeoff: {doc.strategicTradeoff}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
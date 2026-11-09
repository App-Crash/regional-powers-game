import React from 'react';
import type { CampaignTarget, TargetCategory } from '../types';
import { Target, Zap, Shield, Building2, Cpu } from 'lucide-react';

interface Props {
  priorities: CampaignTarget[];
  selectedCategory: TargetCategory;
  onSelect: (category: TargetCategory) => void;
  disabled: boolean;
}

const icons: Record<TargetCategory, any> = {
  logistics: Target,
  energy: Zap,
  bases: Shield,
  political: Building2,
  manufacturing: Cpu,
};

export const TargetPrioritySelector: React.FC<Props> = ({ priorities, selectedCategory, onSelect, disabled }) => {
  const categories: TargetCategory[] = ['logistics', 'energy', 'bases', 'political', 'manufacturing'];

  return (
    <div className="mt-2">
      <div className="text-[11px] font-bold text-slate-400 mb-1.5">SELECT STRATEGIC TARGET PRIORITY</div>
      <div className="grid grid-cols-5 gap-2">
        {categories.map((cat) => {
          const Icon = icons[cat];
          const isSelected = selectedCategory === cat;
          const sampleTarget = priorities.find(p => p.category === cat);

          return (
            <div
              key={cat}
              onClick={() => !disabled && onSelect(cat)}
              className={`p-2 rounded border transition-colors cursor-pointer ${
                disabled ? 'opacity-60 cursor-not-allowed' : ''
              } ${
                isSelected ? 'bg-blue-950 border-blue-500 shadow-sm shadow-blue-900/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={13} className="text-blue-400" />
                <strong className="text-[11px] capitalize truncate">{cat}</strong>
              </div>
              <div className="text-[9px] text-amber-400 font-medium truncate">
                Grid: {sampleTarget?.airDefenseDensity || 'Moderate'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
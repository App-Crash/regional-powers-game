import React, { useEffect, useState } from 'react';
import { gameApi } from '../services/gameApi';
import type { RuntimeHexEntity, HexData, DiplomaticStance, DiplomaticState } from '../features/home/HexTypes';

interface HexDetailsModalProps {
  selectedHex: RuntimeHexEntity | HexData | null;
  onClose: () => void;
}

export const HexDetailsModal: React.FC<HexDetailsModalProps> = ({ selectedHex, onClose }) => {
  const [stance, setStance] = useState<DiplomaticStance>('neutral');

  useEffect(() => {
    if (!selectedHex || !selectedHex.fac_ctl) {
      setStance('neutral');
      return;
    }

    gameApi.getDiplomaticState().then((diplomacy: DiplomaticState) => {
      const resolvedStance = gameApi.resolveFactionStance(selectedHex.fac_ctl, diplomacy);
      setStance(resolvedStance);
    });
  }, [selectedHex]);

  if (!selectedHex) return null;

  const displayName = 'sett_name' in selectedHex && selectedHex.sett_name && selectedHex.sett_name.trim() !== ''
    ? selectedHex.sett_name 
    : `Sector [${selectedHex.q}, ${selectedHex.r}]`;

  const population = 'population' in selectedHex ? selectedHex.population : 0;
  const elevation = 'elevation' in selectedHex ? selectedHex.elevation : 0;
  const infra = 'infra' in selectedHex ? selectedHex.infra : 1;

  const stanceStyles: Record<DiplomaticStance, { label: string; color: string }> = {
    player: { label: 'Controlled (Player)', color: 'text-sky-400' },
    friendly: { label: 'Allied Territory', color: 'text-emerald-400' },
    enemy: { label: 'Hostile Territory', color: 'text-rose-400' },
    neutral: { label: 'Neutral / Sovereign', color: 'text-slate-400' },
  };

  const currentStanceInfo = stanceStyles[stance] || stanceStyles.neutral;

  return (
    <div className="absolute bottom-8 left-8 z-50 w-[220px] rounded-xl bg-slate-950/85 p-4 text-slate-200 shadow-2xl backdrop-blur-md pointer-events-auto">
      <div className="flex items-center justify-between pb-2 mb-3">
        <h2 className="text-xs font-semibold text-slate-100 tracking-wider uppercase font-mono truncate mr-2">
          {displayName}
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-100 font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800/50 hover:bg-slate-800 transition-colors flex-shrink-0"
        >
          ESC
        </button>
      </div>

      <div className="space-y-2 font-mono text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-400">Coords</span>
          <span>{selectedHex.q}, {selectedHex.r}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Terrain</span>
          <span className="uppercase text-slate-300">{selectedHex.terrain}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Control</span>
          <span className={`uppercase font-semibold text-[10px] ${currentStanceInfo.color}`}>
            {selectedHex.fac_ctl} ({stance})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Pop</span>
          <span>{population.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Elev</span>
          <span>{elevation}m</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Infra</span>
          <span>Tier {infra}</span>
        </div>
      </div>
    </div>
  );
};
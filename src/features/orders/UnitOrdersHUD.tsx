import React from 'react';
import type { useUnitOrders } from './useUnitOrders';

type UnitOrdersReturn = ReturnType<typeof useUnitOrders>;

interface UnitOrdersHUDProps {
  orders: UnitOrdersReturn;
}

export const UnitOrdersHUD: React.FC<UnitOrdersHUDProps> = ({ orders }) => {
  const {
    phase,
    activeUnit,
    availableLogistics,
    assignedLogisticsIds,
    totalRange,
    destinationHex,
    isDestinationHostile,
    availableMissions,
    selectedMission,
    statusHint,
    toggleLogisticsUnit,
    confirmMission,
    cancelOrder,
  } = orders;

  if (phase === 'IDLE' || !activeUnit) return null;

  const promptText = statusHint
    ? statusHint
    : phase === 'UNIT_SELECTED'
    ? 'SELECT DESTINATION HEX WITHIN HALO OR ASSIGN LOGISTICS UNITS'
    : phase === 'DESTINATION_SELECTED'
    ? isDestinationHostile
      ? 'HOSTILE TARGET LOCKED — SELECT MISSION PROFILE'
      : 'FRIENDLY SECTOR — CONFIRM REDEPLOYMENT'
    : `ORDER LOCKED: ${selectedMission?.label.toUpperCase()}`;

  return (
    <>
      {/* Top-Center Slim Operational Prompt Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div
          className={`px-4 py-1.5 rounded bg-slate-950/90 border font-mono text-xs tracking-wider shadow-xl ${
            statusHint
              ? 'border-amber-500 text-amber-300'
              : 'border-sky-500/70 text-sky-300'
          }`}
        >
          {promptText}
        </div>
      </div>

      {/* Bottom-Left Compact Command Card (Leaves 85%+ of Map Clear) */}
      <div className="absolute bottom-5 left-5 z-30 w-80 max-h-[65vh] overflow-y-auto bg-slate-950/95 border border-sky-500/60 rounded-lg p-3.5 shadow-2xl font-mono text-xs text-slate-200 flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <div className="text-[10px] text-sky-400 tracking-widest">
              {activeUnit.callsign} // ACTIVE UNIT
            </div>
            <div className="font-bold text-sm text-white">{activeUnit.name}</div>
          </div>
          <button
            onClick={cancelOrder}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/60 text-slate-300 hover:text-rose-300 cursor-pointer"
          >
            CANCEL
          </button>
        </div>

        {/* Range & Halo Status */}
        <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
          <span className="text-slate-400">OPERATIONAL HALO:</span>
          <span className="font-bold text-cyan-300">
            {totalRange} HEXES ({activeUnit.organicRange} BASE
            {totalRange > activeUnit.organicRange
              ? ` +${totalRange - activeUnit.organicRange} EXT`
              : ''}
            )
          </span>
        </div>

        {/* Assign Logistics Units to Expand Halo */}
        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">
            Assign Logistics Units (Extend Range)
          </div>
          {availableLogistics.map((logUnit) => {
            const attached = assignedLogisticsIds.includes(logUnit.id);
            return (
              <button
                key={logUnit.id}
                onClick={() => toggleLogisticsUnit(logUnit.id)}
                className={`flex items-center justify-between px-2.5 py-2 rounded border text-left transition cursor-pointer ${
                  attached
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <span className="truncate pr-2">{logUnit.name}</span>
                <span className="text-[11px] font-bold text-cyan-400 shrink-0">
                  {attached ? 'ASSIGNED' : `+${logUnit.rangeBonus} HEX`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Destination & Mission Selection */}
        {destinationHex && (
          <div className="border-t border-slate-800 pt-2.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">DESTINATION:</span>
              <span
                className={`font-bold ${
                  isDestinationHostile ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {destinationHex.sett_name || `SECTOR [${destinationHex.q},${destinationHex.r}]`}{' '}
                {isDestinationHostile ? '[HOSTILE]' : '[FRIENDLY]'}
              </span>
            </div>

            {isDestinationHostile ? (
              <div className="flex flex-col gap-1.5">
                <div className="text-[11px] text-rose-300 uppercase tracking-wider">
                  Available Missions
                </div>
                {availableMissions.map((mission) => (
                  <button
                    key={mission.id}
                    onClick={() => confirmMission(mission)}
                    className={`p-2 rounded border text-left transition cursor-pointer ${
                      selectedMission?.id === mission.id
                        ? 'bg-rose-950/70 border-rose-500 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs text-rose-300">{mission.label}</div>
                    <div className="text-[11px] text-slate-400">{mission.description}</div>
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => confirmMission(null)}
                className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-wider transition cursor-pointer"
              >
                CONFIRM REDEPLOYMENT
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};
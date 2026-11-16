import React, { useEffect } from 'react';
import type { useUnitOrders } from './useUnitOrders';

type UnitOrdersReturn = ReturnType<typeof useUnitOrders>;

interface UnitStatsHUDProps {
  orders: UnitOrdersReturn;
}

export const UnitStatsHUD: React.FC<UnitStatsHUDProps> = ({ orders }) => {
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

  useEffect(() => {
    console.log(`[UnitStatsHUD Diagnostics] Render evaluation:`, {
      phase,
      hasActiveUnit: !!activeUnit,
      activeUnitId: activeUnit?.id,
      activeUnitName: activeUnit?.name,
    });
  }, [phase, activeUnit]);

  // FIX: Render as long as a unit is selected, ignoring stale 'IDLE' phase flags
  if (!activeUnit) {
    return null;
  }

  return (
    <>
      {/* Top-Center Slim Prompt Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div
          className={`px-4 py-1.5 rounded bg-slate-950/90 border font-mono text-xs tracking-wider shadow-xl ${
            statusHint ? 'border-amber-500 text-amber-300' : 'border-sky-500/70 text-sky-300'
          }`}
        >
          {statusHint
            ? statusHint
            : phase === 'UNIT_SELECTED' || activeUnit
            ? 'UNIT ACTIVE: SELECT DESTINATION HEX OR ASSIGN LOGISTICS'
            : isDestinationHostile
            ? 'HOSTILE TARGET LOCKED — SELECT MISSION PROFILE'
            : 'FRIENDLY SECTOR — CONFIRM REDEPLOYMENT'}
        </div>
      </div>

      {/* Bottom-Right Unit Stats & Orders Card */}
      <div className="absolute bottom-5 right-5 z-30 w-80 max-h-[68vh] overflow-y-auto bg-slate-950/95 border border-sky-500/60 rounded-lg p-3.5 shadow-2xl font-mono text-xs text-slate-200 flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <div className="text-[10px] text-sky-400 tracking-widest">
              {activeUnit.callsign || 'UNIT'} // {(activeUnit.domain || 'GROUND').toUpperCase()} UNIT
            </div>
            <div className="font-bold text-sm text-white">{activeUnit.name}</div>
          </div>
          <button
            onClick={() => {
              console.log(`[UnitStatsHUD Diagnostics] Close button clicked. Canceling order.`);
              cancelOrder();
            }}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/60 text-slate-300 hover:text-rose-300 cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>

        {/* Unit Stats Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div>
            <span className="opacity-60 text-[10px]">READINESS:</span>
            <div className="font-bold text-emerald-400">{activeUnit.readiness}%</div>
          </div>
          <div>
            <span className="opacity-60 text-[10px]">PERSONNEL:</span>
            <div className="font-bold text-sky-300">{(activeUnit.personnel || 0).toLocaleString()}</div>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-800">
            <span className="opacity-60 text-[10px]">EQUIPMENT:</span>
            <div className="font-semibold text-slate-200">{activeUnit.equipment || 'Standard Issue'}</div>
          </div>
        </div>

        {/* Operational Range & Logistics */}
        <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
          <span className="text-slate-400">OPERATIONAL HALO:</span>
          <span className="font-bold text-cyan-300">
            {totalRange ?? activeUnit.organicRange} HEXES ({activeUnit.organicRange} BASE)
          </span>
        </div>

        {availableLogistics && availableLogistics.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">
              Assign Logistics Support
            </div>
            {availableLogistics.map((logUnit) => {
              const attached = assignedLogisticsIds?.includes(logUnit.id);
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
        )}

        {/* Destination & Mission Controls */}
        {destinationHex && (
          <div className="border-t border-slate-800 pt-2.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">DESTINATION:</span>
              <span className={`font-bold ${isDestinationHostile ? 'text-rose-400' : 'text-emerald-400'}`}>
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
import React from 'react';
import { type RuntimeHexEntity, type InfrastructureNode } from '../services/gameApi';

interface AssetDetailsModalProps {
  hexData: RuntimeHexEntity | null;
  onClose: () => void;
  onNodeToggle?: (hexId: string, nodeId: string, newState: 'online' | 'offline') => void;
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({ hexData, onClose, onNodeToggle }) => {
  if (!hexData) return null;

  const isGreyZone = hexData.controlledBy === null || hexData.population < 500;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-wide text-white">
                {hexData.settlementName || `Sector [${hexData.q}, ${hexData.r}]`}
              </h2>
              {isGreyZone ? (
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full">
                  Grey Zone / Abandoned
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Controlled
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Coordinates: q: {hexData.q}, r: {hexData.r} | Elevation: {hexData.elevation}m
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Demographic & Regional Metrics */}
          <div className="grid grid-cols-3 gap-4 bg-slate-800/40 border border-slate-700/60 p-4 rounded-lg">
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Population</div>
              <div className="text-lg font-bold text-white mt-1">
                {hexData.population.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Terrain</div>
              <div className="text-lg font-bold text-white capitalize mt-1">
                {hexData.terrain}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Infrastructure Level</div>
              <div className="text-lg font-bold text-white mt-1">
                Tier {hexData.infrastructure}
              </div>
            </div>
          </div>

          {/* Granular Infrastructure Nodes */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Strategic Infrastructure Nodes ({hexData.infrastructureNodes.length})
            </h3>
            
            {hexData.infrastructureNodes.length === 0 ? (
              <p className="text-sm text-slate-500 italic bg-slate-800/20 p-4 rounded-lg text-center">
                No major strategic infrastructure nodes registered in this sector.
              </p>
            ) : (
              <div className="space-y-3">
                {hexData.infrastructureNodes.map((node: InfrastructureNode) => (
                  <div 
                    key={node.id} 
                    className="flex items-center justify-between bg-slate-800/60 border border-slate-700/80 p-4 rounded-lg hover:border-slate-600 transition-colors"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{node.name}</span>
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-slate-700 text-slate-300 rounded">
                          {node.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-4 font-mono">
                        <span>Tier: {node.tier}</span>
                        <span>Capacity: {node.capacity}%</span>
                        {node.maintenance_repair_progress > 0 && node.maintenance_repair_progress < 100 && (
                          <span className="text-amber-400">Repair: {node.maintenance_repair_progress}%</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-xs font-mono uppercase rounded-md font-bold ${
                        node.state === 'online' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {node.state}
                      </span>
                      
                      {onNodeToggle && (
                        <button
                          onClick={() => onNodeToggle(
                            hexData.id, 
                            node.id, 
                            node.state === 'online' ? 'offline' : 'online'
                          )}
                          className="px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
                        >
                          Toggle State
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-colors shadow-lg"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
import React from 'react';
import { Layers } from 'lucide-react';

interface LayerMenuProps {
  layers: {
    hexGrid: boolean;
    topology: boolean;
    resources: boolean;
    econ: boolean;
    milUnits: boolean;
  };
  onToggleLayer: (layerKey: keyof LayerMenuProps['layers']) => void;
}

export const LayerMenu: React.FC<LayerMenuProps> = ({ layers, onToggleLayer }) => {
  return (
    <div className="absolute top-4 left-4 z-20 w-52 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg shadow-2xl p-3 flex flex-col gap-2 font-mono text-xs text-slate-200 select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-slate-300 font-bold uppercase tracking-wider">
        <Layers size={14} className="text-blue-400" /> Layer Telemetry
      </div>

      <div className="flex flex-col gap-1.5 pt-1">
        <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 p-1.5 rounded transition-colors">
          <span>Hex Grid Overlay</span>
          <input 
            type="checkbox" 
            checked={layers.hexGrid} 
            onChange={() => onToggleLayer('hexGrid')}
            className="accent-blue-500 cursor-pointer w-4 h-4 rounded"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 p-1.5 rounded transition-colors">
          <span>Topology Contours</span>
          <input 
            type="checkbox" 
            checked={layers.topology} 
            onChange={() => onToggleLayer('topology')}
            className="accent-blue-500 cursor-pointer w-4 h-4 rounded"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 p-1.5 rounded transition-colors">
          <span>Resource Nodes</span>
          <input 
            type="checkbox" 
            checked={layers.resources} 
            onChange={() => onToggleLayer('resources')}
            className="accent-blue-500 cursor-pointer w-4 h-4 rounded"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 p-1.5 rounded transition-colors">
          <span>Economy Hubs</span>
          <input 
            type="checkbox" 
            checked={layers.econ} 
            onChange={() => onToggleLayer('econ')}
            className="accent-blue-500 cursor-pointer w-4 h-4 rounded"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 p-1.5 rounded transition-colors">
          <span>Military Units</span>
          <input 
            type="checkbox" 
            checked={layers.milUnits} 
            onChange={() => onToggleLayer('milUnits')}
            className="accent-blue-500 cursor-pointer w-4 h-4 rounded"
          />
        </label>
      </div>
    </div>
  );
};
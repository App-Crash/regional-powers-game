import React, { useState } from 'react';
import { CurvedEarthMap } from './CurvedEarthMap';
import { Shield, MessageSquare, FileText, Home, User, Layers, X, Cpu, Mountain, ChevronRight, Wrench, Send, Trash2, PlusCircle, Terminal } from 'lucide-react';
import type { HexMetadata } from './HexSelectionManager';

interface PlayerHomeViewportProps {
  onLaunchCampaign: () => void;
}

export const PlayerHomeViewport: React.FC<PlayerHomeViewportProps> = ({ onLaunchCampaign }) => {
  const [selectedHex, setSelectedHex] = useState<HexMetadata | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'brigade' | 'resource' | null>(null);

  const [layers, setLayers] = useState({
    hexGrid: true,
    topology: true,
    resources: true,
    econ: true,
    milUnits: true,
  });

  const handleToggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleAction = (actionName: string) => {
    console.log(`[Tactical Action Executed]: ${actionName}`);
    setActiveSubMenu(null);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 overflow-hidden select-none font-sans tracking-tight text-slate-200">
      
      {/* Top 15% Command Header & Navigation Bar */}
      <header className="h-[15%] min-h-[76px] max-h-[96px] bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-40 shadow-xl shrink-0">
        
        {/* Left Section: Title, Campaign, and Layer Menu */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg shadow-sm">
            <Shield size={16} className="text-blue-400" />
            <span className="font-semibold text-xs tracking-wide uppercase text-slate-100">Tactical Command</span>
          </div>
          
          <button 
            type="button"
            onClick={onLaunchCampaign}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] rounded-md transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            Launch Campaign
          </button>

          {/* Layer Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setLayersOpen(!layersOpen); setActiveSubMenu(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-[11px] text-slate-200 cursor-pointer transition-all shadow-sm font-medium"
            >
              <Layers size={14} className="text-blue-400" />
              <span>Telemetry Layers</span>
            </button>

            {layersOpen && (
              <div className="absolute top-full left-0 mt-2.5 w-60 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-3.5 flex flex-col gap-2 z-50 text-[11px]">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 border-b border-slate-800 mb-0.5">
                  Map Overlays
                </div>
                <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800 px-3 py-2 rounded-md transition-colors">
                  <span className="text-slate-300">Hex Grid Overlay</span>
                  <input 
                    type="checkbox" 
                    checked={layers.hexGrid} 
                    onChange={() => handleToggleLayer('hexGrid')}
                    className="accent-blue-500 cursor-pointer w-4 h-4 rounded-sm"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800 px-3 py-2 rounded-md transition-colors">
                  <span className="text-slate-300">Topology Contours</span>
                  <input 
                    type="checkbox" 
                    checked={layers.topology} 
                    onChange={() => handleToggleLayer('topology')}
                    className="accent-blue-500 cursor-pointer w-4 h-4 rounded-sm"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800 px-3 py-2 rounded-md transition-colors">
                  <span className="text-slate-300">Resource Nodes</span>
                  <input 
                    type="checkbox" 
                    checked={layers.resources} 
                    onChange={() => handleToggleLayer('resources')}
                    className="accent-blue-500 cursor-pointer w-4 h-4 rounded-sm"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800 px-3 py-2 rounded-md transition-colors">
                  <span className="text-slate-300">Economy Hubs</span>
                  <input 
                    type="checkbox" 
                    checked={layers.econ} 
                    onChange={() => handleToggleLayer('econ')}
                    className="accent-blue-500 cursor-pointer w-4 h-4 rounded-sm"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800 px-3 py-2 rounded-md transition-colors">
                  <span className="text-slate-300">Military Units</span>
                  <input 
                    type="checkbox" 
                    checked={layers.milUnits} 
                    onChange={() => handleToggleLayer('milUnits')}
                    className="accent-blue-500 cursor-pointer w-4 h-4 rounded-sm"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Windows-Style Vertical Sector Menu */}
        {selectedHex ? (
          <div className="relative">
            {/* Main Windows Menu Trigger / Header Button */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg shadow-2xl text-[11px] overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveSubMenu(activeSubMenu ? null : 'brigade')}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition-colors cursor-pointer border-r border-slate-700"
              >
                <Terminal size={14} className="text-blue-400" />
                <span>{selectedHex.title}</span>
              </button>

              <button 
                type="button"
                onClick={() => { setSelectedHex(null); setActiveSubMenu(null); }}
                className="text-slate-400 hover:text-white px-3.5 py-2.5 hover:bg-slate-800 cursor-pointer transition-colors"
                title="Close Sector Menu"
              >
                <X size={14} />
              </button>
            </div>

            {/* Windows Vertical Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-3 flex flex-col gap-1.5 z-50 text-[11px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 border-b border-slate-800 mb-1">
                Sector Contents
              </div>

              {/* Military Unit Menu Item */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveSubMenu(activeSubMenu === 'brigade' ? null : 'brigade')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-left transition-colors cursor-pointer ${
                    activeSubMenu === 'brigade' ? 'bg-slate-800 text-blue-400 font-semibold' : 'hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield size={14} className="text-blue-400 shrink-0" />
                    <span>{selectedHex.brigade}</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-400" />
                </button>

                {/* Sub-menu modal dropdown */}
                {activeSubMenu === 'brigade' && (
                  <div className="absolute left-full top-0 ml-2.5 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-3 flex flex-col gap-1.5 z-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 border-b border-slate-800 mb-1">
                      Unit Orders
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleAction('Redeploy Unit')}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-800 rounded-md text-left text-slate-200 transition-colors cursor-pointer font-medium"
                    >
                      <Send size={13} className="text-blue-400 shrink-0" />
                      <span>Redeploy Brigade</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleAction('Disband Unit')}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-red-950/40 rounded-md text-left text-red-400 transition-colors cursor-pointer font-medium"
                    >
                      <Trash2 size={13} className="text-red-400 shrink-0" />
                      <span>Disband Brigade</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Resource Menu Item */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveSubMenu(activeSubMenu === 'resource' ? null : 'resource')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-left transition-colors cursor-pointer ${
                    activeSubMenu === 'resource' ? 'bg-slate-800 text-amber-400 font-semibold' : 'hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu size={14} className="text-amber-400 shrink-0" />
                    <span>{selectedHex.resource}</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-400" />
                </button>

                {/* Sub-menu modal dropdown */}
                {activeSubMenu === 'resource' && (
                  <div className="absolute left-full top-0 ml-2.5 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-3 flex flex-col gap-1.5 z-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 border-b border-slate-800 mb-1">
                      Infrastructure
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleAction('Build Mine')}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-800 rounded-md text-left text-slate-200 transition-colors cursor-pointer font-medium"
                    >
                      <PlusCircle size={13} className="text-amber-400 shrink-0" />
                      <span>Construct Extraction Mine</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleAction('Build Logistics Hub')}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-800 rounded-md text-left text-slate-200 transition-colors cursor-pointer font-medium"
                    >
                      <Wrench size={13} className="text-amber-400 shrink-0" />
                      <span>Build Logistics Hub</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Terrain Menu Item (Static info) */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-slate-300 bg-slate-800/40">
                <Mountain size={14} className="text-emerald-400 shrink-0" />
                <span>{selectedHex.terrain}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 italic hidden lg:block">
            [ Right-click map sectors to open sector menu ]
          </div>
        )}

        {/* Right Section: Navigation Icons & Commander Profile */}
        <div className="flex items-center gap-3">
          <button type="button" className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm" title="Lobby">
            <Home size={16} />
          </button>
          <button type="button" className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm" title="Reports">
            <FileText size={16} />
          </button>
          <button type="button" className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm" title="Message Center">
            <MessageSquare size={16} />
          </button>
          <div className="h-6 w-[1px] bg-slate-700 mx-1" />
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/60 border border-slate-700/50 rounded-md text-[11px] shadow-sm">
            <User size={14} className="text-emerald-400" />
            <span className="text-slate-300 font-semibold">Commander</span>
          </div>
        </div>

      </header>

      {/* Bottom 85% Scroll-Free 3D Map Viewport */}
      <div className="h-[85%] w-full relative overflow-hidden">
        <CurvedEarthMap layers={layers} onSelectHex={(hex) => { setSelectedHex(hex); setActiveSubMenu(null); }} />
      </div>

    </div>
  );
};
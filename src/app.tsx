// src/App.tsx
import React, { useState, useEffect } from 'react';
import { PlayerHomeViewport } from './features/home/PlayerHomeViewport';
import { useTheaterEditor } from './features/editor/TheaterEditorState';
import { TheaterEditorUI } from './features/editor/TheaterEditorUI';
import { getEraThemeConfig } from './services/theater/eraConfig';
import { MOCK_CARACAS_REPORT } from './data/mockOperationCaracas';
import { MOCK_VENEZUELA_RAID_RESULT } from './types/operationSchema';
import { NewspaperModal } from './components/NewspaperModal';
import { type BattleReport } from './types/battleReport';

export const App: React.FC = () => {
  const [activeBattleReport, setActiveBattleReport] = useState<BattleReport | null>(null);
  const [showNewspaper, setShowNewspaper] = useState(false);
  const [hudState, setHudState] = useState({ simClock: '01:00 AM', headline: '', note: '' });
  
  const editor = useTheaterEditor();

  const isDeveloper = true; 
  const era = 'cold_war_1983';
  const theme = getEraThemeConfig(era);

  useEffect(() => {
    const handleExecute = () => {
      // Close any active layer menus or dev overlays when launching scenario
      window.dispatchEvent(new CustomEvent('close-editor-menus'));
      setActiveBattleReport(MOCK_CARACAS_REPORT);
      setShowNewspaper(false);
    };

    const handleExecuteJson = () => {
      // Close any active layer menus or dev overlays when launching scenario
      window.dispatchEvent(new CustomEvent('close-editor-menus'));
      setActiveBattleReport(MOCK_VENEZUELA_RAID_RESULT as unknown as BattleReport);
      setShowNewspaper(false);
    };

    window.addEventListener('execute-scenario', handleExecute as EventListener);
    window.addEventListener('execute-scenario-json', handleExecuteJson as EventListener);
    return () => {
      window.removeEventListener('execute-scenario', handleExecute as EventListener);
      window.removeEventListener('execute-scenario-json', handleExecuteJson as EventListener);
    };
  }, []);

  const handleLaunchCampaign = (payload: any) => {
    if (payload && payload.operationId) {
      window.dispatchEvent(new CustomEvent('close-editor-menus'));
      setActiveBattleReport(payload);
      setShowNewspaper(false);
    }
  };

  return (
    <div className={`w-screen h-screen ${theme.containerClasses} overflow-hidden relative flex flex-col select-none`}>
      {isDeveloper && (
        <header className={`h-[10%] min-h-[56px] px-6 flex items-center justify-between z-20 shadow-lg ${theme.headerClasses} border-b border-amber-500/30 gap-4 shrink-0`}>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse"></span>
              <h1 className="tracking-widest text-base md:text-lg font-bold">
                {theme.hudTitle}
              </h1>
            </div>

            <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800">
              <button
                onClick={() => editor.setMode('dev')}
                className={`px-3 py-1 rounded transition text-xs font-semibold ${
                  editor.mode === 'dev' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🛠️ Dev Editor
              </button>
              <button
                onClick={() => editor.setMode('player')}
                className={`px-3 py-1 rounded transition text-xs font-semibold ${
                  editor.mode === 'player' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🎮 Player View
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end overflow-x-auto">
            {editor.mode === 'dev' && <TheaterEditorUI {...editor} />}
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <button
              onClick={() => {
                const event = new CustomEvent('execute-scenario');
                window.dispatchEvent(event);
              }}
              className="px-4 py-1.5 text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 rounded transition shadow-[0_0_12px_rgba(245,158,11,0.6)] tracking-widest cursor-pointer w-full text-center"
            >
              EXECUTE SCENARIO
            </button>
            <button
              onClick={() => {
                const event = new CustomEvent('execute-scenario-json');
                window.dispatchEvent(event);
              }}
              className="px-3 py-1 text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 rounded transition tracking-wider cursor-pointer w-full text-center shadow-sm"
            >
              🚀 JSON MODULAR REPLAY
            </button>
          </div>
        </header>
      )}

      {/* NON-BLOCKING TELEMETRY HUD PLACED STRICTLY BELOW DEV HEADER */}
      {activeBattleReport && !showNewspaper && (
        <div className="absolute top-[68px] left-1/2 -translate-x-1/2 z-30 w-full max-w-xl bg-slate-950/85 border border-emerald-500/40 px-4 py-2 font-mono text-emerald-400 shadow-lg rounded pointer-events-none backdrop-blur-sm">
          <div className="flex justify-between text-[11px] text-amber-400 mb-0.5">
            <span>THEATER TELEMETRY // {activeBattleReport.operationId}</span>
            <span className="font-bold">{hudState.simClock}</span>
          </div>
          <div className="text-xs font-bold text-white tracking-wide">{hudState.headline}</div>
          <div className="text-[11px] text-slate-300">{hudState.note}</div>
        </div>
      )}

      <div className="flex-1 relative w-full overflow-hidden">
        <PlayerHomeViewport 
          editor={editor}
          onLaunchCampaign={handleLaunchCampaign}
          {...({
            activeBattleReport,
            onBattleComplete: () => setShowNewspaper(true),
            onTimeUpdate: (simClock: string, headline: string, note: string) => 
              setHudState({ simClock, headline, note })
          } as any)} 
        />
      </div>

      {/* DEFINITIVE ROOT MODAL MOUNT */}
      {showNewspaper && activeBattleReport && (
        <NewspaperModal
          report={activeBattleReport}
          onClose={() => {
            setShowNewspaper(false);
            setActiveBattleReport(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
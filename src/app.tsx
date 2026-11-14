import React, { useState } from 'react';
import { PlayerHomeViewport } from './features/home/PlayerHomeViewport';
import { BattleArenaScreen } from './features/battle/BattleArenaScreen';
import { useTheaterEditor } from './features/editor/TheaterEditorState';
import { TheaterEditorUI } from './features/editor/TheaterEditorUI';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'HOME' | 'BATTLE'>('HOME');
  const editor = useTheaterEditor();

  return (
    <div className="w-screen h-screen bg-slate-950 overflow-hidden relative">
      {currentView === 'HOME' && (
        <TheaterEditorUI {...editor} />
      )}

      {currentView === 'HOME' ? (
        <PlayerHomeViewport 
          editor={editor}
          onLaunchCampaign={() => setCurrentView('BATTLE')} 
        />
      ) : (
        <div className="relative w-full h-full">
          <button 
            type="button"
            onClick={() => setCurrentView('HOME')}
            className="absolute top-3 right-3 z-50 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-xs font-mono text-slate-300 hover:bg-slate-800 cursor-pointer shadow-lg"
          >
            ← Return to Player Home
          </button>
          <BattleArenaScreen />
        </div>
      )}
    </div>
  );
};

export default App;
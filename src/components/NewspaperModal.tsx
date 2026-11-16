import React, { useState } from 'react';
import { type BattleReport } from '../types/battleReport';

interface NewspaperModalProps {
  report: BattleReport;
  onClose: () => void;
}

export const NewspaperModal: React.FC<NewspaperModalProps> = ({ report, onClose }) => {
  const [showFullAAR, setShowFullAAR] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      {!showFullAAR ? (
        /* Front-Page 1983 Newspaper Reveal (Strictly dead-centered, 50% screen dimensions) */
        <div 
          className="w-[50vw] h-[50vh] min-w-[750px] min-h-[550px] max-w-7xl max-h-[90vh] border-4 border-stone-900 shadow-2xl p-8 font-serif flex flex-col justify-between overflow-y-auto m-auto"
          style={{ backgroundColor: '#d1c7aa', color: '#0c0a09' }}
        >
          <div>
            <div className="flex justify-between items-center border-b-2 border-stone-900 pb-3 mb-4 text-sm uppercase tracking-widest font-black" style={{ color: '#0c0a09' }}>
              <span>The Bogota &amp; Caracas Chronicle</span>
              <span>Special Morning Edition • October 1983</span>
            </div>

            {/* Headline doubled in size */}
            <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tight leading-none text-center my-4" style={{ color: '#0c0a09' }}>
              {report.newspaperHeadline}
            </h1>

            {/* Subhead text under headline doubled in size */}
            <p className="text-center font-sans text-xl md:text-2xl font-extrabold uppercase tracking-wider border-y border-stone-600 py-3 mb-6" style={{ backgroundColor: '#c4b998', color: '#1c1917' }}>
              {report.newspaperSubhead}
            </p>

            {/* True 2-Column Newspaper Layout */}
            <div className="grid grid-cols-2 gap-8 font-serif leading-relaxed border-b border-stone-600 pb-6 mb-6 text-left" style={{ color: '#0c0a09' }}>
              
              {/* Column 1: Article text doubled in size */}
              <div className="space-y-4 text-2xl md:text-3xl text-left leading-normal">
                <p className="first-letter:text-8xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-stone-950">
                  <strong>MARACAY, VENEZUELA</strong> — In a daring pre-dawn clandestine operation, Colombian special naval forces executed a synchronized tactical strike across the disputed frontier. Coordinating stealth submarine positioning with precision cruise missile salvoes, elite units neutralized high-value regional logistics hubs.
                </p>
                <p className="text-left">
                  Military analysts confirm that the operation involved covert border infiltration maneuvers followed by volley launches targeting fortified command nodes. Telemetry indicates catastrophic structural failure at the primary depot complex.
                </p>
              </div>

              {/* Column 2: 1980s Latin American Soldier Photo (75% width) and Strike Damage Ledger */}
              <div className="space-y-6 flex flex-col justify-between">
                <div className="border-2 border-stone-800 p-2 bg-[#c4b998]/50 shadow-md w-[75%] mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1579912438250-13d8d641d4c2?q=80&w=600&auto=format&fit=crop" 
                    alt="Latin American military soldier in the 1980s"
                    className="w-full h-32 object-cover grayscale contrast-125 border border-stone-700 mb-1.5"
                  />
                  <p className="text-[10px] font-sans italic text-stone-900 text-center leading-tight">
                    Fig. 1 — Frontline tactical infantry units deployed during frontier border patrols.
                  </p>
                </div>

                <div className="p-4 border border-stone-700 text-base text-left" style={{ backgroundColor: '#c4b998' }}>
                  <h3 className="font-sans font-black text-sm uppercase tracking-wider border-b border-stone-700 pb-1 mb-2">
                    Strike Damage &amp; Casualties
                  </h3>
                  <ul className="space-y-1.5 font-mono text-sm">
                    <li>&bull; <strong>Target:</strong> Maracay Supply Depot</li>
                    <li>&bull; <strong>Damage:</strong> Twin roofs collapsed inward</li>
                    <li>&bull; <strong>Attacker Losses:</strong> {report.aarSummary?.casualties?.attacker || 'Minimal / Extracted'}</li>
                    <li>&bull; <strong>Defender Status:</strong> {report.aarSummary?.casualties?.defender || 'Garrison Disrupted'}</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <div className="flex flex-row gap-6 justify-center items-center pt-2">
            <button
              onClick={() => setShowFullAAR(true)}
              className="px-6 py-3 bg-red-900 hover:bg-red-800 text-white font-sans font-bold uppercase tracking-wider text-base transition cursor-pointer shadow-md"
            >
              Open Classified Battle Report &rarr;
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-stone-900 hover:bg-stone-400 font-sans font-bold uppercase tracking-wider text-base transition cursor-pointer"
              style={{ color: '#0c0a09', backgroundColor: '#e2d9c2' }}
            >
              Return to Theater Map
            </button>
          </div>
        </div>
      ) : (
        /* Detailed After-Action Report (AAR) Ledger (Dead-centered) */
        <div className="w-[50vw] h-[50vh] min-w-[750px] min-h-[550px] max-w-7xl max-h-[90vh] bg-slate-950 text-emerald-400 border border-emerald-500/40 p-8 font-mono shadow-2xl flex flex-col justify-between overflow-y-auto m-auto">
          <div>
            <div className="flex justify-between items-center border-b border-emerald-500/30 pb-3 mb-6">
              <h2 className="text-lg font-bold">AFTER-ACTION REPORT // {report.operationId}</h2>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm font-bold">
                {report.outcomeCode}
              </span>
            </div>

            <div className="space-y-6 text-base text-left">
              <div>
                <h3 className="text-sm uppercase text-slate-400 mb-2 font-bold tracking-widest">Timeline Telemetry</h3>
                <ul className="space-y-2 text-slate-200">
                  {report.aarSummary?.keyEvents?.map((ev, i) => (
                    <li key={i}>&bull; {ev}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-900/90 p-4 border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Colombian Losses</div>
                  <div className="text-amber-400 font-bold mt-1 text-lg">{report.aarSummary?.casualties?.attacker}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Venezuelan Status</div>
                  <div className="text-red-400 font-bold mt-1 text-lg">{report.aarSummary?.casualties?.defender}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase text-slate-400 mb-2 font-bold tracking-widest">Post-Battle Ledger &amp; Promotions</h3>
                <div className="flex flex-wrap gap-2">
                  {report.aarSummary?.rewards?.map((rew, i) => (
                    <span key={i} className="px-3 py-1.5 bg-emerald-950 border border-emerald-600/40 text-sm text-emerald-300">
                      {rew}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-base uppercase tracking-wider cursor-pointer transition"
            >
              Acknowledge &amp; Exit Replay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
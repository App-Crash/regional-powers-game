import React, { useState } from 'react';
import { type BattleReport } from '../types/battleReport';

interface NewspaperModalProps {
  report: BattleReport;
  onClose: () => void;
}

export const NewspaperModal: React.FC<NewspaperModalProps> = ({ report, onClose }) => {
  const [showFullAAR, setShowFullAAR] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {!showFullAAR ? (
        /* Front-Page 1983 Newspaper Reveal */
        <div className="max-w-2xl w-full bg-[#f4efe6] text-stone-900 border-4 border-stone-800 shadow-2xl p-8 font-serif">
          <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-4 text-xs uppercase tracking-widest">
            <span>The Bogota &amp; Caracas Chronicle</span>
            <span>Special Morning Edition • 1983</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none text-center my-6">
            {report.newspaperHeadline}
          </h1>

          <p className="text-center font-sans text-sm font-bold uppercase tracking-wider text-stone-700 border-y border-stone-400 py-2 mb-6">
            {report.newspaperSubhead}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <button
              onClick={() => setShowFullAAR(true)}
              className="px-6 py-3 bg-red-800 hover:bg-red-700 text-white font-sans font-bold uppercase tracking-wider text-sm transition cursor-pointer"
            >
              Open Classified Battle Report &rarr;
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 border border-stone-800 hover:bg-stone-200 text-stone-900 font-sans font-semibold uppercase tracking-wider text-xs transition cursor-pointer"
            >
              Return to Theater Map
            </button>
          </div>
        </div>
      ) : (
        /* Detailed After-Action Report (AAR) Ledger */
        <div className="max-w-2xl w-full bg-slate-950 text-emerald-400 border border-emerald-500/40 p-6 font-mono shadow-2xl">
          <div className="flex justify-between items-center border-b border-emerald-500/30 pb-3 mb-4">
            <h2 className="text-lg font-bold">AFTER-ACTION REPORT // {report.operationId}</h2>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs">
              {report.outcomeCode}
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-xs uppercase text-slate-400 mb-1">Timeline Telemetry</h3>
              <ul className="space-y-1 text-slate-200">
                {report.aarSummary.keyEvents.map((ev, i) => (
                  <li key={i}>&bull; {ev}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-3 border border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Colombian Losses</div>
                <div className="text-amber-400">{report.aarSummary.casualties.attacker}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Venezuelan Status</div>
                <div className="text-red-400">{report.aarSummary.casualties.defender}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase text-slate-400 mb-1">Post-Battle Ledger &amp; Promotions</h3>
              <div className="flex flex-wrap gap-2">
                {report.aarSummary.rewards.map((rew, i) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-950 border border-emerald-600/40 text-xs">
                    {rew}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Acknowledge &amp; Exit Replay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
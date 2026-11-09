import React, { useEffect, useRef } from 'react';
import type { Unit } from '../types';

interface Props {
  playerUnits: Unit[];
  enemyUnits: Unit[];
  battleResult: 'VICTORY' | 'DEFEAT' | null;
  onReset: () => void;
}

export const BattleCanvas: React.FC<Props> = ({ playerUnits, enemyUnits, battleResult, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const drawUnit = (unit: Unit, isPlayer: boolean) => {
      if (unit.hp <= 0) return;
      ctx.save();
      ctx.translate(unit.x, unit.y);

      ctx.beginPath();
      ctx.arc(0, 0, unit.range, 0, Math.PI * 2);
      ctx.strokeStyle = isPlayer ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = unit.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isPlayer ? '#93c5fd' : '#fca5a5';
      ctx.stroke();

      const hpPct = Math.max(0, unit.hp / unit.maxHp);
      ctx.fillStyle = '#000000';
      ctx.fillRect(-16, -22, 32, 5);
      ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : hpPct > 0.25 ? '#eab308' : '#ef4444';
      ctx.fillRect(-15, -21, 30 * hpPct, 3);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(unit.name, -20, 24);

      ctx.restore();
    };

    playerUnits.forEach((u) => drawUnit(u, true));
    enemyUnits.forEach((u) => drawUnit(u, false));
  }, [playerUnits, enemyUnits]);

  return (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
      <canvas ref={canvasRef} width={640} height={420} className="w-full block" />

      {battleResult && (
        <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center">
          <h2 className={`text-3xl font-bold m-0 ${battleResult === 'VICTORY' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {battleResult}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {battleResult === 'VICTORY'
              ? 'Intel Unlocked: Target vulnerability map updated (+55 FCD)'
              : 'Engagement Failed: Re-evaluate doctrine and radar countermeasures.'}
          </p>
          <button
            onClick={onReset}
            className="mt-4 px-5 py-2 rounded-md border-none bg-blue-600 text-white font-medium cursor-pointer hover:bg-blue-500"
          >
            Reset Simulation
          </button>
        </div>
      )}
    </div>
  );
};
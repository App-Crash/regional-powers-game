import React, { useState, useEffect, useRef } from 'react';
import type { CampaignTarget, TargetCategory, Unit, MobileAirDefenseNode } from '../types';
import sampleMapUrl from '../../../assets/sample-map.png';
import { ZoomIn, ZoomOut, Maximize2, Shield, Factory, Building, Zap, Truck, Radar, Cloud, Disc } from 'lucide-react';
import { TacticalAssetIcon } from './AssetIcons';

export interface ActiveMunition {
  id: string;
  unitId: string;
  unitName: string;
  unitType: 'DRONE' | 'MISSILE' | 'STRIKER' | 'SUPPORT';
  speed: number;
  progress: number;
  x: number;
  y: number;
  isDestroyed: boolean;
  threatState: 'CLEAR' | 'RADAR_LOCK' | 'UNDER_FIRE' | 'DESTROYED';
  lossesCount: number;
  explosionTimer: number;
}

interface ChromaKeyVideoProps {
  videoSrc: string;
  width?: number;
  height?: number;
  loop?: boolean;
  maxDuration?: number;
  onComplete?: () => void;
}

const ChromaKeyVideo: React.FC<ChromaKeyVideoProps> = ({ 
  videoSrc, 
  width = 64, 
  height = 64,
  loop = false,
  maxDuration = 19,
  onComplete 
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    video.currentTime = 0;
    video.play().catch(() => {});

    const processFrame = () => {
      if (!video || !canvas || !ctx) return;

      if ((video.currentTime >= maxDuration) || video.ended || video.paused) {
        if (!loop && onComplete) onComplete();
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);
      const frame = ctx.getImageData(0, 0, width, height);
      const data = frame.data;

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (green > 85 && red < 95 && blue < 95) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(frame, 0, 0);
      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', () => {
      animFrameRef.current = requestAnimationFrame(processFrame);
    });

    const handleTimeUpdate = () => {
      if (video.currentTime >= maxDuration) {
        video.pause();
        if (!loop && onComplete) onComplete();
      }
    };
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [width, height, loop, maxDuration, onComplete]);

  return (
    <div className="relative pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2 overflow-visible">
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute"
      />
    </div>
  );
};

interface Props {
  targets: CampaignTarget[];
  mobileDefenses: MobileAirDefenseNode[];
  selectedCategory: TargetCategory;
  selectedTarget: CampaignTarget;
  onSelectTarget: (target: CampaignTarget) => void;
  selectedUnitIds: string[];
  allUnits: Unit[];
  isSimulating: boolean;
  activeMunitions: ActiveMunition[];
  isTerminalImpact: boolean;
}

export const TargetMapCanvas: React.FC<Props> = ({ 
  targets, 
  mobileDefenses,
  selectedCategory, 
  selectedTarget, 
  onSelectTarget, 
  allUnits,
  isSimulating,
  activeMunitions,
  isTerminalImpact
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRubble, setShowRubble] = useState<boolean>(false);
  const homeBaseX = 140;
  const homeBaseY = 320;

  useEffect(() => {
    if (isTerminalImpact) {
      setShowRubble(false);
      const timer = setTimeout(() => {
        setShowRubble(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowRubble(false);
    }
  }, [isTerminalImpact]);

  const rangeThresholds = { short: 180, mid: 360, long: 580 };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.6, prev + delta), 2.0));
  };

  const baseWidth = 1200;
  const baseHeight = 800;
  const canvasWidth = baseWidth * zoomLevel;
  const canvasHeight = baseHeight * zoomLevel;

  const renderTargetIcon = (category: TargetCategory) => {
    const iconProps = { size: 16, className: "text-rose-500" };
    switch (category) {
      case 'bases': return <Shield {...iconProps} />;
      case 'manufacturing': return <Factory {...iconProps} />;
      case 'political': return <Building {...iconProps} />;
      case 'energy': return <Zap {...iconProps} />;
      case 'logistics': default: return <Truck {...iconProps} />;
    }
  };

  return (
    <div className="relative w-full h-full min-h-0 bg-slate-950 rounded-lg overflow-auto border border-slate-800 shadow-inner custom-scrollbar">
      {/* HUD Control Badge */}
      <div className="sticky top-3 left-3 z-20 inline-flex items-center gap-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded border border-slate-800 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
          <span className="font-semibold font-mono">
            {isSimulating ? 'SIMULATION PACING: 0.75x REAL-TIME' : 'Theater Map (Scroll X & Y)'}
          </span>
        </div>
        <div className="h-3 w-[1px] bg-slate-700" />
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => handleZoom(-0.15)} className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer" title="Zoom Out">
            <ZoomOut size={13} />
          </button>
          <span className="text-[10px] font-mono text-slate-400 w-9 text-center">{Math.round(zoomLevel * 100)}%</span>
          <button type="button" onClick={() => handleZoom(0.15)} className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer" title="Zoom In">
            <ZoomIn size={13} />
          </button>
          <button type="button" onClick={() => setZoomLevel(1)} className="p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer ml-1" title="Reset Zoom">
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      <svg width={canvasWidth} height={canvasHeight} viewBox={`0 0 ${baseWidth} ${baseHeight}`} className="bg-slate-950 block">
        <image href={sampleMapUrl} x="0" y="0" width={baseWidth} height={baseHeight} preserveAspectRatio="none" opacity="0.9" />

        {/* Range Boundary Rings */}
        <g strokeDasharray="5 5" opacity="0.6">
          <circle cx={homeBaseX} cy={homeBaseY} r={rangeThresholds.short} fill="rgba(34, 197, 94, 0.04)" stroke="#22c55e" strokeWidth="1.5" />
          <circle cx={homeBaseX} cy={homeBaseY} r={rangeThresholds.mid} fill="rgba(245, 158, 11, 0.03)" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx={homeBaseX} cy={homeBaseY} r={rangeThresholds.long} fill="rgba(239, 68, 68, 0.02)" stroke="#ef4444" strokeWidth="1.5" />
        </g>

        {/* Friendly HQ Command Node */}
        <circle cx={homeBaseX} cy={homeBaseY} r="16" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2.5" />
        <text x={homeBaseX} y={homeBaseY + 30} fill="#93c5fd" fontSize="11" fontWeight="bold" textAnchor="middle">Friendly HQ</text>

        {/* Strike Vector Line */}
        <line
          x1={homeBaseX} y1={homeBaseY} x2={selectedTarget.x} y2={selectedTarget.y}
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.6"
        />

        {/* Randomized Mobile SAM Ambush Nodes */}
        {mobileDefenses.map(aa => {
          if (!aa.isRevealed) return null;
          return (
            <g key={aa.id} transform={`translate(${aa.x}, ${aa.y})`}>
              <circle r={aa.detectionRadius} fill={aa.isDestroyed ? "rgba(100, 116, 139, 0.1)" : "rgba(239, 68, 68, 0.15)"} stroke={aa.isDestroyed ? "#64748b" : "#ef4444"} strokeWidth="1.5" strokeDasharray="4 4" className={aa.isDestroyed ? "" : "animate-pulse"} />
              <circle r="14" fill={aa.isDestroyed ? "#334155" : "#7f1d1d"} stroke={aa.isDestroyed ? "#94a3b8" : "#f87171"} strokeWidth="2" />
              <foreignObject x="-8" y="-8" width="16" height="16">
                <Radar size={16} className={aa.isDestroyed ? "text-slate-400" : "text-rose-400 animate-spin"} />
              </foreignObject>
              <text x="0" y="24" fill={aa.isDestroyed ? "#94a3b8" : "#fca5a5"} fontSize="10" fontWeight="bold" textAnchor="middle">
                {aa.name} {aa.isDestroyed ? '(SEAD DESTROYED)' : aa.ammoRemaining <= 0 ? '(Winchester)' : `(${aa.ammoRemaining}m)`}
              </text>
            </g>
          );
        })}

        {/* Active Transiting Assets with Tactical Asset Icons */}
        {activeMunitions.map(m => {
          if (m.isDestroyed && m.explosionTimer <= 0) return null;
          const isRadarLocked = m.threatState === 'RADAR_LOCK';
          const isExploding = m.explosionTimer > 0;
          const rangeClass = m.unitId === 'p1' ? 'short' : m.unitId === 'p2' ? 'mid' : 'long';

          return (
            <g key={m.id} transform={`translate(${m.x}, ${m.y})`}>
              {isRadarLocked && !isExploding && (
                <circle r="22" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" className="animate-ping" />
              )}

              {isExploding ? (
                <foreignObject x="-40" y="-40" width="80" height="80" className="overflow-visible">
                  <ChromaKeyVideo 
                    videoSrc="/explosions/explosion.webm" 
                    width={80} 
                    height={80} 
                    maxDuration={19} 
                  />
                </foreignObject>
              ) : (
                <g className="flex items-center">
                  <circle r="12" fill={isRadarLocked ? '#d97706' : '#0f172a'} stroke={isRadarLocked ? '#fbbf24' : '#38bdf8'} strokeWidth="2" />
                  <foreignObject x="-7" y="-7" width="14" height="14">
                    <TacticalAssetIcon type={m.unitType} rangeClass={rangeClass} size={14} className="text-sky-400" />
                  </foreignObject>
                  <rect x="16" y="-12" width="130" height="20" rx="3" fill="rgba(15, 23, 42, 0.9)" stroke={isRadarLocked ? '#f59e0b' : '#38bdf8'} strokeWidth="1" />
                  <text x="20" y="2" fill="#f0f9ff" fontSize="9" fontWeight="bold">
                    {m.unitName}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Campaign Target Nodes & Terminal Sequence */}
        {targets.map((target) => {
          const isMatchingCategory = target.category === selectedCategory;
          const isSelected = selectedTarget.id === target.id;
          const hasHeavyGrid = target.category === 'bases' || target.category === 'manufacturing' || target.category === 'political';
          const isTargetHit = isTerminalImpact && isSelected;

          return (
            <g 
              key={target.id} 
              onClick={() => isMatchingCategory && onSelectTarget(target)} 
              className={isMatchingCategory ? 'cursor-pointer' : 'cursor-not-allowed'}
              transform={`translate(${target.x}, ${target.y})`}
            >
              {hasHeavyGrid && (
                <circle r="45" fill="rgba(239, 68, 68, 0.06)" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
              )}

              <circle 
                cx="0" cy="0" r={isSelected ? 20 : 14} 
                fill={isSelected ? '#450a0a' : '#1e1b4b'} 
                stroke={isSelected ? '#f87171' : '#ef4444'} 
                strokeWidth={isSelected ? 3 : 2}
                opacity={isMatchingCategory ? 1 : 0.3}
              />
              
              <foreignObject x="-10" y="-10" width="20" height="20">
                <div className="flex items-center justify-center w-full h-full">
                  {renderTargetIcon(target.category)}
                </div>
              </foreignObject>

              {isTargetHit && !showRubble && (
                <foreignObject x="-48" y="-48" width="96" height="96" className="overflow-visible z-30">
                  <ChromaKeyVideo videoSrc="/explosions/explosion.webm" width={96} height={96} maxDuration={19} />
                </foreignObject>
              )}

              {showRubble && isSelected && (
                <foreignObject x="-48" y="-48" width="96" height="96" className="overflow-visible z-30">
                  <ChromaKeyVideo videoSrc="/explosions/smoking-rubble.webm" width={96} height={96} loop={true} maxDuration={19} />
                </foreignObject>
              )}

              {hasHeavyGrid && (
                <foreignObject x="12" y="-12" width="16" height="16">
                  <Disc size={14} className="text-rose-400" title="S-300/400 Integrated Battery Active" />
                </foreignObject>
              )}

              {target.smokeTurnsRemaining > 0 && !showRubble && (
                <g transform="translate(0, -22)">
                  <foreignObject x="-14" y="-14" width="28" height="28">
                    <div className="flex items-center justify-center text-slate-400 animate-pulse">
                      <Cloud size={26} className="text-slate-400 opacity-90" />
                    </div>
                  </foreignObject>
                  <text x="0" y="-18" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Cook-off ({target.smokeTurnsRemaining}t)
                  </text>
                </g>
              )}

              <text 
                x="0" y="26" 
                fill={isMatchingCategory ? '#f8fafc' : '#64748b'} 
                fontSize="11" fontWeight={isSelected ? 'bold' : 'normal'} textAnchor="middle"
              >
                {target.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
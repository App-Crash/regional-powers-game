import { useState, useEffect, useRef } from 'react';
import { Play, ShieldAlert, Crosshair, Layers, Target, Cpu, Plus, Minus } from 'lucide-react';
import type { DoctrinePlan, CampaignTarget, TargetCategory, Unit, MobileAirDefenseNode, PackageAllocation } from './types';
import { TargetMapCanvas } from './components/TargetMapCanvas';
import type { ActiveMunition } from './components/TargetMapCanvas';
import { CombatLog } from './components/CombatLog';

export const BattleArenaScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<TargetCategory>('logistics');
  const [selectedDoctrineId, setSelectedDoctrineId] = useState<string>('doc_sead');
  
  const [packageAllocations, setPackageAllocations] = useState<PackageAllocation[]>([
    { unitId: 'p1', count: 8 },
    { unitId: 'p2', count: 4 },
    { unitId: 'p3', count: 2 },
    { unitId: 'p4', count: 1 },
  ]);

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isTerminalImpact, setIsTerminalImpact] = useState<boolean>(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [strategicReport, setStrategicReport] = useState<string>('');
  const [activeMunitions, setActiveMunitions] = useState<ActiveMunition[]>([]);

  const [allUnits] = useState<Unit[]>([
    { 
      id: 'p1', 
      name: 'Gen 2 Quadcopter FPV (Low RCS)', 
      hp: 70, 
      maxHp: 70, 
      x: 140, 
      y: 320, 
      type: 'DRONE', 
      rangeClass: 'short', 
      atk: 30, 
      range: 200, 
      speed: 45, 
      color: '#22c55e', 
      reliabilityRate: 0.95, 
      stealthRating: 0.92, 
      inventoryCount: 30 
    },
    { id: 'p2', name: 'Mid-Range Jet Loiterer Swarm', hp: 110, maxHp: 110, x: 140, y: 320, type: 'DRONE', rangeClass: 'mid', atk: 40, range: 360, speed: 55, color: '#f59e0b', reliabilityRate: 0.80, stealthRating: 0.6, inventoryCount: 12 },
    { id: 'p3', name: 'Long-Range Cruise Missile', hp: 150, maxHp: 150, x: 140, y: 320, type: 'MISSILE', rangeClass: 'long', atk: 75, range: 580, speed: 85, color: '#ef4444', reliabilityRate: 0.95, stealthRating: 0.8, inventoryCount: 8 },
    { id: 'p4', name: 'Hypersonic Ballistic Strike', hp: 200, maxHp: 200, x: 140, y: 320, type: 'MISSILE', rangeClass: 'long', atk: 120, range: 580, speed: 130, color: '#a855f7', reliabilityRate: 0.92, stealthRating: 0.95, inventoryCount: 4 },
  ]);

  const [campaignTargets, setCampaignTargets] = useState<CampaignTarget[]>([
    { id: 't1', category: 'logistics', name: 'Railhead Ammo Depot', x: 280, y: 300, airDefenseDensity: 'Moderate (Pantsir Guarded)', strategicIntent: 'Disrupt armor supply lines using low-RCS swarms.', samAlertState: 'Standard', damageLevel: 0, smokeTurnsRemaining: 0, requiredAssetsHint: '💡 Optimal: Gen 2 Quadcopters bypass Pantsir radar.' },
    { id: 't2', category: 'logistics', name: 'Supply Depot Beta', x: 480, y: 460, airDefenseDensity: 'Low', strategicIntent: 'Halt fuel distribution.', samAlertState: 'Standard', damageLevel: 0, smokeTurnsRemaining: 0, requiredAssetsHint: '💡 Optimal: Low-cost FPV swarm saturation.' },
    { id: 't3', category: 'energy', name: 'Central Power Substation', x: 420, y: 180, airDefenseDensity: 'Low', strategicIntent: 'Degrade industrial grid.', samAlertState: 'Blinded / Jammed', damageLevel: 0, smokeTurnsRemaining: 0, requiredAssetsHint: 'Cruise / FPV mix' },
    { id: 't4', category: 'bases', name: 'Forward Air Base Delta', x: 680, y: 340, airDefenseDensity: 'Heavy Integrated Grid', strategicIntent: 'Eliminate interceptor wings.', samAlertState: 'High Alert', damageLevel: 0, smokeTurnsRemaining: 0, requiredAssetsHint: 'S-300 Grid: Requires SEAD' },
    { id: 't5', category: 'bases', name: 'Naval Command Citadel', x: 920, y: 580, airDefenseDensity: 'Heavy Integrated Grid', strategicIntent: 'Destroy C2 infrastructure.', samAlertState: 'High Alert', damageLevel: 0, smokeTurnsRemaining: 0, requiredAssetsHint: 'S-400 Grid: Heavily Hardened' },
    { id: 't6', category: 'political', name: 'Capital Communications Center', x: 860, y: 220, airDefenseDensity: 'Heavy Integrated Grid', strategicIntent: 'Sever leadership comms.', samAlertState: 'High Alert', damageLevel: 0, smokeTurnsRemaining: 0, requiredAssetsHint: 'S-300 Grid: Protected' },
  ]);

  const [mobileDefenses, setMobileDefenses] = useState<MobileAirDefenseNode[]>([]);

  const availableDoctrines: DoctrinePlan[] = [
    { id: 'doc_sead', name: 'Plan Alpha: SEAD Priority', doctrine: 'Suppression of Enemy Air Defenses', desc: 'Prioritize radar and anti-air nodes first.', strategicTradeoff: '+40% damage vs stationary nodes.', icon: Crosshair },
    { id: 'doc_saturation', name: 'Plan Beta: Echeloned Saturation', doctrine: 'Timed Wave Convergence', desc: 'Sync arrival timings of multiple low-cost munitions.', strategicTradeoff: 'High resource expenditure.', icon: Crosshair },
    { id: 'doc_masking', name: 'Plan Gamma: Electronic Masking', doctrine: 'Emission Control (EMCON)', desc: 'Minimize radar footprint.', strategicTradeoff: '+30% evasion against guided missiles.', icon: ShieldAlert },
  ];

  const filteredTargets = campaignTargets.filter(t => t.category === selectedCategory);
  const [selectedTarget, setSelectedTarget] = useState<CampaignTarget>(filteredTargets[0] || campaignTargets[0]);

  useEffect(() => {
    const validTargets = campaignTargets.filter(t => t.category === selectedCategory);
    if (validTargets.length > 0) {
      setSelectedTarget(validTargets[0]);
    }
  }, [selectedCategory]);

  const selectedDoctrine = availableDoctrines.find(d => d.id === selectedDoctrineId) || null;
  const distanceToTarget = Math.hypot(selectedTarget.x - 140, selectedTarget.y - 320);

  const initBattle = () => {
    setIsSimulating(false);
    setIsTerminalImpact(false);
    setActiveMunitions([]);
    setStrategicReport('');

    const randomizedMobileAA: MobileAirDefenseNode[] = [
      { id: 'm1', name: 'Pantsir-S1 (Logistics Screen)', x: Math.floor(Math.random() * 300) + 220, y: Math.floor(Math.random() * 250) + 200, detectionRadius: 75, isConcealed: true, isRevealed: false, ammoRemaining: 2, isDestroyed: false },
    ];
    setMobileDefenses(randomizedMobileAA);

    setCombatLog([
      `Campaign Strike Planning: Target [${selectedTarget.name}] selected (Dist: ${Math.round(distanceToTarget)}px). Defense Note: [${selectedTarget.airDefenseDensity}].`
    ]);
  };

  useEffect(() => {
    initBattle();
  }, [selectedTarget, selectedDoctrineId]);

  const updateAllocation = (unitId: string, delta: number) => {
    setPackageAllocations(prev => prev.map(item => {
      if (item.unitId === unitId) {
        const unit = allUnits.find(u => u.id === unitId);
        const maxAvailable = unit ? unit.inventoryCount : 0;
        const newCount = Math.min(Math.max(0, item.count + delta), maxAvailable);
        return { ...item, count: newCount };
      }
      return item;
    }));
  };

  const animFrameRef = useRef<number | null>(null);

  const executeStrikePackage = () => {
    const totalSelectedAssets = packageAllocations.reduce((sum, item) => sum + item.count, 0);
    if (!selectedDoctrine || totalSelectedAssets === 0 || isSimulating) return;

    const validAllocations = packageAllocations.filter(alloc => {
      const unit = allUnits.find(u => u.id === alloc.unitId);
      return unit && unit.range >= distanceToTarget && alloc.count > 0;
    });

    const validTotalAssets = validAllocations.reduce((sum, item) => sum + item.count, 0);
    if (validTotalAssets === 0) {
      setCombatLog(prev => ['⚠️ [LAUNCH ABORTED]: Selected munitions are out of range for this target node.', ...prev]);
      return;
    }

    setIsSimulating(true);
    setIsTerminalImpact(false);
    const homeX = 140;
    const homeY = 320;

    const readyMunitions: ActiveMunition[] = [];
    const logs: string[] = [`[14:00:00] Launching ${validTotalAssets} in-range assets under [${selectedDoctrine.name}]...`];

    validAllocations.forEach(alloc => {
      const unit = allUnits.find(u => u.id === alloc.unitId);
      if (!unit) return;

      let launchedCount = 0;
      let failedCount = 0;

      for (let i = 0; i < alloc.count; i++) {
        if (Math.random() <= unit.reliabilityRate) {
          launchedCount++;
          readyMunitions.push({
            id: `m-${unit.id}-${i}-${Date.now()}`,
            unitId: unit.id,
            unitName: unit.name,
            unitType: unit.type,
            speed: unit.speed,
            progress: 0,
            x: homeX,
            y: homeY,
            isDestroyed: false,
            threatState: 'CLEAR',
            lossesCount: 0,
            explosionTimer: 0
          });
        } else {
          failedCount++;
        }
      }

      if (failedCount > 0) {
        logs.unshift(`⚠️ [PRE-FLIGHT FAILURE]: ${failedCount}x ${unit.name} failed engine ignition on runway.`);
      }
      if (launchedCount > 0) {
        logs.unshift(`✈️ [CLEARED FOR TAKEOFF]: ${launchedCount}x ${unit.name} airborne.`);
      }
    });

    setCombatLog(prev => [...logs, ...prev]);

    if (readyMunitions.length === 0) {
      setIsSimulating(false);
      setCombatLog(prev => ['>>> STRIKE ABORTED: All units failed pre-flight checks.', ...prev]);
      return;
    }

    const totalDistance = Math.hypot(selectedTarget.x - homeX, selectedTarget.y - homeY);
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1) * 0.75;
      lastTime = now;

      readyMunitions.forEach(m => {
        if (m.isDestroyed && m.explosionTimer <= 0) return;

        if (m.explosionTimer > 0) {
          m.explosionTimer = Math.max(0, m.explosionTimer - dt);
          return;
        }

        const distMoved = m.speed * dt;
        m.progress = Math.min(1, m.progress + distMoved / totalDistance);
        m.x = homeX + (selectedTarget.x - homeX) * m.progress;
        m.y = homeY + (selectedTarget.y - homeY) * m.progress;

        mobileDefenses.forEach(aa => {
          if (aa.isDestroyed) return;
          const distToAA = Math.hypot(m.x - aa.x, m.y - aa.y);

          if (distToAA <= aa.detectionRadius && aa.ammoRemaining > 0) {
            if (!aa.isRevealed) {
              setMobileDefenses(prev => prev.map(item => item.id === aa.id ? { ...item, isRevealed: true } : item));
              setCombatLog(l => [`📡 [RADAR LOCK]: ${aa.name} acquired track lock at (${Math.round(aa.x)}, ${Math.round(aa.y)})!`, ...l]);
            }

            if (selectedDoctrineId === 'doc_sead') {
              setMobileDefenses(prev => prev.map(item => item.id === aa.id ? { ...item, isDestroyed: true } : item));
              setCombatLog(l => [`🎯 [SEAD SUPPRESSION]: Anti-radiation missile destroyed ${aa.name}!`, ...l]);
              return;
            }

            if (m.threatState === 'CLEAR') {
              m.threatState = 'RADAR_LOCK';
            }

            const isGen2QuadLogisticsStrike = m.unitId === 'p1' && selectedTarget.category === 'logistics';
            const hitChance = isGen2QuadLogisticsStrike ? 0.01 : 0.20;

            if (m.threatState === 'RADAR_LOCK' && Math.random() < hitChance) {
              m.threatState = 'UNDER_FIRE';
              m.lossesCount += 1;
              m.explosionTimer = 3.0;
              m.isDestroyed = true;

              setMobileDefenses(prev => prev.map(item => item.id === aa.id ? { ...item, ammoRemaining: aa.ammoRemaining - 1 } : item));
              setCombatLog(l => [`💥 [SAM INTERCEPTION]: ${aa.name} scored a rare hit on ${m.unitName}!`, ...l]);
            } else if (isGen2QuadLogisticsStrike && Math.random() < 0.15) {
              setCombatLog(l => [`⚡ [LOW RCS EVASION]: Gen 2 Quadcopter signature undetected by Pantsir radar near logistics node!`, ...l]);
            }
          }
        });
      });

      setActiveMunitions([...readyMunitions]);
      const activeCount = readyMunitions.filter(m => (!m.isDestroyed || m.explosionTimer > 0) && m.progress < 1).length;

      if (activeCount > 0) {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      } else {
        setIsSimulating(false);
        const surviving = readyMunitions.filter(m => !m.isDestroyed).length;
        const totalLost = readyMunitions.filter(m => m.isDestroyed).length;

        if (surviving > 0) {
          setIsTerminalImpact(true); // Terminal impact ONLY when surviving > 0
          const cookoffTurns = selectedTarget.category === 'logistics' || selectedTarget.category === 'energy' ? 5 : 2;
          setCampaignTargets(targets => targets.map(t => 
            t.id === selectedTarget.id ? { ...t, damageLevel: 85, smokeTurnsRemaining: cookoffTurns } : t
          ));

          setStrategicReport(`RAID SUCCESSFUL: ${surviving} munitions impacted ${selectedTarget.name} (${totalLost} lost). Virtually unstoppable!`);
          setCombatLog(l => [
            `>>> STRIKE SUMMARY: [${surviving}] Impacted Target | [${totalLost}] Intercepted.`,
            `>>> TARGET IMPACT: Warheads successfully detonated at ${selectedTarget.name}!`,
            ...l
          ]);
        } else {
          setIsTerminalImpact(false); // Strike failed: do not trigger base explosion
          setStrategicReport(`RAID FAILED: All ${totalLost} munitions intercepted by enemy SAM defenses.`);
          setCombatLog(l => [
            `>>> STRIKE SUMMARY: [0] Impacted Target | [${totalLost}] Intercepted.`,
            `>>> RAID FAILED: 100% munition attrition before target reach.`,
            ...l
          ]);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const totalSelectedAssets = packageAllocations.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden p-3 gap-3">
      <div className="grid grid-cols-[1fr_340px] gap-3 flex-1 min-h-0 overflow-hidden">
        <TargetMapCanvas
          targets={campaignTargets}
          mobileDefenses={mobileDefenses}
          selectedCategory={selectedCategory}
          selectedTarget={selectedTarget}
          onSelectTarget={setSelectedTarget}
          selectedUnitIds={packageAllocations.filter(p => p.count > 0).map(p => p.unitId)}
          allUnits={allUnits}
          isSimulating={isSimulating}
          activeMunitions={activeMunitions}
          isTerminalImpact={isTerminalImpact}
        />

        <div className="h-full min-h-0 overflow-hidden">
          <CombatLog
            selectedDoctrine={selectedDoctrine}
            combatLog={combatLog}
            currentTarget={selectedTarget}
            strategicReport={strategicReport}
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-stretch gap-3 shrink-0 shadow-xl">
        <div className="flex-1 flex flex-col gap-1 border-r border-slate-800 pr-3">
          <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
            <Target size={12} className="text-blue-400" /> 1. Target Category
          </label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory((e.currentTarget as HTMLSelectElement).value as TargetCategory)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="logistics">1. Logistics Hubs (Gen 2 FPV Optimal)</option>
            <option value="energy">2. Energy Infrastructure</option>
            <option value="bases">3. Military / Naval Bases</option>
            <option value="political">4. Political Power Centers</option>
            <option value="manufacturing">5. Military Manufacturing</option>
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-1 border-r border-slate-800 pr-3">
          <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
            <Layers size={12} className="text-emerald-400" /> 2. Target Node
          </label>
          <select 
            value={selectedTarget.id} 
            onChange={(e) => {
              const targetId = (e.currentTarget as HTMLSelectElement).value;
              const target = campaignTargets.find(t => t.id === targetId);
              if (target) setSelectedTarget(target);
            }}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
          >
            {filteredTargets.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.airDefenseDensity})</option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-1 border-r border-slate-800 pr-3">
          <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
            <ShieldAlert size={12} className="text-amber-400" /> 3. Doctrine Plan
          </label>
          <select 
            value={selectedDoctrineId} 
            onChange={(e) => setSelectedDoctrineId((e.currentTarget as HTMLSelectElement).value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
          >
            {availableDoctrines.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-[1.5] flex flex-col gap-1.5 border-r border-slate-800 pr-3">
          <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
            <Cpu size={12} className="text-sky-400" /> 4. Package Allocation
          </label>
          
          <div className="flex flex-col gap-1 max-h-[72px] overflow-y-auto custom-scrollbar pr-1">
            {allUnits.map(unit => {
              const allocated = packageAllocations.find(a => a.unitId === unit.id)?.count || 0;
              const isInRange = unit.range >= distanceToTarget;

              return (
                <div key={unit.id} className={`flex items-center justify-between border rounded px-2 py-0.5 text-[10px] ${isInRange ? 'bg-slate-950 border-slate-800' : 'bg-rose-950/30 border-rose-900/50 opacity-60'}`}>
                  <div className="flex flex-col truncate w-36">
                    <span className="truncate text-slate-300 font-medium">{unit.name}</span>
                    {!isInRange && <span className="text-[9px] text-rose-400 font-bold">Out of Range ({unit.range}px max)</span>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-mono">Stock: {unit.inventoryCount}</span>
                    <button 
                      type="button"
                      onClick={() => updateAllocation(unit.id, -1)}
                      className="p-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="font-mono font-bold text-sky-400 w-4 text-center">{allocated}</span>
                    <button 
                      type="button"
                      onClick={() => updateAllocation(unit.id, 1)}
                      disabled={unit.inventoryCount <= 0 || !isInRange}
                      className="p-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30 cursor-pointer"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col justify-end min-w-[150px]">
          <button
            onClick={executeStrikePackage}
            disabled={!selectedDoctrine || totalSelectedAssets === 0 || isSimulating}
            className={`w-full h-full py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 text-xs text-black cursor-pointer shadow-lg transition-all ${
              !selectedDoctrine || totalSelectedAssets === 0 || isSimulating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950'
            }`}
          >
            <Play size={16} />
            <div className="flex flex-col text-left">
              <span className="leading-tight">LAUNCH STRIKE</span>
              <span className="text-[9px] opacity-80 font-mono font-normal">({totalSelectedAssets} Assets Ready)</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
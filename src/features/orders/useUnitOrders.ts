import { useState, useMemo, useEffect } from 'react';
import {
  type CombatUnit,
  type LogisticsUnit,
  type MissionOption,
  type OrderPhase,
} from '../../types/unitOrders';
import { type HexData } from '../home/HexTypes';
import { GLOBAL_HEX_DATA } from '../home/HexGridLayer';
import { gameApi } from '../../services/gameApi';
import {
  INITIAL_COMBAT_UNITS,
  AVAILABLE_LOGISTICS_UNITS,
  HOSTILE_MISSIONS,
} from '../../data/mockUnits';
import { axialDistance, computeRangeHaloHexes } from './hexRangeMath';

export function useUnitOrders() {
  const [units, setUnits] = useState<CombatUnit[]>(INITIAL_COMBAT_UNITS);
  const [phase, setPhase] = useState<OrderPhase>('IDLE');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [assignedLogisticsIds, setAssignedLogisticsIds] = useState<string[]>([]);
  const [destinationHex, setDestinationHex] = useState<HexData | null>(null);
  const [selectedMission, setSelectedMission] = useState<MissionOption | null>(null);
  const [statusHint, setStatusHint] = useState<string | null>(null);
  const [inspectedHex, setInspectedHex] = useState<HexData | null>(null);

  useEffect(() => {
    if (GLOBAL_HEX_DATA.size === 0) return;
    setUnits((prev) =>
      prev.map((u) => {
        if (GLOBAL_HEX_DATA.has(`${u.q},${u.r}`)) return u;
        const playerHex = Array.from(GLOBAL_HEX_DATA.values()).find(
          (h) => gameApi.resolveFactionStance(h.fac_ctl) === 'player'
        );
        return playerHex ? { ...u, q: playerHex.q, r: playerHex.r } : u;
      })
    );
  }, []);

  const activeUnit = useMemo(
    () => units.find((u) => u.id === selectedUnitId) || null,
    [units, selectedUnitId]
  );

  const attachedLogistics: LogisticsUnit[] = useMemo(
    () => AVAILABLE_LOGISTICS_UNITS.filter((l) => assignedLogisticsIds.includes(l.id)),
    [assignedLogisticsIds]
  );

  const totalRange = useMemo(() => {
    if (!activeUnit) return 0;
    const bonus = attachedLogistics.reduce((sum, item) => sum + item.rangeBonus, 0);
    return activeUnit.organicRange + bonus;
  }, [activeUnit, attachedLogistics]);

  const haloHexes = useMemo(() => {
    if (!activeUnit || phase === 'IDLE') return [];
    return computeRangeHaloHexes(
      activeUnit.q,
      activeUnit.r,
      activeUnit.organicRange,
      totalRange
    );
  }, [activeUnit, phase, totalRange]);

  const isDestinationHostile = useMemo(() => {
    if (!destinationHex) return false;
    return gameApi.resolveFactionStance(destinationHex.fac_ctl) === 'enemy';
  }, [destinationHex]);

  const availableMissions = useMemo(
    () => (isDestinationHostile ? HOSTILE_MISSIONS : []),
    [isDestinationHostile]
  );

  const getUnitsAtHex = (q: number, r: number): CombatUnit[] => {
    return units.filter((u) => u.q === q && u.r === r);
  };

    const inspectHex = (hex: HexData | null) => {
    console.log(`[useUnitOrders] inspectHex invoked with:`, hex);
    setInspectedHex(hex ? { ...hex } : null);
  };

  const selectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setAssignedLogisticsIds([]);
    setDestinationHex(null);
    setSelectedMission(null);
    setStatusHint(null);
    setPhase('UNIT_SELECTED');
  };

  const cancelOrder = () => {
    setPhase('IDLE');
    setSelectedUnitId(null);
    setAssignedLogisticsIds([]);
    setDestinationHex(null);
    setSelectedMission(null);
    setStatusHint(null);
  };

  const toggleLogisticsUnit = (logisticsId: string) => {
    setAssignedLogisticsIds((prev) =>
      prev.includes(logisticsId)
        ? prev.filter((id) => id !== logisticsId)
        : [...prev, logisticsId]
    );
    setStatusHint(null);
  };

  const handleDestinationClick = (hex: HexData): boolean => {
    if (!activeUnit || (phase !== 'UNIT_SELECTED' && phase !== 'DESTINATION_SELECTED')) {
      return false;
    }

    const dist = axialDistance(activeUnit.q, activeUnit.r, hex.q, hex.r);
    if (dist > totalRange) {
      setStatusHint(`OUT OF RANGE (${dist} HEXES) — ASSIGN LOGISTICS TO EXTEND HALO`);
      return true;
    }

    setDestinationHex(hex);
    setSelectedMission(null);
    setStatusHint(null);
    setPhase('DESTINATION_SELECTED');
    return true;
  };

  const confirmMission = (mission: MissionOption | null) => {
    if (!activeUnit || !destinationHex) return;
    setSelectedMission(mission);

    if (!isDestinationHostile) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === activeUnit.id ? { ...u, q: destinationHex.q, r: destinationHex.r } : u
        )
      );
      cancelOrder();
      return;
    }

    setPhase('MISSION_CONFIRMED');
  };

  return {
    units,
    phase,
    activeUnit,
    availableLogistics: AVAILABLE_LOGISTICS_UNITS,
    assignedLogisticsIds,
    totalRange,
    haloHexes,
    destinationHex,
    isDestinationHostile,
    availableMissions,
    selectedMission,
    statusHint,
    inspectedHex,
    getUnitsAtHex,
    inspectHex,
    selectUnit,
    toggleLogisticsUnit,
    handleDestinationClick,
    confirmMission,
    cancelOrder,
  };
}
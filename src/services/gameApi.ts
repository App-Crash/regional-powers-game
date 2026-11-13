import { MOCK_COLOMBIA_THEATER } from './factions/col';
import {
  type RuntimeHexEntity,
  type InfraNode,
  type FactionCode,
  type DiplomaticState,
  type DiplomaticStance
} from '../features/home/HexTypes';

const SESSION_DIPLOMACY: DiplomaticState = {
  playerFaction: 'col',
  activeWars: {
    col: [],
    ven: [],
    ecu: [],
    bra: [],
    per: [],
    pan: []
  },
  allies: {
    col: [],
    ven: [],
    ecu: [],
    bra: [],
    per: [],
    pan: []
  }
};

const WORLD_THEATER_STORE: RuntimeHexEntity[] = [
  ...MOCK_COLOMBIA_THEATER
];

export const gameApi = {
  async getRuntimeTheater(): Promise<RuntimeHexEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...WORLD_THEATER_STORE]), 150);
    });
  },

  async getDiplomaticState(): Promise<DiplomaticState> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...SESSION_DIPLOMACY }), 50);
    });
  },

  async declareWar(aggressor: FactionCode, target: FactionCode): Promise<DiplomaticState> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!SESSION_DIPLOMACY.activeWars[aggressor].includes(target)) {
          SESSION_DIPLOMACY.activeWars[aggressor].push(target);
        }
        if (!SESSION_DIPLOMACY.activeWars[target].includes(aggressor)) {
          SESSION_DIPLOMACY.activeWars[target].push(aggressor);
        }
        SESSION_DIPLOMACY.allies[aggressor] = SESSION_DIPLOMACY.allies[aggressor].filter(f => f !== target);
        SESSION_DIPLOMACY.allies[target] = SESSION_DIPLOMACY.allies[target].filter(f => f !== aggressor);

        resolve({ ...SESSION_DIPLOMACY });
      }, 100);
    });
  },

  resolveFactionStance(
    targetFaction: FactionCode,
    diplomacy: DiplomaticState = SESSION_DIPLOMACY
  ): DiplomaticStance {
    const { playerFaction, activeWars, allies } = diplomacy;
    if (targetFaction === playerFaction) return 'player';
    if (activeWars[playerFaction]?.includes(targetFaction)) return 'enemy';
    if (allies[playerFaction]?.includes(targetFaction)) return 'friendly';
    return 'neutral';
  },

  async updateNodeStatus(
    hexId: string,
    nodeId: string,
    updates: Partial<InfraNode>
  ): Promise<RuntimeHexEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const targetHex = WORLD_THEATER_STORE.find(h => h.id === hexId);
        if (targetHex) {
          const targetNode = targetHex.infra_nodes.find((n: InfraNode) => n.id === nodeId);
          if (targetNode) {
            Object.assign(targetNode, updates);
          }
        }
        resolve([...WORLD_THEATER_STORE]);
      }, 100);
    });
  }
};
import { MOCK_COLOMBIA_THEATER } from './gameData';
import { type RuntimeHexEntity, type InfrastructureNode } from '../features/home/HexTypes';

export const gameApi = {
  async getRuntimeTheater(): Promise<RuntimeHexEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_COLOMBIA_THEATER]), 150);
    });
  },

  async updateNodeStatus(
    hexId: string, 
    nodeId: string, 
    updates: Partial<InfrastructureNode>
  ): Promise<RuntimeHexEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const targetHex = MOCK_COLOMBIA_THEATER.find(h => h.id === hexId);
        if (targetHex) {
          const targetNode = targetHex.infrastructureNodes.find(n => n.id === nodeId);
          if (targetNode) {
            Object.assign(targetNode, updates);
          }
        }
        resolve([...MOCK_COLOMBIA_THEATER]);
      }, 100);
    });
  }
};
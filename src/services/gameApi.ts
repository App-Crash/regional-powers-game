import { type HexData } from '../features/home/HexTypes';

export type OperationalState = 'online' | 'offline';

export type InfrastructureCategory = 
  | 'ELECTRIC_GENERATION'
  | 'ELECTRIC_DISTRIBUTION'
  | 'WATER_TREATMENT'
  | 'CIVIL_LOGISTICS'
  | 'TRANSPORTATION'
  | 'HEAVY_MANUFACTURING'
  | 'CONSUMER_MANUFACTURING'
  | 'COMMUNICATIONS';

export interface InfrastructureNode {
  id: string;
  name: string;
  category: InfrastructureCategory;
  tier: number;             // 1 to 10
  capacity: number;         // 0 to 100% effective output
  state: OperationalState;  // 'online' | 'offline'
  maintenance_repair_duration: number; // Total days
  maintenance_repair_progress: number; // Percentage (0 - 100)
}

export interface RuntimeHexEntity extends HexData {
  settlementName?: string;
  infrastructureNodes: InfrastructureNode[];
}

// Mock Database State representing Colombia Theater Baseline
const MOCK_COLOMBIA_THEATER: RuntimeHexEntity[] = [
  // 1. Cartagena (Anchor: q = -10, r = 7)
  {
    id: 'hex_cartagena',
    q: -10,
    r: 7,
    terrain: 'port',
    infrastructure: 8,
    population: 1010995,
    elevation: 2,
    wx: -25.0,
    wy: 12.0,
    controlledBy: 'player',
    settlementName: 'Cartagena',
    infrastructureNodes: [
      {
        id: 'node_cartagena_port',
        name: 'Contecar Maritime Terminal & Port Infrastructure',
        category: 'CIVIL_LOGISTICS',
        tier: 9,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_reficar',
        name: 'Reficar Heavy Refinery',
        category: 'HEAVY_MANUFACTURING',
        tier: 9,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  // 2. Barranquilla (Coastal North)
  {
    id: 'hex_barranquilla',
    q: -9,
    r: 6,
    terrain: 'port',
    infrastructure: 8,
    population: 1275854,
    elevation: 18,
    wx: -22.5,
    wy: 10.5,
    controlledBy: 'player',
    settlementName: 'Barranquilla',
    infrastructureNodes: [
      {
        id: 'node_barranquilla_pumarejo',
        name: 'Pumarejo Bridge Arterial Transit Corridor',
        category: 'TRANSPORTATION',
        tier: 8,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_barranquilla_power',
        name: 'Termobarranquilla Thermal Generation Plant',
        category: 'ELECTRIC_GENERATION',
        tier: 8,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  // 3. Soledad (Metropolitan Barranquilla Area)
  {
    id: 'hex_soledad',
    q: -9,
    r: 7,
    terrain: 'suburban',
    infrastructure: 6,
    population: 733597,
    elevation: 5,
    wx: -22.5,
    wy: 12.0,
    controlledBy: 'player',
    settlementName: 'Soledad',
    infrastructureNodes: [
      {
        id: 'node_soledad_airport',
        name: 'Ernesto Cortissoz International Transit Hub',
        category: 'TRANSPORTATION',
        tier: 7,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_soledad_substation',
        name: 'Soledad Regional 110kV Substation',
        category: 'ELECTRIC_DISTRIBUTION',
        tier: 6,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  // 4. Valledupar (Northeast Coast Interior)
  {
    id: 'hex_valledupar',
    q: -6,
    r: 5,
    terrain: 'farmland',
    infrastructure: 5,
    population: 629217,
    elevation: 168,
    wx: -15.0,
    wy: 9.0,
    controlledBy: 'player',
    settlementName: 'Valledupar',
    infrastructureNodes: [
      {
        id: 'node_valledupar_substation',
        name: 'Guatapurí Regional Substation',
        category: 'ELECTRIC_DISTRIBUTION',
        tier: 5,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_valledupar_agri',
        name: 'Cesar Valley Agricultural Processing Center',
        category: 'CONSUMER_MANUFACTURING',
        tier: 5,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  // 5. Cúcuta (Eastern Border Node)
  {
    id: 'hex_cucuta',
    q: -3,
    r: 3,
    terrain: 'urban',
    infrastructure: 6,
    population: 792180,
    elevation: 320,
    wx: -7.5,
    wy: 5.5,
    controlledBy: 'player',
    settlementName: 'Cúcuta',
    infrastructureNodes: [
      {
        id: 'node_tienditas_bridge',
        name: 'Atanasio Girardot International Bridge',
        category: 'TRANSPORTATION',
        tier: 7,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_cucuta_logistics',
        name: 'Norte de Santander Freight Customs Terminal',
        category: 'CIVIL_LOGISTICS',
        tier: 6,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  // 6. Bucaramanga (Northeastern Andes Ridge)
  {
    id: 'hex_bucaramanga',
    q: -3,
    r: 1,
    terrain: 'mountainous',
    infrastructure: 7,
    population: 618548,
    elevation: 959,
    wx: -7.5,
    wy: 2.0,
    controlledBy: 'player',
    settlementName: 'Bucaramanga',
    infrastructureNodes: [
      {
        id: 'node_sogamoso_hydro',
        name: 'Topocoro Sogamoso Hydroelectric Dam',
        category: 'ELECTRIC_GENERATION',
        tier: 9,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_palonegro_transit',
        name: 'Palonegro Highway Access Viaduct',
        category: 'TRANSPORTATION',
        tier: 6,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  // 7. Medellín (Aburrá Valley)
  {
    id: 'hex_medellin',
    q: -4,
    r: -1,
    terrain: 'urban',
    infrastructure: 9,
    population: 2526795,
    elevation: 1495,
    wx: -10.0,
    wy: -1.5,
    controlledBy: 'player',
    settlementName: 'Medellin',
    infrastructureNodes: [
      {
        id: 'node_mde_metro',
        name: 'Aburrá Valley Mass Transit & Rail Corridor',
        category: 'TRANSPORTATION',
        tier: 9,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_mde_textiles',
        name: 'Antioquia Industrial & Appliance Fabrication',
        category: 'HEAVY_MANUFACTURING',
        tier: 8,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  // 8. Bogotá (Capital Plateau Center: q = 0, r = 0)
  {
    id: 'hex_bogota',
    q: 0,
    r: 0,
    terrain: 'urban',
    infrastructure: 10,
    population: 7945996,
    elevation: 2640,
    wx: 0,
    wy: 0,
    controlledBy: 'player',
    settlementName: 'Bogotá',
    infrastructureNodes: [
      {
        id: 'node_bogota_guavio',
        name: 'Guavio Hydroelectric Generation Complex',
        category: 'ELECTRIC_GENERATION',
        tier: 10,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_bogota_eldorado',
        name: 'El Dorado International Freight & Civil Transit Hub',
        category: 'TRANSPORTATION',
        tier: 10,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_bogota_telecom',
        name: 'National Communications & Data Center Network',
        category: 'COMMUNICATIONS',
        tier: 9,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  // 9. Soacha (Metropolitan Bogotá South)
  {
    id: 'hex_soacha',
    q: 0,
    r: -1,
    terrain: 'suburban',
    infrastructure: 7,
    population: 895878,
    elevation: 2565,
    wx: 0,
    wy: -1.5,
    controlledBy: 'player',
    settlementName: 'Soacha',
    infrastructureNodes: [
      {
        id: 'node_autopista_sur',
        name: 'Autopista Sur Commuter Bottleneck Corridor',
        category: 'TRANSPORTATION',
        tier: 7,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_soacha_industrial',
        name: 'Industrial Material Processing & Assembly',
        category: 'CONSUMER_MANUFACTURING',
        tier: 6,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  // 10. Cali (Cauca Valley South)
  {
    id: 'hex_cali',
    q: -3,
    r: -4,
    terrain: 'urban',
    infrastructure: 8,
    population: 2269983,
    elevation: 1018,
    wx: -7.5,
    wy: -6.0,
    controlledBy: 'player',
    settlementName: 'Cali',
    infrastructureNodes: [
      {
        id: 'node_buenaventura_link',
        name: 'Pacific Freight & Highway Transit Link',
        category: 'TRANSPORTATION',
        tier: 8,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      },
      {
        id: 'node_cali_substation',
        name: 'San Carlos Distribution Grid Substation',
        category: 'ELECTRIC_DISTRIBUTION',
        tier: 8,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  }
];

/**
 * Mock REST API Client simulating a Python/Flask backend service
 */
export const gameApi = {
  async getRuntimeTheater(): Promise<RuntimeHexEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_COLOMBIA_THEATER]), 200);
    });
  },

  async updateNodeStatus(hexId: string, nodeId: string, updates: Partial<InfrastructureNode>): Promise<RuntimeHexEntity[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hex = MOCK_COLOMBIA_THEATER.find(h => h.id === hexId);
        if (hex) {
          const node = hex.infrastructureNodes.find(n => n.id === nodeId);
          if (node) {
            Object.assign(node, updates);
          }
        }
        resolve([...MOCK_COLOMBIA_THEATER]);
      }, 150);
    });
  }
};
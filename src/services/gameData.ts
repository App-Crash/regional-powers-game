import { type RuntimeHexEntity } from '../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER: RuntimeHexEntity[] = [
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
    settlementName: 'Cartagena', // ⚓ Fixed Reference Point
    infrastructureNodes: [
      {
        id: 'node_cartagena_port',
        name: 'Contecar Maritime Terminal',
        category: 'CIVIL_LOGISTICS',
        tier: 9,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
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
        id: 'node_barranquilla_power',
        name: 'Termobarranquilla Power',
        category: 'ELECTRIC_GENERATION',
        tier: 8,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
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
        id: 'node_soledad_sub',
        name: 'Soledad Substation',
        category: 'ELECTRIC_DISTRIBUTION',
        tier: 6,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
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
        id: 'node_valledupar_agri',
        name: 'Cesar Processing Center',
        category: 'CONSUMER_MANUFACTURING',
        tier: 5,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  {
    id: 'hex_cucuta',
    q: 2,
    r: 4,
    terrain: 'urban',
    infrastructure: 6,
    population: 792180,
    elevation: 320,
    wx: 5.0,
    wy: 7.0,
    controlledBy: 'player',
    settlementName: 'Cúcuta', // 🇻🇪 Aligned near Venezuela border reference
    infrastructureNodes: [
      {
        id: 'node_tienditas',
        name: 'Atanasio Girardot Bridge',
        category: 'TRANSPORTATION',
        tier: 7,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
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
        id: 'node_sogamoso',
        name: 'Sogamoso Hydroelectric Dam',
        category: 'ELECTRIC_GENERATION',
        tier: 9,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
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
        name: 'Aburrá Rail Transit',
        category: 'TRANSPORTATION',
        tier: 9,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  {
    id: 'hex_bogota',
    q: 0,
    r: 0,
    terrain: 'urban',
    infrastructure: 10,
    population: 7945996,
    elevation: 2640,
    wx: 0.0,
    wy: 0.0,
    controlledBy: 'player',
    settlementName: 'Bogotá',
    infrastructureNodes: [
      {
        id: 'node_bogota_guavio',
        name: 'Guavio Hydroelectric',
        category: 'ELECTRIC_GENERATION',
        tier: 10,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
  {
    id: 'hex_soacha',
    q: 0,
    r: -1,
    terrain: 'suburban',
    infrastructure: 7,
    population: 895878,
    elevation: 2565,
    wx: 0.0,
    wy: -1.5,
    controlledBy: 'player',
    settlementName: 'Soacha',
    infrastructureNodes: [
      {
        id: 'node_autopista',
        name: 'Autopista Sur Corridor',
        category: 'TRANSPORTATION',
        tier: 7,
        capacity: 100,
        state: 'online',
        maintenance_repair_duration: 0,
        maintenance_repair_progress: 100
      }
    ]
  },
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
        id: 'node_cali_sub',
        name: 'San Carlos Substation',
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
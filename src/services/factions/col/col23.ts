import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL23: RuntimeHexEntity[] = [
  // --- Existing Cluster (with -1,1 & 0,1 moved south) ---
  {
    id: 'col-23-1',
    q: -2,
    r: -1,
    terrain: 'plain',
    infra: 2,
    population: 28000,
    elevation: 205,
    wx: -2.0,
    wy: -2.0,
    fac_ctl: 'col',
    sett_name: 'Puerto Rico Meta Sector',
    infra_nodes: [
      {
        id: 'node-col23-1',
        name: 'Ariari-Guaviare Logistics Terminal',
        cat: 'TRNSPRT',
        tier: 2,
        cap: 75,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-23-2',
    q: -3,
    r: -1,
    terrain: 'plain',
    infra: 1,
    population: 15200,
    elevation: 235,
    wx: -3.5,
    wy: -2.0,
    fac_ctl: 'col',
    sett_name: 'Vista Hermosa Plains',
    infra_nodes: []
  },
  {
    id: 'col-23-3',
    q: -2,
    r: 0,
    terrain: 'plain',
    infra: 1,
    population: 11800,
    elevation: 215,
    wx: -2.0,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Fuente de Oro Corridor',
    infra_nodes: []
  },
  {
    id: 'col-23-4',
    q: -1,
    r: 0,
    terrain: 'plain',
    infra: 2,
    population: 19400,
    elevation: 195,
    wx: -0.5,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Puerto Lleras River Port',
    infra_nodes: [
      {
        id: 'node-col23-4',
        name: 'Ariari Riverine Transit Relay',
        cat: 'COMMS',
        tier: 1,
        cap: 55,
        state: 'online',
        maint_dur: 8,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-23-5',
    q: 0,
    r: 0,
    terrain: 'marsh',
    infra: 1,
    population: 9100,
    elevation: 180,
    wx: 1.0,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Manacacías Southern Wetlands',
    infra_nodes: []
  },
  {
    id: 'col-23-6',
    q: -4,
    r: -4,
    terrain: 'forest',
    infra: 1,
    population: 10300,
    elevation: 255,
    wx: -5.0,
    wy: -6.5,
    fac_ctl: 'col',
    sett_name: 'Chiribiquete North Approach',
    infra_nodes: []
  },
  {
    id: 'col-23-7',
    q: -4,
    r: -3,
    terrain: 'hills',
    infra: 2,
    population: 21500,
    elevation: 275,
    wx: -5.0,
    wy: -5.0,
    fac_ctl: 'col',
    sett_name: 'Guayabero River Hub',
    infra_nodes: [
      {
        id: 'node-col23-7',
        name: 'Guayabero Overland Outpost',
        cat: 'TRNSPRT',
        tier: 2,
        cap: 70,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },

  // --- Newly Appended Adjacent Hexes (5) ---
  {
    id: 'col-23-8',
    q: -4,
    r: -5,
    terrain: 'jungle',
    infra: 1,
    population: 6800,
    elevation: 240,
    wx: -5.0,
    wy: -8.0,
    fac_ctl: 'col',
    sett_name: 'Apaporis Upper Forest',
    infra_nodes: []
  },
  {
    id: 'col-23-9',
    q: -5,
    r: -4,
    terrain: 'hills',
    infra: 1,
    population: 7500,
    elevation: 310,
    wx: -6.5,
    wy: -6.5,
    fac_ctl: 'col',
    sett_name: 'Serranía de Chiribiquete West',
    infra_nodes: []
  },
  {
    id: 'col-23-10',
    q: -5,
    r: -3,
    terrain: 'forest',
    infra: 1,
    population: 8900,
    elevation: 295,
    wx: -6.5,
    wy: -5.0,
    fac_ctl: 'col',
    sett_name: 'Caguán-Guayabero Divide',
    infra_nodes: []
  },
  {
    id: 'col-23-11',
    q: -5,
    r: -2,
    terrain: 'hills',
    infra: 1,
    population: 13400,
    elevation: 340,
    wx: -6.5,
    wy: -3.5,
    fac_ctl: 'col',
    sett_name: 'San Vicente del Caguán East',
    infra_nodes: []
  },
  {
    id: 'col-23-12',
    q: -5,
    r: -5,
    terrain: 'jungle',
    infra: 1,
    population: 6200,
    elevation: 260,
    wx: -6.5,
    wy: -8.0,
    fac_ctl: 'col',
    sett_name: 'Cartagena del Chairá North',
    infra_nodes: []
  }
];
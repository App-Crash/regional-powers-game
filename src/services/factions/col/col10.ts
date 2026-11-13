import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL10: RuntimeHexEntity[] = [
  // --- Range: -9, 4 (Isolated northern approach) ---
  {
    id: 'col-10-7',
    q: -9,
    r: 4,
    terrain: 'plain',
    infra: 2,
    population: 18200,
    elevation: 30,
    wx: -12.0,
    wy: 8.0,
    fac_ctl: 'col',
    sett_name: 'Turbo Inland Approach',
    infra_nodes: [
      {
        id: 'node-col10-7',
        name: 'Urabá Logistics Hub',
        cat: 'LOGISTICS',
        tier: 2,
        cap: 85,
        state: 'online',
        maint_dur: 12,
        maint_prog: 0
      }
    ]
  },

  // --- Range: -10, 0 to -10, 2 ---
  {
    id: 'col-10-8',
    q: -10,
    r: 0,
    terrain: 'coastal',
    infra: 1,
    population: 7300,
    elevation: 10,
    wx: -14.0,
    wy: -1.0,
    fac_ctl: 'col',
    sett_name: 'Gulf of Urabá South',
    infra_nodes: []
  },
  {
    id: 'col-10-9',
    q: -10,
    r: 1,
    terrain: 'port',
    infra: 3,
    population: 34000,
    elevation: 5,
    wx: -14.0,
    wy: 1.0,
    fac_ctl: 'col',
    sett_name: 'Turbo Port Terminal',
    infra_nodes: [
      {
        id: 'node-col10-9',
        name: 'Urabá Maritime Port',
        cat: 'CIV_LOG',
        tier: 3,
        cap: 110,
        state: 'online',
        maint_dur: 15,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-10-10',
    q: -10,
    r: 2,
    terrain: 'coastal',
    infra: 2,
    population: 15600,
    elevation: 8,
    wx: -14.0,
    wy: 3.0,
    fac_ctl: 'col',
    sett_name: 'Necoclí Coastal Zone',
    infra_nodes: []
  },

  // --- Range: -7, 3 to -8, 3 and -10, 3 ---
  {
    id: 'col-10-11',
    q: -7,
    r: 3,
    terrain: 'mountain',
    infra: 1,
    population: 9800,
    elevation: 1400,
    wx: -9.5,
    wy: 6.0,
    fac_ctl: 'col',
    sett_name: 'Abibe Mountain Ridge',
    infra_nodes: []
  },
  {
    id: 'col-10-12',
    q: -8,
    r: 3,
    terrain: 'mountain',
    infra: 1,
    population: 8100,
    elevation: 1150,
    wx: -10.5,
    wy: 6.0,
    fac_ctl: 'col',
    sett_name: 'Paramillo Foothills',
    infra_nodes: []
  },
  {
    id: 'col-10-13',
    q: -10,
    r: 3,
    terrain: 'port',
    infra: 2,
    population: 22100,
    elevation: 4,
    wx: -14.0,
    wy: 5.0,
    fac_ctl: 'col',
    sett_name: 'Arboletes Harbor',
    infra_nodes: [
      {
        id: 'node-col10-13',
        name: 'Caribe Coastal Station',
        cat: 'COMMS',
        tier: 2,
        cap: 50,
        state: 'online',
        maint_dur: 8,
        maint_prog: 0
      }
    ]
  },

  // --- Amended Hexes ---
  {
    id: 'col-10-14',
    q: -9,
    r: -1,
    terrain: 'plain',
    infra: 1,
    population: 9200,
    elevation: 120,
    wx: -12.5,
    wy: -2.0,
    fac_ctl: 'col',
    sett_name: 'Atrato Western Corridor',
    infra_nodes: []
  },
  {
    id: 'col-10-15',
    q: -6,
    r: -5,
    terrain: 'mountain',
    infra: 1,
    population: 14200,
    elevation: 1950,
    wx: -8.0,
    wy: -9.0,
    fac_ctl: 'col',
    sett_name: 'Buga Mountain Sector',
    infra_nodes: []
  },
  {
    id: 'col-10-16',
    q: -7,
    r: -2,
    terrain: 'mountain',
    infra: 1,
    population: 12800,
    elevation: 2100,
    wx: -9.5,
    wy: -3.5,
    fac_ctl: 'col',
    sett_name: 'San José del Palmar Ridge',
    infra_nodes: []
  },
  {
    id: 'col-10-17',
    q: -7,
    r: -4,
    terrain: 'mountain',
    infra: 1,
    population: 11500,
    elevation: 2250,
    wx: -9.5,
    wy: -7.0,
    fac_ctl: 'col',
    sett_name: 'Anserma Highland Pass',
    infra_nodes: []
  },
  {
    id: 'col-10-18',
    q: -8,
    r: -3,
    terrain: 'mountain',
    infra: 1,
    population: 10400,
    elevation: 1850,
    wx: -11.0,
    wy: -5.5,
    fac_ctl: 'col',
    sett_name: 'Serranía del Baudó South',
    infra_nodes: []
  }
];
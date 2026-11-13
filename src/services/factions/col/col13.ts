import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL13: RuntimeHexEntity[] = [
  // --- Coordinate: -4, 4 ---
  {
    id: 'col-13-1',
    q: -4,
    r: 4,
    terrain: 'plain',
    infra: 2,
    population: 32000,
    elevation: 42,
    wx: -3.5,
    wy: 7.5,
    fac_ctl: 'col',
    sett_name: 'Puerto Berrío Lowlands',
    infra_nodes: [
      {
        id: 'node-col13-1',
        name: 'Magdalena River Crossing Terminal',
        cat: 'TRNSPRT',
        tier: 2,
        cap: 75,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },

  // --- Range: -5, 3 to -3, 3 ---
  {
    id: 'col-13-2',
    q: -5,
    r: 3,
    terrain: 'plain',
    infra: 1,
    population: 18500,
    elevation: 65,
    wx: -5.5,
    wy: 5.5,
    fac_ctl: 'col',
    sett_name: 'Yondó Magdalena Sector',
    infra_nodes: []
  },
  {
    id: 'col-13-3',
    q: -4,
    r: 3,
    terrain: 'plain',
    infra: 2,
    population: 24000,
    elevation: 85,
    wx: -3.5,
    wy: 5.5,
    fac_ctl: 'col',
    sett_name: 'Remedios Mining Plain',
    infra_nodes: []
  },
  {
    id: 'col-13-4',
    q: -3,
    r: 3,
    terrain: 'hills',
    infra: 1,
    population: 16200,
    elevation: 410,
    wx: -1.5,
    wy: 5.5,
    fac_ctl: 'col',
    sett_name: 'Segovia Highlands',
    infra_nodes: []
  },

  // --- Range: -3, 2 to -2, 2 ---
  {
    id: 'col-13-5',
    q: -3,
    r: 2,
    terrain: 'mountain',
    infra: 1,
    population: 14100,
    elevation: 1650,
    wx: -1.5,
    wy: 3.5,
    fac_ctl: 'col',
    sett_name: 'Puerto Berrío Eastern Ridge',
    infra_nodes: []
  },
  {
    id: 'col-13-6',
    q: -2,
    r: 2,
    terrain: 'mountain',
    infra: 2,
    population: 29500,
    elevation: 2100,
    wx: 0.5,
    wy: 3.5,
    fac_ctl: 'col',
    sett_name: 'Santander Western Cordillera',
    infra_nodes: [
      {
        id: 'node-col13-6',
        name: 'Cordillera Relay Station',
        cat: 'COMMS',
        tier: 2,
        cap: 60,
        state: 'online',
        maint_dur: 12,
        maint_prog: 0
      }
    ]
  },

  // --- Coordinate: -3, 1 ---
  {
    id: 'col-13-7',
    q: -3,
    r: 1,
    terrain: 'mountain',
    infra: 1,
    population: 12800,
    elevation: 1850,
    wx: -1.5,
    wy: 1.5,
    fac_ctl: 'col',
    sett_name: 'Vélez Escarpment',
    infra_nodes: []
  },

  // --- Range: -1, 0 to 3, 0 ---
  {
    id: 'col-13-8',
    q: -1,
    r: 0,
    terrain: 'mountain',
    infra: 2,
    population: 41000,
    elevation: 2200,
    wx: 2.5,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Pamplona Mountain Crest',
    infra_nodes: []
  },
  {
    id: 'col-13-9',
    q: 0,
    r: 0,
    terrain: 'plain',
    infra: 2,
    population: 35000,
    elevation: 180,
    wx: 4.5,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Saravena Llanos West',
    infra_nodes: [
      {
        id: 'node-col13-9',
        name: 'Arauca Frontier Outpost',
        cat: 'LOGISTICS',
        tier: 2,
        cap: 80,
        state: 'online',
        maint_dur: 15,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-13-10',
    q: 1,
    r: 0,
    terrain: 'plain',
    infra: 1,
    population: 22000,
    elevation: 140,
    wx: 6.5,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Arauca River Basin',
    infra_nodes: []
  },
  {
    id: 'col-13-11',
    q: 2,
    r: 0,
    terrain: 'plain',
    infra: 1,
    population: 19400,
    elevation: 120,
    wx: 8.5,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Tame Savanna',
    infra_nodes: []
  },
  {
    id: 'col-13-12',
    q: 3,
    r: 0,
    terrain: 'plain',
    infra: 1,
    population: 15800,
    elevation: 100,
    wx: 10.5,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Arauca Border Plains',
    infra_nodes: []
  }
];
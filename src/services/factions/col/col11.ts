import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL11: RuntimeHexEntity[] = [
  // --- Range: -9, 3 to -9, 0 ---
  {
    id: 'col-11-1',
    q: -9,
    r: 3,
    terrain: 'marsh',
    infra: 1,
    population: 6100,
    elevation: 18,
    wx: -13.5,
    wy: 5.5,
    fac_ctl: 'col',
    sett_name: 'Alto Sinú Wetlands',
    infra_nodes: []
  },
  {
    id: 'col-11-2',
    q: -9,
    r: 2,
    terrain: 'forest',
    infra: 1,
    population: 7400,
    elevation: 95,
    wx: -13.5,
    wy: 3.5,
    fac_ctl: 'col',
    sett_name: 'Tierralta Timberland',
    infra_nodes: [
      {
        id: 'node-col11-2',
        name: 'Urrá Hydroelectric Relay',
        cat: 'ELEC_GEN',
        tier: 2,
        cap: 90,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-11-3',
    q: -9,
    r: 1,
    terrain: 'hills',
    infra: 1,
    population: 8900,
    elevation: 240,
    wx: -13.5,
    wy: 1.5,
    fac_ctl: 'col',
    sett_name: 'Serranía de Abibe North',
    infra_nodes: []
  },
  {
    id: 'col-11-4',
    q: -9,
    r: 0,
    terrain: 'jungle',
    infra: 1,
    population: 5200,
    elevation: 180,
    wx: -13.5,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Chigorodó Jungle Sector',
    infra_nodes: []
  },

  // --- Range: -8, 4 to -5, 5 ---
  {
    id: 'col-11-5',
    q: -8,
    r: 4,
    terrain: 'plain',
    infra: 2,
    population: 28500,
    elevation: 25,
    wx: -11.5,
    wy: 7.5,
    fac_ctl: 'col',
    sett_name: 'Montería Valley South',
    infra_nodes: [
      {
        id: 'node-col11-5',
        name: 'Sinú Agricultural Depot',
        cat: 'CON_MFG',
        tier: 2,
        cap: 75,
        state: 'online',
        maint_dur: 12,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-11-6',
    q: -7,
    r: 4,
    terrain: 'plain',
    infra: 1,
    population: 16200,
    elevation: 40,
    wx: -9.5,
    wy: 7.5,
    fac_ctl: 'col',
    sett_name: 'Planeta Rica Plains',
    infra_nodes: []
  },
  {
    id: 'col-11-7',
    q: -6,
    r: 4,
    terrain: 'marsh',
    infra: 1,
    population: 11800,
    elevation: 15,
    wx: -7.5,
    wy: 7.5,
    fac_ctl: 'col',
    sett_name: 'Ayapel Floodplain',
    infra_nodes: []
  },
  {
    id: 'col-11-8',
    q: -5,
    r: 4,
    terrain: 'marsh',
    infra: 1,
    population: 9400,
    elevation: 12,
    wx: -5.5,
    wy: 7.5,
    fac_ctl: 'col',
    sett_name: 'San Jorge River Basin',
    infra_nodes: []
  },

  // --- Range: -9, 5 to -5, 5 (Deduplicated) ---
  {
    id: 'col-11-9',
    q: -9,
    r: 5,
    terrain: 'coastal',
    infra: 2,
    population: 21400,
    elevation: 6,
    wx: -13.5,
    wy: 9.5,
    fac_ctl: 'col',
    sett_name: 'Puerto Escondido Coast',
    infra_nodes: []
  },
  {
    id: 'col-11-10',
    q: -8,
    r: 5,
    terrain: 'urban',
    infra: 4,
    population: 145000,
    elevation: 18,
    wx: -11.5,
    wy: 9.5,
    fac_ctl: 'col',
    sett_name: 'Montería Urban Core',
    infra_nodes: [
      {
        id: 'node-col11-10',
        name: 'Córdoba Regional Grid',
        cat: 'ELEC_DIST',
        tier: 4,
        cap: 100,
        state: 'online',
        maint_dur: 8,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-11-11',
    q: -7,
    r: 5,
    terrain: 'plain',
    infra: 2,
    population: 32000,
    elevation: 22,
    wx: -9.5,
    wy: 9.5,
    fac_ctl: 'col',
    sett_name: 'Sahagún Savanna',
    infra_nodes: []
  },
  {
    id: 'col-11-12',
    q: -6,
    r: 5,
    terrain: 'hills',
    infra: 2,
    population: 48000,
    elevation: 165,
    wx: -7.5,
    wy: 9.5,
    fac_ctl: 'col',
    sett_name: 'Sincelejo & Montes de María',
    infra_nodes: [
      {
        id: 'node-col11-12',
        name: 'Sucre Transit Junction',
        cat: 'TRNSPRT',
        tier: 2,
        cap: 80,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-11-13',
    q: -5,
    r: 5,
    terrain: 'marsh',
    infra: 1,
    population: 14300,
    elevation: 14,
    wx: -5.5,
    wy: 9.5,
    fac_ctl: 'col',
    sett_name: 'Mompox Depression',
    infra_nodes: []
  }
];
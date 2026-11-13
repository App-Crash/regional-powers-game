import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL25: RuntimeHexEntity[] = [
  // --- Existing Cluster ---
  {
    id: 'col-25-1',
    q: -7,
    r: -8,
    terrain: 'mountain',
    infra: 1,
    population: 13500,
    elevation: 850,
    wx: -9.5,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Putumayo Andean Slope',
    infra_nodes: []
  },
  {
    id: 'col-25-2',
    q: -6,
    r: -8,
    terrain: 'hills',
    infra: 2,
    population: 29000,
    elevation: 550,
    wx: -6.5,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Mocoa Gateway Hub',
    infra_nodes: [
      {
        id: 'node-col25-2',
        name: 'Putumayo Transit & Energy Terminal',
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
    id: 'col-25-3',
    q: -5,
    r: -8,
    terrain: 'forest',
    infra: 1,
    population: 16400,
    elevation: 340,
    wx: -6.5,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Puerto Asís Transition',
    infra_nodes: []
  },
  {
    id: 'col-25-4',
    q: -6,
    r: -9,
    terrain: 'jungle',
    infra: 1,
    population: 10800,
    elevation: 290,
    wx: -6.5,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'San Miguel Border Sector',
    infra_nodes: []
  },
  {
    id: 'col-25-5',
    q: -5,
    r: -9,
    terrain: 'jungle',
    infra: 1,
    population: 12100,
    elevation: 250,
    wx: -6.5,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Putumayo River Upper Basin',
    infra_nodes: []
  },
  {
    id: 'col-25-6',
    q: -4,
    r: -8,
    terrain: 'jungle',
    infra: 1,
    population: 9500,
    elevation: 235,
    wx: -5.0,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Leguízamo North Approach',
    infra_nodes: []
  },
  {
    id: 'col-25-7',
    q: -4,
    r: -9,
    terrain: 'jungle',
    infra: 2,
    population: 18200,
    elevation: 210,
    wx: -5.0,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Puerto Leguízamo Riverine Hub',
    infra_nodes: [
      {
        id: 'node-col25-7',
        name: 'Putumayo Naval & Logistics Station',
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
    id: 'col-25-8',
    q: -7,
    r: -9,
    terrain: 'hills',
    infra: 1,
    population: 14200,
    elevation: 620,
    wx: -9.5,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Valle del Guamuez Border',
    infra_nodes: []
  },
  {
    id: 'col-25-9',
    q: -5,
    r: -10,
    terrain: 'jungle',
    infra: 1,
    population: 8700,
    elevation: 230,
    wx: -6.5,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'Puerto Ospina Sector',
    infra_nodes: []
  },
  {
    id: 'col-25-10',
    q: -4,
    r: -10,
    terrain: 'marsh',
    infra: 1,
    population: 6900,
    elevation: 195,
    wx: -5.0,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'Caucayá Wetlands South',
    infra_nodes: []
  },
  {
    id: 'col-25-11',
    q: -3,
    r: -9,
    terrain: 'jungle',
    infra: 1,
    population: 7600,
    elevation: 205,
    wx: -3.5,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'La Tagua Caquetá Crossing',
    infra_nodes: []
  },
  {
    id: 'col-25-12',
    q: -3,
    r: -10,
    terrain: 'jungle',
    infra: 1,
    population: 6100,
    elevation: 190,
    wx: -3.5,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'Putumayo Midstream East',
    infra_nodes: []
  }
];
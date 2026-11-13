import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL35: RuntimeHexEntity[] = [
  // --- Existing ---
  {
    id: 'col-35-1',
    q: -1,
    r: -9,
    terrain: 'jungle',
    infra: 2,
    population: 14600,
    elevation: 180,
    wx: -0.5,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Puerto Santander South Hub',
    infra_nodes: [
      {
        id: 'node-col35-1',
        name: 'Lower Caquetá Riverine Outpost',
        cat: 'TRNSPRT',
        tier: 2,
        cap: 65,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-35-2',
    q: 0,
    r: -9,
    terrain: 'jungle',
    infra: 1,
    population: 9200,
    elevation: 175,
    wx: 1.0,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Mirití-Caquetá Confluence',
    infra_nodes: []
  },
  {
    id: 'col-35-3',
    q: 1,
    r: -10,
    terrain: 'jungle',
    infra: 1,
    population: 8400,
    elevation: 165,
    wx: 2.5,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'La Pedrera West Jungle',
    infra_nodes: []
  },
  {
    id: 'col-35-4',
    q: 2,
    r: -10,
    terrain: 'jungle',
    infra: 2,
    population: 13800,
    elevation: 155,
    wx: 4.0,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'La Pedrera Border Hub',
    infra_nodes: [
      {
        id: 'node-col35-4',
        name: 'Caquetá-Brazil Frontier Relay',
        cat: 'COMMS',
        tier: 2,
        cap: 60,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-35-5',
    q: 2,
    r: -9,
    terrain: 'forest',
    infra: 1,
    population: 7600,
    elevation: 160,
    wx: 4.0,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Apaporis Lower Border Forest',
    infra_nodes: []
  },
  {
    id: 'col-35-6',
    q: -1,
    r: -12,
    terrain: 'jungle',
    infra: 1,
    population: 10500,
    elevation: 160,
    wx: -0.5,
    wy: -18.5,
    fac_ctl: 'col',
    sett_name: 'Arica Putumayo Sector',
    infra_nodes: []
  },
  {
    id: 'col-35-7',
    q: 0,
    r: -12,
    terrain: 'jungle',
    infra: 1,
    population: 9800,
    elevation: 155,
    wx: 1.0,
    wy: -18.5,
    fac_ctl: 'col',
    sett_name: 'Tarapacá East Approach',
    infra_nodes: []
  },

  // --- 5 New Appended Hexes ---
  {
    id: 'col-35-8',
    q: 0,
    r: -10,
    terrain: 'jungle',
    infra: 1,
    population: 10200,
    elevation: 170,
    wx: 1.0,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'Caquetá Midstream South',
    infra_nodes: []
  },
  {
    id: 'col-35-9',
    q: 1,
    r: -11,
    terrain: 'marsh',
    infra: 1,
    population: 7900,
    elevation: 150,
    wx: 2.5,
    wy: -17.0,
    fac_ctl: 'col',
    sett_name: 'Mirití Paraná Wetlands South',
    infra_nodes: []
  },
  {
    id: 'col-35-10',
    q: 2,
    r: -11,
    terrain: 'jungle',
    infra: 1,
    population: 8600,
    elevation: 148,
    wx: 4.0,
    wy: -17.0,
    fac_ctl: 'col',
    sett_name: 'Apaporis-Amazon Confluence',
    infra_nodes: []
  },
  {
    id: 'col-35-11',
    q: -1,
    r: -10,
    terrain: 'jungle',
    infra: 1,
    population: 11100,
    elevation: 175,
    wx: -0.5,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'Cahuinarí South Sector',
    infra_nodes: []
  },
  {
    id: 'col-35-12',
    q: -1,
    r: -11,
    terrain: 'jungle',
    infra: 1,
    population: 9500,
    elevation: 168,
    wx: -0.5,
    wy: -17.0,
    fac_ctl: 'col',
    sett_name: 'Putumayo Upper Basin East',
    infra_nodes: []
  }
];
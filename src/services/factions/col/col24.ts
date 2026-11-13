import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL24: RuntimeHexEntity[] = [
  // --- Existing Cluster ---
  {
    id: 'col-24-1',
    q: -5,
    r: -6,
    terrain: 'jungle',
    infra: 1,
    population: 11200,
    elevation: 245,
    wx: -6.5,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Caguán River Lower Basin',
    infra_nodes: []
  },
  {
    id: 'col-24-2',
    q: -4,
    r: -6,
    terrain: 'jungle',
    infra: 2,
    population: 24500,
    elevation: 230,
    wx: -5.0,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Cartagena del Chairá Hub',
    infra_nodes: [
      {
        id: 'node-col24-2',
        name: 'Caguán Riverine Logistics Port',
        cat: 'TRNSPRT',
        tier: 2,
        cap: 70,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-24-3',
    q: -3,
    r: -6,
    terrain: 'forest',
    infra: 1,
    population: 14800,
    elevation: 250,
    wx: -3.5,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Solano Northern Sector',
    infra_nodes: []
  },
  {
    id: 'col-24-4',
    q: -6,
    r: -7,
    terrain: 'hills',
    infra: 1,
    population: 8900,
    elevation: 320,
    wx: -6.5,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Andean-Amazonian Foothills South',
    infra_nodes: []
  },
  {
    id: 'col-24-5',
    q: -5,
    r: -7,
    terrain: 'jungle',
    infra: 1,
    population: 9600,
    elevation: 280,
    wx: -6.5,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Tres Esquinas Military Base Sector',
    infra_nodes: [
      {
        id: 'node-col24-5',
        name: 'Tres Esquinas Air-Riverine Relay',
        cat: 'COMMS',
        tier: 2,
        cap: 60,
        state: 'online',
        maint_dur: 8,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-24-6',
    q: -4,
    r: -7,
    terrain: 'jungle',
    infra: 1,
    population: 8100,
    elevation: 265,
    wx: -5.0,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Caquetá River Midstream West',
    infra_nodes: []
  },
  {
    id: 'col-24-7',
    q: -3,
    r: -7,
    terrain: 'jungle',
    infra: 1,
    population: 7400,
    elevation: 240,
    wx: -3.5,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Solano Deep Jungle',
    infra_nodes: []
  },

  // --- Newly Appended Adjacent Hexes (5) ---
  {
    id: 'col-24-8',
    q: -6,
    r: -6,
    terrain: 'hills',
    infra: 1,
    population: 12600,
    elevation: 350,
    wx: -8.0,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'La Montañita Foothills',
    infra_nodes: []
  },
  {
    id: 'col-24-9',
    q: -2,
    r: -6,
    terrain: 'forest',
    infra: 1,
    population: 6800,
    elevation: 225,
    wx: -2.0,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Yarí River West Bank',
    infra_nodes: []
  },
  {
    id: 'col-24-10',
    q: -2,
    r: -7,
    terrain: 'jungle',
    infra: 1,
    population: 5900,
    elevation: 215,
    wx: -2.0,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Araracuara Gorge Approach',
    infra_nodes: []
  },
  {
    id: 'col-24-11',
    q: -3,
    r: -8,
    terrain: 'jungle',
    infra: 1,
    population: 6400,
    elevation: 220,
    wx: -3.5,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Caquetá-Cahuinarí Interfluve',
    infra_nodes: []
  },
  {
    id: 'col-24-12',
    q: -2,
    r: -8,
    terrain: 'jungle',
    infra: 1,
    population: 7200,
    elevation: 205,
    wx: -2.0,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Puerto Santander Caquetá',
    infra_nodes: []
  }
];
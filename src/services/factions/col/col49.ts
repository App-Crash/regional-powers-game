import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL49: RuntimeHexEntity[] = [
  // --- Existing 5 Hexes ---
  {
    id: 'col-49-1',
    q: 11,
    r: -16,
    terrain: 'jungle',
    infra: 2,
    population: 18500,
    elevation: 125,
    wx: 17.5,
    wy: -24.5,
    fac_ctl: 'col',
    sett_name: 'Trapecio Far-East Hub 49',
    infra_nodes: [
      {
        id: 'node-col49-1',
        name: 'Amazonas Eastern Command Post',
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
    id: 'col-49-2',
    q: 12,
    r: -16,
    terrain: 'jungle',
    infra: 1,
    population: 12100,
    elevation: 118,
    wx: 19.0,
    wy: -24.5,
    fac_ctl: 'col',
    sett_name: 'Trapecio East Sector Alpha',
    infra_nodes: []
  },
  {
    id: 'col-49-3',
    q: 11,
    r: -15,
    terrain: 'marsh',
    infra: 1,
    population: 14200,
    elevation: 115,
    wx: 17.5,
    wy: -23.0,
    fac_ctl: 'col',
    sett_name: 'Trapecio East Wetlands',
    infra_nodes: []
  },
  {
    id: 'col-49-4',
    q: 12,
    r: -17,
    terrain: 'jungle',
    infra: 1,
    population: 11400,
    elevation: 110,
    wx: 19.0,
    wy: -26.0,
    fac_ctl: 'col',
    sett_name: 'Trapecio Southeast Deep Jungle',
    infra_nodes: []
  },
  {
    id: 'col-49-5',
    q: 12,
    r: -15,
    terrain: 'marsh',
    infra: 1,
    population: 12800,
    elevation: 112,
    wx: 19.0,
    wy: -23.0,
    fac_ctl: 'col',
    sett_name: 'Trapecio East Wetlands Beta',
    infra_nodes: []
  },

  // --- Relocated & Appended Hexes ---
  {
    id: 'col-49-6',
    q: 13,
    r: -18,
    terrain: 'jungle',
    infra: 1,
    population: 7800,
    elevation: 102,
    wx: 20.5,
    wy: -27.5,
    fac_ctl: 'col',
    sett_name: 'Deep Trapecio Southern Outpost 13',
    infra_nodes: []
  },
  {
    id: 'col-49-7',
    q: 13,
    r: -20,
    terrain: 'marsh',
    infra: 1,
    population: 7200,
    elevation: 105,
    wx: 20.5,
    wy: -30.5,
    fac_ctl: 'col',
    sett_name: 'Deep Trapecio Southern Wetlands 13',
    infra_nodes: []
  },
  {
    id: 'col-49-8',
    q: 13,
    r: -19,
    terrain: 'jungle',
    infra: 1,
    population: 8100,
    elevation: 108,
    wx: 19.0,
    wy: -29.0,
    fac_ctl: 'col',
    sett_name: 'Deep Trapecio Southern Approach 13',
    infra_nodes: []
  }
];
import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL48: RuntimeHexEntity[] = [
  {
    id: 'col-48-1',
    q: 7,
    r: -16,
    terrain: 'jungle',
    infra: 2,
    population: 13400,
    elevation: 112,
    wx: 11.5,
    wy: -24.5,
    fac_ctl: 'col',
    sett_name: 'Trapecio South Hub 48',
    infra_nodes: [
      {
        id: 'node-col48-1',
        name: 'Amazonas Eastern Outpost',
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
    id: 'col-48-2',
    q: 7,
    r: -17,
    terrain: 'marsh',
    infra: 1,
    population: 8200,
    elevation: 108,
    wx: 11.5,
    wy: -26.0,
    fac_ctl: 'col',
    sett_name: 'Trapecio South Wetlands',
    infra_nodes: []
  },
  {
    id: 'col-48-3',
    q: 8,
    r: -17,
    terrain: 'jungle',
    infra: 1,
    population: 9100,
    elevation: 106,
    wx: 13.0,
    wy: -26.0,
    fac_ctl: 'col',
    sett_name: 'Trapecio Southeast Basin',
    infra_nodes: []
  },
  {
    id: 'col-48-4',
    q: 8,
    r: -16,
    terrain: 'forest',
    infra: 1,
    population: 9800,
    elevation: 110,
    wx: 13.0,
    wy: -24.5,
    fac_ctl: 'col',
    sett_name: 'Trapecio Transition Sector East',
    infra_nodes: []
  },
  {
    id: 'col-48-5',
    q: 9,
    r: -17,
    terrain: 'jungle',
    infra: 1,
    population: 8100,
    elevation: 104,
    wx: 14.5,
    wy: -26.0,
    fac_ctl: 'col',
    sett_name: 'Amazonas Far-Southeast Sector',
    infra_nodes: []
  },
  {
    id: 'col-48-6',
    q: 11,
    r: -8,
    terrain: 'jungle',
    infra: 1,
    population: 9200,
    elevation: 118,
    wx: 17.5,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Rio Negro East Outpost 11',
    infra_nodes: []
  },
  {
    id: 'col-48-7',
    q: 11,
    r: -7,
    terrain: 'marsh',
    infra: 1,
    population: 8400,
    elevation: 112,
    wx: 17.5,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Rio Negro East Wetlands 11',
    infra_nodes: []
  },
  {
    id: 'col-48-8',
    q: 12,
    r: -8,
    terrain: 'jungle',
    infra: 1,
    population: 8700,
    elevation: 115,
    wx: 19.0,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Rio Negro Far-East Approach 11',
    infra_nodes: []
  },
  // --- Transposed Hex ---
  {
    id: 'col-48-9',
    q: 11,
    r: -17,
    terrain: 'jungle',
    infra: 1,
    population: 8100,
    elevation: 102,
    wx: 19.0,
    wy: -29.0,
    fac_ctl: 'col',
    sett_name: 'Deep Trapecio Sector (12, -19)',
    infra_nodes: []
  },
  // --- added manually ---
  {
    id: 'col-48.1-9',
    q: 10,
    r: -17,
    terrain: 'jungle',
    infra: 1,
    population: 8100,
    elevation: 102,
    wx: 19.0,
    wy: -29.0,
    fac_ctl: 'col',
    sett_name: 'Deep Trapecio Sector (10, -17)',
    infra_nodes: []
  }
];
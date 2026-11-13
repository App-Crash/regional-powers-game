import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL16: RuntimeHexEntity[] = [
  // --- Original Hexes ---
  {
    id: 'col-16-1',
    q: -5,
    r: -7,
    terrain: 'jungle',
    infra: 2,
    population: 32000,
    elevation: 140,
    wx: -6.5,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Mitú Regional Hub',
    infra_nodes: [
      {
        id: 'node-col16-1',
        name: 'Mitú Aero-Riverine Station',
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
    id: 'col-16-2',
    q: -5,
    r: -8,
    terrain: 'jungle',
    infra: 1,
    population: 12400,
    elevation: 125,
    wx: -6.5,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Upper Vaupés River Sector',
    infra_nodes: []
  },
  {
    id: 'col-16-3',
    q: -4,
    r: -8,
    terrain: 'jungle',
    infra: 1,
    population: 9800,
    elevation: 115,
    wx: -5.0,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Apaporis River Basin West',
    infra_nodes: []
  },
  {
    id: 'col-16-4',
    q: -3,
    r: -9,
    terrain: 'jungle',
    infra: 1,
    population: 8500,
    elevation: 105,
    wx: -3.5,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Taraira Border Sector',
    infra_nodes: []
  },
  {
    id: 'col-16-5',
    q: -2,
    r: -9,
    terrain: 'jungle',
    infra: 1,
    population: 7100,
    elevation: 95,
    wx: -2.0,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Vaupés-Amazonas Transition',
    infra_nodes: []
  },
  {
    id: 'col-16-6',
    q: -5,
    r: -6,
    terrain: 'forest',
    infra: 1,
    population: 14100,
    elevation: 155,
    wx: -6.5,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Vaupés Gallery Forest',
    infra_nodes: []
  },

  // --- Clustered Hexes ---
  {
    id: 'col-16-7',
    q: -4,
    r: -7,
    terrain: 'jungle',
    infra: 1,
    population: 11500,
    elevation: 130,
    wx: -5.0,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Mitú South Approach',
    infra_nodes: []
  },
  {
    id: 'col-16-8',
    q: -3,
    r: -8,
    terrain: 'jungle',
    infra: 1,
    population: 10200,
    elevation: 110,
    wx: -3.5,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Apaporis Central Basin',
    infra_nodes: [
      {
        id: 'node-col16-8',
        name: 'Apaporis River Outpost',
        cat: 'COMMS',
        tier: 1,
        cap: 40,
        state: 'online',
        maint_dur: 8,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-16-9',
    q: -2,
    r: -8,
    terrain: 'jungle',
    infra: 1,
    population: 8900,
    elevation: 100,
    wx: -2.0,
    wy: -12.5,
    fac_ctl: 'col',
    sett_name: 'Pacoa Sector',
    infra_nodes: []
  },
  {
    id: 'col-16-10',
    q: -4,
    r: -6,
    terrain: 'forest',
    infra: 1,
    population: 13200,
    elevation: 145,
    wx: -5.0,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Vaupés Northeast Interior',
    infra_nodes: []
  },
  {
    id: 'col-16-11',
    q: -3,
    r: -7,
    terrain: 'jungle',
    infra: 1,
    population: 12000,
    elevation: 120,
    wx: -3.5,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Carurú Highland Fringe',
    infra_nodes: []
  },

  // --- Newly Added Hexes ---
  {
    id: 'col-16-12',
    q: -3,
    r: -6,
    terrain: 'jungle',
    infra: 1,
    population: 10500,
    elevation: 135,
    wx: -3.5,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Papunaua River Sector',
    infra_nodes: []
  },
  {
    id: 'col-16-13',
    q: -4,
    r: -9,
    terrain: 'jungle',
    infra: 1,
    population: 8200,
    elevation: 108,
    wx: -5.0,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Lower Apaporis Basin',
    infra_nodes: []
  }
];
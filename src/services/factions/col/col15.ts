import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL15: RuntimeHexEntity[] = [
  // --- Original Hexes ---
  {
    id: 'col-15-1',
    q: -2,
    r: -4,
    terrain: 'port',
    infra: 3,
    population: 31000,
    elevation: 52,
    wx: -2.0,
    wy: -6.5,
    fac_ctl: 'col',
    sett_name: 'Puerto Carreño',
    infra_nodes: [
      {
        id: 'node-col15-1',
        name: 'Orinoco-Meta River Terminal',
        cat: 'CIV_LOG',
        tier: 3,
        cap: 90,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-15-2',
    q: -3,
    r: -7,
    terrain: 'port',
    infra: 2,
    population: 28500,
    elevation: 65,
    wx: -4.0,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Puerto Inírida',
    infra_nodes: [
      {
        id: 'node-col15-2',
        name: 'Inírida River Station',
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
    id: 'col-15-3',
    q: -2,
    r: -5,
    terrain: 'plain',
    infra: 1,
    population: 18400,
    elevation: 95,
    wx: -2.0,
    wy: -8.0,
    fac_ctl: 'col',
    sett_name: 'Cumaribo Savanna',
    infra_nodes: []
  },
  {
    id: 'col-15-4',
    q: -1,
    r: -4,
    terrain: 'plain',
    infra: 1,
    population: 12100,
    elevation: 45,
    wx: -0.5,
    wy: -6.5,
    fac_ctl: 'col',
    sett_name: 'Vichada Border Sector',
    infra_nodes: []
  },
  {
    id: 'col-15-5',
    q: -4,
    r: -7,
    terrain: 'jungle',
    infra: 1,
    population: 14200,
    elevation: 110,
    wx: -5.5,
    wy: -11.0,
    fac_ctl: 'col',
    sett_name: 'Guaviare River Basin East',
    infra_nodes: []
  },

  // --- New Clustered Hexes ---
  {
    id: 'col-15-6',
    q: -3,
    r: -5,
    terrain: 'plain',
    infra: 1,
    population: 15600,
    elevation: 88,
    wx: -3.0,
    wy: -8.0,
    fac_ctl: 'col',
    sett_name: 'Cumaribo Western Plains',
    infra_nodes: []
  },
  {
    id: 'col-15-7',
    q: -3,
    r: -6,
    terrain: 'jungle',
    infra: 1,
    population: 11200,
    elevation: 75,
    wx: -3.0,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Atabapo River Sector',
    infra_nodes: []
  },
  {
    id: 'col-15-8',
    q: -1,
    r: -3,
    terrain: 'plain',
    infra: 2,
    population: 22400,
    elevation: 60,
    wx: -0.5,
    wy: -5.0,
    fac_ctl: 'col',
    sett_name: 'Meta-Vichada Confluence',
    infra_nodes: [
      {
        id: 'node-col15-8',
        name: 'Vichada Logistics Outpost',
        cat: 'LOGISTICS',
        tier: 2,
        cap: 70,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-15-9',
    q: -2,
    r: -6,
    terrain: 'forest',
    infra: 1,
    population: 9800,
    elevation: 82,
    wx: -2.0,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Vichada River Gallery Forest',
    infra_nodes: []
  },
  {
    id: 'col-15-10',
    q: -4,
    r: -6,
    terrain: 'plain',
    infra: 1,
    population: 13500,
    elevation: 90,
    wx: -4.0,
    wy: -9.5,
    fac_ctl: 'col',
    sett_name: 'Guainía Savanna Outpost',
    infra_nodes: []
  }
];
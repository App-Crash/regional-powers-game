import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL27: RuntimeHexEntity[] = [
  {
    id: 'col-27-1',
    q: 0,
    r: -11,
    terrain: 'jungle',
    infra: 2,
    population: 28000,
    elevation: 165,
    wx: 1.0,
    wy: -17.0,
    fac_ctl: 'col',
    sett_name: 'Leticia Northern Buffer Hub',
    infra_nodes: [
      {
        id: 'node-col27-1',
        name: 'Vásquez Cobo Northern Relay',
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
    id: 'col-27-2',
    q: -1,
    r: -12,
    terrain: 'jungle',
    infra: 1,
    population: 11200,
    elevation: 155,
    wx: -0.5,
    wy: -18.5,
    fac_ctl: 'col', // explicitly col control per instructions
    sett_name: 'Puerto Nariño Sector (Col Control)',
    infra_nodes: [
      {
        id: 'node-col27-2',
        name: 'Amazon Riverine Outpost North',
        cat: 'COMMS',
        tier: 1,
        cap: 50,
        state: 'online',
        maint_dur: 8,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-27-3',
    q: 1,
    r: -11,
    terrain: 'marsh',
    infra: 1,
    population: 6400,
    elevation: 150,
    wx: 2.5,
    wy: -17.0,
    fac_ctl: 'col',
    sett_name: 'Amazon-Trapecio Wetlands North',
    infra_nodes: []
  },
  {
    id: 'col-27-4',
    q: 0,
    r: -10,
    terrain: 'jungle',
    infra: 1,
    population: 8900,
    elevation: 170,
    wx: 1.0,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'Amazon River Upper Bank North',
    infra_nodes: []
  },
  {
    id: 'col-27-5',
    q: -1,
    r: -10,
    terrain: 'jungle',
    infra: 1,
    population: 7500,
    elevation: 175,
    wx: -0.5,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'Loreto-Amazonas Sector North',
    infra_nodes: []
  },
  {
    id: 'col-27-6',
    q: 0,
    r: -9,
    terrain: 'forest',
    infra: 1,
    population: 12400,
    elevation: 185,
    wx: 1.0,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'La Pedrera Approach North',
    infra_nodes: []
  },
  {
    id: 'col-27-7',
    q: 1,
    r: -9,
    terrain: 'jungle',
    infra: 1,
    population: 9800,
    elevation: 180,
    wx: 2.5,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Caquetá-Amazon Confluence North',
    infra_nodes: []
  }
];
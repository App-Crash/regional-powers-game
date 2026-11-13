import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL26: RuntimeHexEntity[] = [
  {
    id: 'col-26-1',
    q: -3,
    r: -11,
    terrain: 'jungle',
    infra: 1,
    population: 6500,
    elevation: 185,
    wx: -3.5,
    wy: -17.0,
    fac_ctl: 'col',
    sett_name: 'Tarapacá Northwest Jungle',
    infra_nodes: []
  },
  {
    id: 'col-26-2',
    q: -2,
    r: -11,
    terrain: 'jungle',
    infra: 2,
    population: 14200,
    elevation: 170,
    wx: -2.0,
    wy: -17.0,
    fac_ctl: 'col',
    sett_name: 'Tarapacá Riverine Hub',
    infra_nodes: [
      {
        id: 'node-col26-2',
        name: 'Putumayo-Amazon Transit Outpost',
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
    id: 'col-26-3',
    q: -1,
    r: -11,
    terrain: 'jungle',
    infra: 1,
    population: 5800,
    elevation: 160,
    wx: -0.5,
    wy: -17.0,
    fac_ctl: 'col',
    sett_name: 'El Encanto Sector North',
    infra_nodes: []
  },
  {
    id: 'col-26-4',
    q: -3,
    r: -10,
    terrain: 'marsh',
    infra: 1,
    population: 4900,
    elevation: 175,
    wx: -3.5,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'Igarap Paraná Wetlands North',
    infra_nodes: []
  },
  {
    id: 'col-26-5',
    q: -2,
    r: -10,
    terrain: 'jungle',
    infra: 1,
    population: 7100,
    elevation: 165,
    wx: -2.0,
    wy: -15.5,
    fac_ctl: 'col',
    sett_name: 'Caquetá Lower Basin North',
    infra_nodes: []
  },
  {
    id: 'col-26-6',
    q: -4,
    r: -11,
    terrain: 'jungle',
    infra: 1,
    population: 8300,
    elevation: 200,
    wx: -5.0,
    wy: -17.0,
    fac_ctl: 'col',
    sett_name: 'Puerto Nariño North Approach',
    infra_nodes: []
  },
  {
    id: 'col-26-7',
    q: -2,
    r: -9,
    terrain: 'forest',
    infra: 1,
    population: 9400,
    elevation: 190,
    wx: -2.0,
    wy: -14.0,
    fac_ctl: 'col',
    sett_name: 'Apedrea Forest Corridor North',
    infra_nodes: []
  }
];
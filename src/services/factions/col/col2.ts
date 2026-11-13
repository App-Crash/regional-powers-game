import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL2: RuntimeHexEntity[] = [
  {
    id: 'col-m-01',
    q: -5,
    r: 0,
    terrain: 'mountain',
    infra: 1,
    population: 14200,
    elevation: 2850,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Sonsón Highlands',
    infra_nodes: [
      { id: 'node-m1-1', name: 'Mountain Pass Relay', cat: 'COMMS', tier: 1, cap: 50, state: 'online', maint_dur: 10, maint_prog: 0 }
    ]
  },
  {
    id: 'col-m-02',
    q: -5,
    r: 1,
    terrain: 'mountain',
    infra: 1,
    population: 8500,
    elevation: 3100,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Páramo de Sonsón',
    infra_nodes: []
  },
  {
    id: 'col-m-03',
    q: -5,
    r: 2,
    terrain: 'mountain',
    infra: 2,
    population: 29000,
    elevation: 2600,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Dorado Ridge',
    infra_nodes: [
      { id: 'node-m3-1', name: 'Agri-Terrace Complex', cat: 'AGRI', tier: 2, cap: 120, state: 'online', maint_dur: 15, maint_prog: 0 }
    ]
  },
  {
    id: 'col-m-04',
    q: -4,
    r: 0,
    terrain: 'mountain',
    infra: 1,
    population: 11200,
    elevation: 2950,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Alto de La Línea',
    infra_nodes: []
  },
  {
    id: 'col-m-05',
    q: -4,
    r: 1,
    terrain: 'mountain',
    infra: 1,
    population: 6400,
    elevation: 3400,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Nevado Outpost',
    infra_nodes: [
      { id: 'node-m5-1', name: 'Weather Station', cat: 'SENSOR', tier: 1, cap: 30, state: 'online', maint_dur: 5, maint_prog: 0 }
    ]
  },
  {
    id: 'col-m-06',
    q: -4,
    r: 2,
    terrain: 'mountain',
    infra: 2,
    population: 35000,
    elevation: 2500,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Mariquita Pass',
    infra_nodes: [
      { id: 'node-m6-1', name: 'Logistics Depot', cat: 'LOGISTICS', tier: 2, cap: 150, state: 'online', maint_dur: 20, maint_prog: 0 }
    ]
  },
  {
    id: 'col-m-07',
    q: -6,
    r: 1,
    terrain: 'mountain',
    infra: 1,
    population: 18900,
    elevation: 2750,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Honda Escarpment',
    infra_nodes: []
  },
  {
    id: 'col-m-08',
    q: -6,
    r: 2,
    terrain: 'mountain',
    infra: 1,
    population: 9200,
    elevation: 3200,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Guaduas Heights',
    infra_nodes: []
  },
  {
    id: 'col-m-09',
    q: -7,
    r: 2,
    terrain: 'mountain',
    infra: 2,
    population: 41000,
    elevation: 2400,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Chiquinquirá Range',
    infra_nodes: [
      { id: 'node-m9-1', name: 'Regional Quarry', cat: 'EXTRACTIVE', tier: 2, cap: 200, state: 'online', maint_dur: 25, maint_prog: 0 }
    ]
  },
  {
    id: 'col-m-10',
    q: -6,
    r: 3,
    terrain: 'mountain',
    infra: 1,
    population: 15300,
    elevation: 2900,
    wx: 0,
    wy: 0,
    fac_ctl: 'col',
    sett_name: 'Ubaté Valley Wall',
    infra_nodes: []
  }
];
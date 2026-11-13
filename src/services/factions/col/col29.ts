import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL29: RuntimeHexEntity[] = [
  // --- Existing ---
  {
    id: 'col-29-1',
    q: -6,
    r: 0,
    terrain: 'plain',
    infra: 2,
    population: 51000,
    elevation: 380,
    wx: -8.0,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Espinal Magdalena Hub',
    infra_nodes: [
      {
        id: 'node-col29-1',
        name: 'Magdalena Central Rail-Road Terminal',
        cat: 'TRNSPRT',
        tier: 2,
        cap: 85,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-29-2',
    q: -7,
    r: 0,
    terrain: 'hills',
    infra: 1,
    population: 31000,
    elevation: 890,
    wx: -9.5,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Chaparral Foothills',
    infra_nodes: []
  },
  {
    id: 'col-29-3',
    q: -7,
    r: -1,
    terrain: 'mountain',
    infra: 1,
    population: 22500,
    elevation: 1650,
    wx: -9.5,
    wy: -2.0,
    fac_ctl: 'col',
    sett_name: 'Ataco Highland Sector',
    infra_nodes: []
  },
  {
    id: 'col-29-4',
    q: -7,
    r: -2,
    terrain: 'mountain',
    infra: 1,
    population: 19400,
    elevation: 1920,
    wx: -9.5,
    wy: -3.5,
    fac_ctl: 'col',
    sett_name: 'Planadas Cordillera Divide',
    infra_nodes: []
  },
  {
    id: 'col-29-5',
    q: -7,
    r: -3,
    terrain: 'plain',
    infra: 2,
    population: 58000,
    elevation: 440,
    wx: -9.5,
    wy: -5.0,
    fac_ctl: 'col',
    sett_name: 'Neiva Northern Valley Hub',
    infra_nodes: [
      {
        id: 'node-col29-5',
        name: 'Upper Magdalena Energy Relay',
        cat: 'COMMS',
        tier: 2,
        cap: 75,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-29-6',
    q: -7,
    r: -4,
    terrain: 'hills',
    infra: 1,
    population: 26800,
    elevation: 760,
    wx: -9.5,
    wy: -6.5,
    fac_ctl: 'col',
    sett_name: 'Campoalegre Basin',
    infra_nodes: []
  },
  {
    id: 'col-29-7',
    q: -6,
    r: -4,
    terrain: 'mountain',
    infra: 1,
    population: 21400,
    elevation: 1540,
    wx: -8.0,
    wy: -6.5,
    fac_ctl: 'col',
    sett_name: 'Algeciras Eastern Slope',
    infra_nodes: []
  },

  // --- 5 New Appended Hexes ---
  {
    id: 'col-29-8',
    q: -8,
    r: 0,
    terrain: 'mountain',
    infra: 1,
    population: 16800,
    elevation: 2100,
    wx: -11.0,
    wy: -0.5,
    fac_ctl: 'col',
    sett_name: 'Roncesvalles Highlands',
    infra_nodes: []
  },
  {
    id: 'col-29-9',
    q: -8,
    r: -1,
    terrain: 'mountain',
    infra: 1,
    population: 15100,
    elevation: 2350,
    wx: -11.0,
    wy: -2.0,
    fac_ctl: 'col',
    sett_name: 'Barragán Mountain Pass',
    infra_nodes: []
  },
  {
    id: 'col-29-10',
    q: -8,
    r: -2,
    terrain: 'hills',
    infra: 1,
    population: 18300,
    elevation: 980,
    wx: -11.0,
    wy: -3.5,
    fac_ctl: 'col',
    sett_name: 'Caicedonia Foothills',
    infra_nodes: []
  },
  {
    id: 'col-29-11',
    q: -8,
    r: -3,
    terrain: 'plain',
    infra: 1,
    population: 24200,
    elevation: 510,
    wx: -11.0,
    wy: -5.0,
    fac_ctl: 'col',
    sett_name: 'Tuluá Valley East',
    infra_nodes: []
  },
  {
    id: 'col-29-12',
    q: -8,
    r: -4,
    terrain: 'mountain',
    infra: 1,
    population: 17900,
    elevation: 1810,
    wx: -11.0,
    wy: -6.5,
    fac_ctl: 'col',
    sett_name: 'Bojayá-Cordillera Link',
    infra_nodes: []
  }
];
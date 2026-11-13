import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL12: RuntimeHexEntity[] = [
  // --- Range: -9, 6 to -5, 6 ---
  {
    id: 'col-12-1',
    q: -9,
    r: 6,
    terrain: 'coastal',
    infra: 2,
    population: 18500,
    elevation: 8,
    wx: -13.0,
    wy: 11.5,
    fac_ctl: 'col',
    sett_name: 'San Bernardo del Viento Coast',
    infra_nodes: []
  },
  {
    id: 'col-12-2',
    q: -8,
    r: 6,
    terrain: 'plain',
    infra: 2,
    population: 24000,
    elevation: 25,
    wx: -11.0,
    wy: 11.5,
    fac_ctl: 'col',
    sett_name: 'Lorica Lowlands South',
    infra_nodes: []
  },
  {
    id: 'col-12-3',
    q: -7,
    r: 6,
    terrain: 'plain',
    infra: 2,
    population: 31200,
    elevation: 35,
    wx: -9.0,
    wy: 11.5,
    fac_ctl: 'col',
    sett_name: 'Chinú Agricultural Sector',
    infra_nodes: []
  },
  {
    id: 'col-12-4',
    q: -6,
    r: 6,
    terrain: 'hills',
    infra: 2,
    population: 42000,
    elevation: 145,
    wx: -7.0,
    wy: 11.5,
    fac_ctl: 'col',
    sett_name: 'Corozal Hills',
    infra_nodes: []
  },
  {
    id: 'col-12-5',
    q: -5,
    r: 6,
    terrain: 'marsh',
    infra: 1,
    population: 12500,
    elevation: 16,
    wx: -5.0,
    wy: 11.5,
    fac_ctl: 'col',
    sett_name: 'San Benito Abad Marshes',
    infra_nodes: []
  },

  // --- Range: -9, 7 to -5, 7 (including -7, 7) ---
  {
    id: 'col-12-6',
    q: -9,
    r: 7,
    terrain: 'port',
    infra: 3,
    population: 65000,
    elevation: 4,
    wx: -13.0,
    wy: 13.5,
    fac_ctl: 'col',
    sett_name: 'Coveñas Port & Terminals',
    infra_nodes: [
      {
        id: 'node-col12-6',
        name: 'Coveñas Oil Export Terminal',
        cat: 'CIV_LOG',
        tier: 3,
        cap: 120,
        state: 'online',
        maint_dur: 15,
        maint_prog: 0
      }
    ]
  },
  {
    id: 'col-12-7',
    q: -8,
    r: 7,
    terrain: 'urban',
    infra: 3,
    population: 112000,
    elevation: 20,
    wx: -11.0,
    wy: 13.5,
    fac_ctl: 'col',
    sett_name: 'San Antero & Lorica',
    infra_nodes: []
  },
  {
    id: 'col-12-8',
    q: -7,
    r: 7,
    terrain: 'plain',
    infra: 2,
    population: 29000,
    elevation: 30,
    wx: -9.0,
    wy: 13.5,
    fac_ctl: 'col',
    sett_name: 'Tuchín Savanna',
    infra_nodes: []
  },
  {
    id: 'col-12-9',
    q: -6,
    r: 7,
    terrain: 'urban',
    infra: 3,
    population: 85000,
    elevation: 130,
    wx: -7.0,
    wy: 13.5,
    fac_ctl: 'col',
    sett_name: 'Sampués Sector',
    infra_nodes: []
  },
  {
    id: 'col-12-10',
    q: -5,
    r: 7,
    terrain: 'plain',
    infra: 2,
    population: 22000,
    elevation: 45,
    wx: -5.0,
    wy: 13.5,
    fac_ctl: 'col',
    sett_name: 'Guaranda Plains',
    infra_nodes: []
  },

  // --- Range: -8, 8 to -8, 6 (Deduplicated -8,6 & -8,7; adding -8,8) ---
  {
    id: 'col-12-11',
    q: -8,
    r: 8,
    terrain: 'coastal',
    infra: 3,
    population: 78000,
    elevation: 6,
    wx: -11.0,
    wy: 15.5,
    fac_ctl: 'col',
    sett_name: 'Tolú Maritime Hub',
    infra_nodes: [
      {
        id: 'node-col12-11',
        name: 'Golfo de Morrosquillo Station',
        cat: 'COMMS',
        tier: 2,
        cap: 60,
        state: 'online',
        maint_dur: 10,
        maint_prog: 0
      }
    ]
  },

  // --- Range: -7, 8 to -5, 8 ---
  {
    id: 'col-12-12',
    q: -7,
    r: 8,
    terrain: 'plain',
    infra: 2,
    population: 34000,
    elevation: 40,
    wx: -9.0,
    wy: 15.5,
    fac_ctl: 'col',
    sett_name: 'Ovejas Valley',
    infra_nodes: []
  },
  {
    id: 'col-12-13',
    q: -6,
    r: 8,
    terrain: 'plain',
    infra: 2,
    population: 26000,
    elevation: 55,
    wx: -7.0,
    wy: 15.5,
    fac_ctl: 'col',
    sett_name: 'El Carmen de Bolívar',
    infra_nodes: []
  },
  {
    id: 'col-12-14',
    q: -5,
    r: 8,
    terrain: 'marsh',
    infra: 1,
    population: 15400,
    elevation: 18,
    wx: -5.0,
    wy: 15.5,
    fac_ctl: 'col',
    sett_name: 'Magangué Wetland Approach',
    infra_nodes: []
  },

  // --- Range: -5, 9 to -6, 9 (q from -6 to -5, r = 9) ---
  {
    id: 'col-12-15',
    q: -6,
    r: 9,
    terrain: 'plain',
    infra: 2,
    population: 38000,
    elevation: 32,
    wx: -7.0,
    wy: 17.5,
    fac_ctl: 'col',
    sett_name: 'Zambrano Lowlands',
    infra_nodes: []
  },
  {
    id: 'col-12-16',
    q: -5,
    r: 9,
    terrain: 'port',
    infra: 4,
    population: 145000,
    elevation: 12,
    wx: -5.0,
    wy: 17.5,
    fac_ctl: 'col',
    sett_name: 'Magangué Port City',
    infra_nodes: [
      {
        id: 'node-col12-16',
        name: 'Magdalena River Terminal',
        cat: 'CIV_LOG',
        tier: 3,
        cap: 110,
        state: 'online',
        maint_dur: 14,
        maint_prog: 0
      }
    ]
  },

  // --- Range: -5, 10 and -4, 10 ---
  {
    id: 'col-12-17',
    q: -5,
    r: 10,
    terrain: 'plain',
    infra: 2,
    population: 21000,
    elevation: 25,
    wx: -5.0,
    wy: 19.5,
    fac_ctl: 'col',
    sett_name: 'Cicuco Oil Field Sector',
    infra_nodes: []
  },
  {
    id: 'col-12-18',
    q: -4,
    r: 10,
    terrain: 'marsh',
    infra: 1,
    population: 11200,
    elevation: 14,
    wx: -3.0,
    wy: 19.5,
    fac_ctl: 'col',
    sett_name: 'Mompox Island Marsh',
    infra_nodes: []
  }
];
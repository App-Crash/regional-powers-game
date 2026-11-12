import { type RuntimeHexEntity } from '../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER: RuntimeHexEntity[] = [
  {
    id: 'hex_cartagena',
    q: -10,
    r: 7,
    terrain: 'port',
    infra: 8,
    population: 1010995,
    elevation: 2,
    wx: -25.0,
    wy: 12.0,
    ctrl: 'player',
    sett_name: 'Cartagena',
    infra_nodes: [
      {
        id: 'node_cartagena_port',
        name: 'Contecar Maritime Terminal',
        cat: 'CIV_LOG',
        tier: 9,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  },
  {
    id: 'hex_barranquilla',
    q: -9,
    r: 6,
    terrain: 'port',
    infra: 8,
    population: 1275854,
    elevation: 18,
    wx: -22.5,
    wy: 10.5,
    ctrl: 'player',
    sett_name: 'Barranquilla',
    infra_nodes: [
      {
        id: 'node_barranquilla_power',
        name: 'Termobarranquilla Power',
        cat: 'ELEC_GEN',
        tier: 8,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  },
  {
    id: 'hex_soledad',
    q: -9,
    r: 7,
    terrain: 'suburban',
    infra: 6,
    population: 733597,
    elevation: 5,
    wx: -22.5,
    wy: 12.0,
    ctrl: 'player',
    sett_name: 'Soledad',
    infra_nodes: [
      {
        id: 'node_soledad_sub',
        name: 'Soledad Substation',
        cat: 'ELEC_DIST',
        tier: 6,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  },
  {
    id: 'hex_valledupar',
    q: -6,
    r: 5,
    terrain: 'farmland',
    infra: 5,
    population: 629217,
    elevation: 168,
    wx: -15.0,
    wy: 9.0,
    ctrl: 'player',
    sett_name: 'Valledupar',
    infra_nodes: [
      {
        id: 'node_valledupar_agri',
        name: 'Cesar Processing Center',
        cat: 'CON_MFG',
        tier: 5,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  },
  {
    id: 'hex_cucuta',
    q: 2,
    r: 4,
    terrain: 'urban',
    infra: 6,
    population: 792180,
    elevation: 320,
    wx: 5.0,
    wy: 7.0,
    ctrl: 'player',
    sett_name: 'Cúcuta',
    infra_nodes: [
      {
        id: 'node_tienditas',
        name: 'Atanasio Girardot Bridge',
        cat: 'TRNSPRT',
        tier: 7,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  },
  {
    id: 'hex_bucaramanga',
    q: -3,
    r: 1,
    terrain: 'mountainous',
    infra: 7,
    population: 618548,
    elevation: 959,
    wx: -7.5,
    wy: 2.0,
    ctrl: 'player',
    sett_name: 'Bucaramanga',
    infra_nodes: [
      {
        id: 'node_sogamoso',
        name: 'Sogamoso Hydroelectric Dam',
        cat: 'ELEC_GEN',
        tier: 9,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  },
  {
    id: 'hex_medellin',
    q: -4,
    r: -1,
    terrain: 'urban',
    infra: 9,
    population: 2526795,
    elevation: 1495,
    wx: -10.0,
    wy: -1.5,
    ctrl: 'player',
    sett_name: 'Medellin',
    infra_nodes: [
      {
        id: 'node_mde_metro',
        name: 'Aburrá Rail Transit',
        cat: 'TRNSPRT',
        tier: 9,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  },
  {
    id: 'hex_bogota',
    q: 0,
    r: 0,
    terrain: 'urban',
    infra: 10,
    population: 7945996,
    elevation: 2640,
    wx: 0.0,
    wy: 0.0,
    ctrl: 'player',
    sett_name: 'Bogotá',
    infra_nodes: [
      {
        id: 'node_bogota_guavio',
        name: 'Guavio Hydroelectric',
        cat: 'ELEC_GEN',
        tier: 10,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  },
  {
    id: 'hex_soacha',
    q: 0,
    r: -1,
    terrain: 'suburban',
    infra: 7,
    population: 895878,
    elevation: 2565,
    wx: 0.0,
    wy: -1.5,
    ctrl: 'player',
    sett_name: 'Soacha',
    infra_nodes: [
      {
        id: 'node_autopista',
        name: 'Autopista Sur Corridor',
        cat: 'TRNSPRT',
        tier: 7,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  },
  {
    id: 'hex_cali',
    q: -3,
    r: -4,
    terrain: 'urban',
    infra: 8,
    population: 2269983,
    elevation: 1018,
    wx: -7.5,
    wy: -6.0,
    ctrl: 'player',
    sett_name: 'Cali',
    infra_nodes: [
      {
        id: 'node_cali_sub',
        name: 'San Carlos Substation',
        cat: 'ELEC_DIST',
        tier: 8,
        cap: 100,
        state: 'online',
        maint_dur: 0,
        maint_prog: 100
      }
    ]
  }
];
import { type RuntimeHexEntity } from '../../../features/home/HexTypes';

export const MOCK_COLOMBIA_THEATER_COL1: RuntimeHexEntity[] = [
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
    fac_ctl: 'col',
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
    r: 8,
    terrain: 'port',
    infra: 8,
    population: 2009451,
    elevation: 18,
    wx: -22.0,
    wy: 14.0,
    fac_ctl: 'col',
    sett_name: 'Barranquilla & Soledad',
    infra_nodes: [
      {
        id: 'node_barranquilla_power',
        name: 'Termobarranquilla Power & Logistics',
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
    id: 'hex_valledupar',
    q: -6,
    r: 7,
    terrain: 'urban',
    infra: 5,
    population: 629217,
    elevation: 168,
    wx: -14.5,
    wy: 12.0,
    fac_ctl: 'col',
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
    id: 'hex_medellin',
    q: -5,
    r: -2,
    terrain: 'urban',
    infra: 9,
    population: 2526795,
    elevation: 1495,
    wx: -9.0,
    wy: -3.5,
    fac_ctl: 'col',
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
    id: 'hex_bucaramanga',
    q: -1,
    r: -1,
    terrain: 'mountain',
    infra: 7,
    population: 618548,
    elevation: 959,
    wx: -1.5,
    wy: -1.5,
    fac_ctl: 'col',
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
    id: 'hex_cucuta',
    q: -2,
    r: 1,
    terrain: 'urban',
    infra: 6,
    population: 792180,
    elevation: 320,
    wx: -1.5,
    wy: 2.0,
    fac_ctl: 'col',
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
    id: 'hex_bogota',
    q: -1,
    r: -5,
    terrain: 'urban',
    infra: 10,
    population: 8841874,
    elevation: 2640,
    wx: -3.5,
    wy: -8.5,
    fac_ctl: 'col',
    sett_name: 'Bogota & Soacha',
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
      },
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
    q: -4,
    r: -8,
    terrain: 'urban',
    infra: 8,
    population: 2269983,
    elevation: 1018,
    wx: -8.0,
    wy: -14.0,
    fac_ctl: 'col',
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
  },
  {
    id: 'col-m-82',
    q: -8,
    r: -2,
    terrain: 'mountain',
    infra: 1,
    population: 9500,
    elevation: 2150,
    wx: -11.0,
    wy: -6.0,
    fac_ctl: 'col',
    sett_name: 'Antioquia Western Slopes',
    infra_nodes: []
  },
  {
    id: 'col-m-83',
    q: -8,
    r: -1,
    terrain: 'mountain',
    infra: 1,
    population: 11200,
    elevation: 2300,
    wx: -10.5,
    wy: -5.0,
    fac_ctl: 'col',
    sett_name: 'Cañasgordas Ridge',
    infra_nodes: []
  }
];
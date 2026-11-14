import { type RuntimeHexEntity } from '../../../features/home/HexTypes';
import { MOCK_VENEZUELA_CHUNK_1 } from './ven1';
import { MOCK_VENEZUELA_CHUNK_2 } from './ven2';
import { MOCK_VENEZUELA_CHUNK_3 } from './ven3';
import { MOCK_VENEZUELA_CHUNK_4 } from './ven4';
import { MOCK_VENEZUELA_CHUNK_5 } from './ven5';
import { MOCK_VENEZUELA_CHUNK_6 } from './ven6';
import { MOCK_VENEZUELA_CHUNK_7 } from './ven7';
import { MOCK_VENEZUELA_CHUNK_8 } from './ven8';
import { MOCK_VENEZUELA_CHUNK_9 } from './ven9';
import { MOCK_VENEZUELA_CHUNK_10 } from './ven10';
import { MOCK_VENEZUELA_CHUNK_11 } from './ven11';
import { MOCK_VENEZUELA_CHUNK_12 } from './ven12';
import { MOCK_VENEZUELA_CHUNK_13 } from './ven13';
import { MOCK_VENEZUELA_CHUNK_14 } from './ven14';
import { MOCK_VENEZUELA_CHUNK_15 } from './ven15';
import { MOCK_VENEZUELA_CHUNK_16 } from './ven16';
import { MOCK_VENEZUELA_CHUNK_17 } from './ven17';

export const NATION_META = {
  code: 'ven' as const,
  region: 'SA' as const,
  name: 'Venezuela',
};

export const MOCK_VENEZUELA_THEATER: RuntimeHexEntity[] = [
  ...MOCK_VENEZUELA_CHUNK_1,
  ...MOCK_VENEZUELA_CHUNK_2,
  ...MOCK_VENEZUELA_CHUNK_3,
  ...MOCK_VENEZUELA_CHUNK_4,
  ...MOCK_VENEZUELA_CHUNK_5,
  ...MOCK_VENEZUELA_CHUNK_6,
  ...MOCK_VENEZUELA_CHUNK_7,
  ...MOCK_VENEZUELA_CHUNK_8,
  ...MOCK_VENEZUELA_CHUNK_9,
  ...MOCK_VENEZUELA_CHUNK_10,
  ...MOCK_VENEZUELA_CHUNK_11,
  ...MOCK_VENEZUELA_CHUNK_12,
  ...MOCK_VENEZUELA_CHUNK_13,
  ...MOCK_VENEZUELA_CHUNK_14,
  ...MOCK_VENEZUELA_CHUNK_15,
  ...MOCK_VENEZUELA_CHUNK_16,
  ...MOCK_VENEZUELA_CHUNK_17,
];

export function buildTheaterNation(): RuntimeHexEntity[] {
  return MOCK_VENEZUELA_THEATER;
}
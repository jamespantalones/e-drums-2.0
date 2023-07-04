import { Library, SoundFile } from '../types';

export type Config = {
  DEFAULT_BPM: number;
  MAX_BPM: number;
  MIN_BPM: number;
  MAX_SLICES: number;
  MAX_TRACKS: number;
  SOUNDS: {
    [key in Library]: SoundFile[];
  };
};

export const config: Config = {
  DEFAULT_BPM: 134,
  MAX_BPM: 250,
  MIN_BPM: 60,
  MAX_SLICES: 20,
  MAX_TRACKS: 20,

  SOUNDS: {
    TR727: [
      {
        name: 'CABASA',
        defaultFreqRange: [20, 80],
        files: ['tr727/cabasa.wav'],
      },
      {
        name: 'HI BONGO',
        defaultFreqRange: [20, 80],
        files: ['tr727/hi_bongo.wav'],
      },
      {
        name: 'LO BONGO',
        defaultFreqRange: [20, 80],
        files: ['tr727/lo_bongo.wav'],
      },

      {
        name: 'HI TIMBALE',
        defaultFreqRange: [20, 80],
        files: ['tr727/hi_timba.wav'],
      },

      {
        name: 'LO TIMBALE',
        defaultFreqRange: [20, 80],
        files: ['tr727/lo_timba.wav'],
      },

      {
        name: 'HI CONGA',
        defaultFreqRange: [20, 80],
        files: ['tr727/hm_conga.wav'],
      },

      {
        name: 'LO CONGA',
        defaultFreqRange: [20, 80],
        files: ['tr727/lo_conga.wav'],
      },

      {
        name: 'MARACAS',
        defaultFreqRange: [20, 80],
        files: ['tr727/maracas.wav'],
      },

      {
        name: 'STARCHIM',
        defaultFreqRange: [20, 80],
        files: ['tr727/starchim.wav'],
      },
    ],
    RAVEN: [
      {
        name: 'HIT',
        defaultFreqRange: [20, 80],
        files: ['raven/raven_hit.mp3'],
      },
    ],
    MINIPOPS: [
      {
        name: 'KICK',
        defaultFreqRange: [0, 40],
        files: [
          'minipops/pops-bd-1.wav',
          'minipops/pops-bd-2.wav',
          'minipops/pops-bd-3.wav',
          'minipops/pops-bd-4.wav',
        ],
      },
      {
        name: 'CLAVE',
        defaultFreqRange: [20, 60],
        files: [
          'minipops/pops-clave1.wav',
          'minipops/pops-clave2.wav',
          'minipops/pops-clave5.wav',
          'minipops/pops-clave6.wav',
        ],
      },
      {
        name: 'CONGA',
        defaultFreqRange: [20, 80],
        files: [
          'minipops/pops-con1.wav',
          'minipops/pops-con2.wav',
          'minipops/pops-con3.wav',
          'minipops/pops-con4.wav',
        ],
      },
      {
        name: 'HAT_CLOSED',
        defaultFreqRange: [60, 100],
        files: [
          'minipops/pops-hh-1.wav',
          'minipops/pops-hh-2.wav',
          'minipops/pops-hh-3.wav',
          'minipops/pops-hh-4.wav',
          'minipops/pops-hh-5.wav',
          'minipops/pops-hh-6.wav',
        ],
      },
      {
        name: 'HAT_OPEN',
        defaultFreqRange: [60, 100],
        files: ['minipops/pops-hho1.wav', 'minipops/pops-hho2.wav'],
      },
      {
        name: 'RIM',
        defaultFreqRange: [40, 80],
        files: [
          'minipops/pops-rim1.wav',
          'minipops/pops-rim2.wav',
          'minipops/pops-rim3.wav',
          'minipops/pops-rim4.wav',
        ],
      },
      {
        name: 'SNARE',
        defaultFreqRange: [40, 80],
        files: [
          'minipops/pops-sd-1.wav',
          'minipops/pops-sd-2.wav',
          'minipops/pops-sd-3.wav',
          'minipops/pops-sd-4.wav',
          'minipops/pops-sd-5.wav',
        ],
      },
    ],
  },
};

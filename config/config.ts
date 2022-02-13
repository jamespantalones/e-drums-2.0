import colors from 'tailwindcss/colors';
import { Config } from '../types';

const config: Config = {
  MAX_SLICES: 20,
  MAX_TRACKS: 8,
  COLORS: [
    ...Object.values(colors.yellow),
    ...Object.values(colors.red),
    ...Object.values(colors.orange),
    ...Object.values(colors.amber),
    ...Object.values(colors.lime),
    ...Object.values(colors.green),
    ...Object.values(colors.teal),
    ...Object.values(colors.cyan),
    ...Object.values(colors.sky),
    ...Object.values(colors.blue),
    ...Object.values(colors.indigo),
    ...Object.values(colors.violet),
    ...Object.values(colors.purple),
    ...Object.values(colors.fuchsia),
    ...Object.values(colors.pink),
    ...Object.values(colors.rose),
  ],

  SOUNDS: {
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

export default config;

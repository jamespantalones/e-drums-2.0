export enum Library {
  MINIPOPS = 'MINIPOPS',
}

export type SoundFile = {
  name: string;
      files: string[];
      defaultFreqRange: [number, number],
}

export type Config = {
  MAX_SLICES: number,
  SOUNDS: {
    [key in Library]: SoundFile[];
  },
}


const config: Config = {
  MAX_SLICES: 24,
  SOUNDS: {
    MINIPOPS: [
      {
        name: 'KICK',
        defaultFreqRange: [0,40],
        files: [
          "minipops/pops-bd-1.wav",
          "minipops/pops-bd-2.wav",
          "minipops/pops-bd-3.wav",
          "minipops/pops-bd-4.wav",
        ]
      },
      {
        name: 'CLAVE',
        defaultFreqRange: [40,80],
        files: [
          "minipops/pops-clave1.wav",
          "minipops/pops-clave2.wav",
          "minipops/pops-clave5.wav",
          "minipops/pops-clave6.wav",
        ]
      },
      {
        name: 'CONGA',
        defaultFreqRange: [40,80],
        files: [
          "minipops/pops-con1.wav",
          "minipops/pops-con2.wav",
          "minipops/pops-con3.wav",
          "minipops/pops-con4.wav",
        ]
      },
      {
        name: 'HAT_CLOSED',
        defaultFreqRange: [60,100],
        files: [
          "minipops/pops-hh-1.wav",
          "minipops/pops-hh-2.wav",
          "minipops/pops-hh-3.wav",
          "minipops/pops-hh-4.wav",
          "minipops/pops-hh-5.wav",
          "minipops/pops-hh-6.wav",
        ]
      },
      {
        name: 'HAT_OPEN',
        defaultFreqRange: [60,100],
        files: [
          "minipops/pops-hho1.wav",
          "minipops/pops-hho2.wav",
        ]
      },
      {
        name: 'RIM',
        defaultFreqRange: [40,80],
        files: [
          "minipops/pops-rim1.wav",
          "minipops/pops-rim2.wav",
          "minipops/pops-rim3.wav",
          "minipops/pops-rim4.wav",
        ]
      },
      {
        name: 'SNARE',
        defaultFreqRange: [40,80],
        files: [
          "minipops/pops-sd-1.wav",
          "minipops/pops-sd-2.wav",
          "minipops/pops-sd-3.wav",
          "minipops/pops-sd-4.wav",
          "minipops/pops-sd-5.wav",
        ]
      }
    ],
  },
}


export default config;
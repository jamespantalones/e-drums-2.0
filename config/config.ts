export enum Library {
  MINIPOPS = 'MINIPOPS',
  SYNSONICS = 'SYNSONICS'
}


const config: {
  SOUNDS: {
    [key in Library]: string[]
  },
  MAX_SLICES: number,
} = {
  SOUNDS: {
    MINIPOPS: [
      "minipops/pops-bd-1.wav",
      "minipops/pops-bd-2.wav",
      "minipops/pops-bd-3.wav",
      "minipops/pops-bd-4.wav",
      "minipops/pops-clave1.wav",
      "minipops/pops-clave2.wav",
      "minipops/pops-clave5.wav",
      "minipops/pops-clave6.wav",
      "minipops/pops-con1.wav",
      "minipops/pops-con2.wav",
      "minipops/pops-con3.wav",
      "minipops/pops-con4.wav",
      "minipops/pops-hh-1.wav",
      "minipops/pops-hh-2.wav",
      "minipops/pops-hh-3.wav",
      "minipops/pops-hh-4.wav",
      "minipops/pops-hh-5.wav",
      "minipops/pops-hh-6.wav",
      "minipops/pops-hho1.wav",
      "minipops/pops-hho2.wav",
      "minipops/pops-mix-1.wav",
      "minipops/pops-mix-2.wav",
      "minipops/pops-rim1.wav",
      "minipops/pops-rim2.wav",
      "minipops/pops-rim3.wav",
      "minipops/pops-rim4.wav",
      "minipops/pops-sd-1.wav",
      "minipops/pops-sd-2.wav",
      "minipops/pops-sd-3.wav",
      "minipops/pops-sd-4.wav",
      "minipops/pops-sd-5.wav",
    ],

    SYNSONICS: [
      'synsonics/MatBd.wav',
      'synsonics/MatCym.wav',
      'synsonics/MatHiT.wav',
      'synsonics/MatHiT2.wav',
      'synsonics/MatHiT3.wav',
      'synsonics/MatLoT.wav',
      'synsonics/MatSn.wav',
    ]
  },
  MAX_SLICES: 24,
}

export default config;
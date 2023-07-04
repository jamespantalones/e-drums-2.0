import { nanoid } from 'nanoid';
import localforage from 'localforage';
import { Track } from '../lib/Track';
import { Sequencer } from '../lib/Sequencer';

export function generateId() {
  return nanoid(10);
}

export function getRandomValue<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function loadFromLocalStorage() {
  // setup localstorage
  localforage.config({ storeName: 'e-drums', name: 'e-drums' });

  // get anything out of local
  const initialState = await localforage.getItem<{
    rhythmIndex: number;
    tracks: Track[];
    bpm: number;
  }>('state');

  return initialState;
}

export function padNumber(num: number): string {
  if (num < 10 && num > -1) {
    return `0${num}`;
  }
  return num.toString();
}

export function noop() {
  return undefined;
}

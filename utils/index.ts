import { nanoid } from 'nanoid';
import { SerializedTrack } from '../types';

export function generateId() {
  return nanoid(10);
}

export function getRandomValue<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

import { nanoid } from 'nanoid';

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

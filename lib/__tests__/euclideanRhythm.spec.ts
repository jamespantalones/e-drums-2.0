import { describe, expect, it } from 'vitest';
import { euclideanRhythm } from '../euclideanRhythm';

describe('Euclidean rhythm', () => {
  it('should return correct outputs', () => {
    expect(euclideanRhythm(4, 8, 50)).toEqual([50, 0, 50, 0, 50, 0, 50, 0]);
    expect(euclideanRhythm(2, 3, 50)).toEqual([50, 50, 0]);
  });
});

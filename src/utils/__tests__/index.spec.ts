import { describe, expect, it } from 'vitest';
import { generateId, noop, padNumber, randomIntFromInterval } from '..';
import { Config } from '../../config';

describe('Utils', () => {
  it('should return an id of correct length', () => {
    expect(generateId()).toEqual(expect.any(String));
    expect(generateId().length).toEqual(Config.ID_LENGTH);
  });
  it('should return a random number between intervals', () => {
    const val = randomIntFromInterval(3, 6);
    expect(val).toBeGreaterThanOrEqual(3);
    expect(val).toBeLessThanOrEqual(6);
  });
  it('should pad a number', () => {
    expect(padNumber(5)).toEqual('05');
    expect(padNumber(11)).toEqual('11');
    expect(padNumber(-5)).toEqual('-05');
    expect(padNumber(-10)).toEqual('-10');
  });
  it('should return an noop func', () => {
    expect(noop()).toEqual(undefined);
  });
});

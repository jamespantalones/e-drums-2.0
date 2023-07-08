import { describe, expect, it, vi } from 'vitest';
import { Track } from '../Track';

describe('Track', () => {
  it('should create a new track', () => {
    expect(
      new Track({
        index: 0,
        updateSelfInParent: vi.fn(),
      })
    ).toEqual('asdf');
  });
});

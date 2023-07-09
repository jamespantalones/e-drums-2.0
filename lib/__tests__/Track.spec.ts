import { describe, expect, it, vi } from 'vitest';
import { Track } from '../Track';

describe('Track', () => {
  it('should create a new track', () => {
    expect(
      new Track({
        index: 0,
        updateSelfInParent: vi.fn(),
      })
    ).toEqual(
      expect.objectContaining({
        color: expect.any(String),
        fileBuffer: null,
        id: expect.any(String),
        index: 0,
        instrument: null,
        isReady: false,
        onNotes: 4,
        pattern: [1, 0, 1, 0, 1, 0, 1, 0],
        pitch: 50,
        totalNotes: 8,
        updateSelfInParent: expect.any(Function),
        volume: 0.3,
      })
    );
  });
});

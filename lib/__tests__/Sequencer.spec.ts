import { describe, it, vi, afterEach, expect } from 'vitest';
import { Sequencer } from '../Sequencer';
import { SerializedTrack } from '../../types';

vi.mock('tone');

const initialTracks: SerializedTrack[] = [
  {
    id: 'foo',
    onNotes: 4,
    totalNotes: 8,
    color: 'red',
    index: 0,
    pitch: 150,
  },
];
describe('Sequencer', () => {
  const onTick = vi.fn();
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return a Sequencer', () => {
    const instance = new Sequencer({ bpm: 74, onTick, initialTracks });
    expect(instance).toEqual(
      expect.objectContaining({
        bpm: 74,
        isInit: false,
        onTick: expect.any(Function),
        playState: 0,
        state: expect.objectContaining({
          rhythmIndex: -1,
          tracks: expect.any(Array),
        }),
      })
    );
  });

  it('should allow clearing a sequencer', () => {
    const instance = new Sequencer({ bpm: 74, onTick, initialTracks });
    expect(instance.clear).toBe(expect.any(Function));
  });
});

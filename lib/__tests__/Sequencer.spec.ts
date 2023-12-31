import { describe, it, vi, afterEach, expect } from 'vitest';
import { Sequencer } from '../Sequencer';
import { SerializedTrack } from '../../types';

vi.mock('tone');

const initialTracks: SerializedTrack[] = [
  {
    id: 'foo',
    onNotes: 4,
    name: null,
    totalNotes: 8,
    color: [255, 0, 0],
    hue: 265,
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
    const instance = new Sequencer({
      bpm: 74,
      onTick,
      initialTracks,
      id: 'asdf',
    });
    expect(instance.clear).toEqual(expect.any(Function));
    expect(instance.state.tracks.every((t) => t.pattern.every((p) => 0)));
  });

  it('should export a JSON representation on save', async () => {
    const instance = new Sequencer({
      bpm: 74,
      onTick,
      initialTracks,
      id: 'asdf',
    });
    expect(await instance.exportJSON()).toEqual(
      JSON.stringify(
        {
          bpm: 74,
          id: 'asdf',
          state: {
            rhythmIndex: -1,
            tracks: [
              {
                id: 'foo',
                index: 0,
                onNotes: 4,
                totalNotes: 8,
                isReady: false,
                instrument: null,
                color: 'red',
                hue: 265,
                volume: 0.3,
                prevVolume: 0.3,
                pitch: 150,
                muted: false,
                pattern: [1, 0, 1, 0, 1, 0, 1, 0],
                pitchOffset: [0, 0, 0, 0, 0, 0, 0, 0],
              },
            ],
          },
          playState: 0,
        },
        null,
        2
      )
    );
  });
});

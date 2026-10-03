import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAnswerCapture, recordingExtension, recordingFile } from '../src/phase1/recording';

class FakeRecorder extends EventTarget {
  static last: FakeRecorder;
  static supported = ['audio/webm;codecs=opus'];
  static isTypeSupported(mime: string) { return this.supported.includes(mime); }
  state = 'inactive';
  mimeType: string;
  stopCalls = 0;
  finishAutomatically = true;
  constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
    super(); this.mimeType = options?.mimeType ?? 'audio/webm'; FakeRecorder.last = this;
  }
  start() { this.state = 'recording'; }
  chunk(text: string) { this.dispatchEvent(Object.assign(new Event('dataavailable'), { data: new Blob([text], { type: this.mimeType }) })); }
  finish() { this.state = 'inactive'; this.dispatchEvent(new Event('stop')); }
  stop() {
    this.stopCalls++; this.state = 'inactive';
    if (this.finishAutomatically) queueMicrotask(() => { this.chunk('final'); this.finish(); });
  }
}
const capture = () => createAnswerCapture({} as MediaStream, FakeRecorder as unknown as typeof MediaRecorder);
afterEach(() => { vi.useRealTimers(); FakeRecorder.supported = ['audio/webm;codecs=opus']; });

describe('answer recording lifecycle', () => {
  it('waits for the final dataavailable before producing the Blob', async () => {
    const answer = capture(); FakeRecorder.last.chunk('first-');
    const blob = await answer.stop();
    expect(await blob?.text()).toBe('first-final');
    expect(blob?.type).toBe('audio/webm;codecs=opus');
  });
  it('stops idempotently and does not duplicate final data', async () => {
    const answer = capture(); const first = answer.stop(); const second = answer.stop();
    expect(second).toBe(first); await first; expect(FakeRecorder.last.stopCalls).toBe(1);
  });
  it('keeps the final Blob if the microphone ends naturally', async () => {
    const answer = capture(); FakeRecorder.last.chunk('device ended'); FakeRecorder.last.finish();
    expect(await (await answer.stop())?.text()).toBe('device ended');
    expect(FakeRecorder.last.stopCalls).toBe(0);
  });
  it('isolates chunks and ignores late events from a previous question', async () => {
    const first = capture(); const firstRecorder = FakeRecorder.last;
    await first.stop(); const second = capture();
    firstRecorder.chunk('late'); FakeRecorder.last.chunk('second-');
    expect(await (await second.stop())?.text()).toBe('second-final');
    expect(await (await first.result)?.text()).toBe('final');
  });
  it('returns null for an empty recording instead of claiming success', async () => {
    const answer = capture(); FakeRecorder.last.finish(); expect(await answer.stop()).toBeNull();
  });
  it('retains partial audio and exposes device errors', async () => {
    const answer = capture(); FakeRecorder.last.chunk('partial');
    FakeRecorder.last.dispatchEvent(Object.assign(new Event('error'), { error: new Error('microphone disconnected') }));
    FakeRecorder.last.finish();
    expect(await (await answer.stop())?.text()).toBe('partial'); expect(answer.error).toContain('disconnected');
  });
  it('does not hang forever if the recorder never emits stop', async () => {
    vi.useFakeTimers(); const answer = capture(); FakeRecorder.last.chunk('partial'); FakeRecorder.last.finishAutomatically = false;
    const stopping = answer.stop(); await vi.advanceTimersByTimeAsync(5000);
    expect(await (await stopping)?.text()).toBe('partial'); expect(answer.error).toContain('시간');
  });
  it('selects MP4 when WebM is unsupported and names audio correctly', async () => {
    FakeRecorder.supported = ['audio/mp4']; const answer = capture();
    expect((await answer.stop())?.type).toBe('audio/mp4');
    expect(recordingFile('Q001', 'audio/mp4')).toBe('audio/Q001.m4a');
  });
  it('chooses a safe extension and strips path characters', () => {
    expect(recordingExtension('audio/ogg;codecs=opus')).toBe('ogg');
    expect(recordingExtension('audio/webm;codecs=opus')).toBe('webm');
    expect(recordingFile('../Q/001', 'audio/ogg')).toBe('audio/___Q_001.ogg');
  });
});

export function recordingExtension(mimeType: string): string {
  if (/mp4|m4a/i.test(mimeType)) return 'm4a';
  if (/ogg/i.test(mimeType)) return 'ogg';
  if (/wav/i.test(mimeType)) return 'wav';
  return 'webm';
}
export function recordingFile(questionId: string, mimeType: string): string {
  const id = questionId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || 'answer';
  return `audio/${id}.${recordingExtension(mimeType)}`;
}
export interface AnswerCapture {
  recorder: MediaRecorder;
  result: Promise<Blob | null>;
  stop: () => Promise<Blob | null>;
  error: string | null;
}

export function createAnswerCapture(stream: MediaStream, Recorder: typeof MediaRecorder = MediaRecorder): AnswerCapture {
  const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
    .find(type => Recorder.isTypeSupported(type));
  const recorder = mimeType ? new Recorder(stream, { mimeType }) : new Recorder(stream);
  const chunks: Blob[] = [];
  let finalize!: (blob: Blob | null) => void;
  let settled = false;
  let stopping = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const result = new Promise<Blob | null>(resolve => { finalize = resolve; });
  const finish = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    recorder.removeEventListener('dataavailable', onData);
    recorder.removeEventListener('stop', finish);
    recorder.removeEventListener('error', onError);
    const blob = chunks.length ? new Blob(chunks, { type: recorder.mimeType || chunks[0].type || mimeType || 'audio/webm' }) : null;
    finalize(blob?.size ? blob : null);
  };
  const onData = (event: BlobEvent) => { if (event.data?.size) chunks.push(event.data); };
  const onError = (event: Event) => {
    capture.error = (event as Event & { error?: Error }).error?.message || '녹음 장치에 오류가 발생했습니다.';
    // Error is followed by final data and stop in conforming implementations.
  };
  const capture: AnswerCapture = {
    recorder, result, error: null,
    stop() {
      if (!settled && !stopping) {
        stopping = true;
        timer = setTimeout(() => { capture.error ||= '녹음 종료 응답을 기다리다 시간이 초과되었습니다.'; finish(); }, 5000);
        if (recorder.state !== 'inactive') {
          try { recorder.stop(); }
          catch (error) { capture.error = String(error); finish(); }
        }
      }
      return result;
    }
  };
  recorder.addEventListener('dataavailable', onData);
  recorder.addEventListener('stop', finish);
  recorder.addEventListener('error', onError);
  recorder.start(250);
  return capture;
}

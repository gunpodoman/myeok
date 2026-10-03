export type VoiceGender = 'auto' | 'female' | 'male';
export type VoiceStyle = 'adaptive' | 'balanced' | 'calm' | 'warm' | 'firm';
export interface VoiceProfile {
  voiceURI: string;
  gender: VoiceGender;
  style: VoiceStyle;
  rate: number;
  pitch: number;
}
export interface BrowserVoice {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
  default?: boolean;
}
export interface VoicePersona {
  voice_preference?: string;
  personality_traits?: string[];
  pressure_tendency?: number;
}

const styles: VoiceStyle[] = ['adaptive', 'balanced', 'calm', 'warm', 'firm'];
const clamp = (value: unknown, min: number, max: number) => {
  const number = Number(value);
  return Number.isFinite(number) && value !== null ? Math.min(max, Math.max(min, number)) : 1;
};
export function normalizeVoiceProfile(value: Partial<VoiceProfile> = {}): VoiceProfile {
  return {
    voiceURI: typeof value.voiceURI === 'string' ? value.voiceURI : '',
    gender: value.gender === 'female' || value.gender === 'male' ? value.gender : 'auto',
    style: styles.includes(value.style as VoiceStyle) ? value.style as VoiceStyle : 'adaptive',
    rate: clamp(value.rate ?? 1, 0.7, 1.3),
    pitch: clamp(value.pitch ?? 1, 0.7, 1.3)
  };
}

export function koreanVoices<T extends BrowserVoice>(voices: T[]): T[] {
  return voices.filter(voice => /^ko(?:[-_]|$)/i.test(voice.lang))
    .sort((a, b) => Number(b.localService) - Number(a.localService) || Number(b.default) - Number(a.default) || a.name.localeCompare(b.name));
}

// The Web Speech API has no gender field. Only identify documented provider names;
// never pretend an unknown voice or a pitch shift is a male/female voice.
export function knownVoiceGender(voice: BrowserVoice): Exclude<VoiceGender, 'auto'> | null {
  if (!/Microsoft/i.test(voice.name)) return null;
  if (/\b(Heami|SunHi|JiMin|SeoHyeon|SoonBok|YuJin|Haena)\b/i.test(voice.name.replace(/Neural.*$/i, ''))) return 'female';
  if (/\b(InJoon|Hyunsu|BongJin|GookMin|Junho)\b/i.test(voice.name.replace(/Neural.*$/i, '').replace(/Multilingual$/i, ''))) return 'male';
  return null;
}

export function resolveKoreanVoice<T extends BrowserVoice>(voices: T[], input: Partial<VoiceProfile>, persona: VoicePersona = {}) {
  const profile = normalizeVoiceProfile(input);
  const available = koreanVoices(voices);
  const explicit = available.find(voice => voice.voiceURI === profile.voiceURI);
  const gender = profile.gender === 'auto' ? persona.voice_preference : profile.gender;
  const matched = available.find(voice => knownVoiceGender(voice) === gender);
  const voice = explicit ?? matched ?? available[0] ?? null;
  let warning = '';
  if (profile.voiceURI && !explicit) warning = '선택한 목소리를 현재 브라우저에서 찾지 못해 사용 가능한 한국어 목소리로 읽습니다.';
  else if (!explicit && profile.gender !== 'auto' && !matched) warning = '선호 성별의 한국어 목소리가 없어 사용 가능한 목소리로 읽습니다. 높낮이로 성별을 대체하지 않습니다.';
  if (!voice) warning = '한국어 목소리가 없습니다. 질문을 화면으로 표시합니다. 기기의 한국어 음성을 확인해 주세요.';
  return { voice, warning };
}

export function voiceDelivery(input: Partial<VoiceProfile>, persona: VoicePersona = {}) {
  const profile = normalizeVoiceProfile(input);
  let style = profile.style;
  if (style === 'adaptive') {
    const traits = (persona.personality_traits ?? []).join(' ');
    style = (persona.pressure_tendency ?? 0) >= 0.65 || /SKEPTICAL|FAST_PACED/i.test(traits) ? 'firm'
      : /CURIOUS/i.test(traits) ? 'warm' : /ANALYTICAL/i.test(traits) ? 'balanced' : 'calm';
  }
  const modifiers = { balanced: [1, 1], calm: [0.92, 0.98], warm: [0.97, 1.06], firm: [1.04, 0.94] }[style];
  return { rate: Math.min(1.5, Math.max(0.6, profile.rate * modifiers[0])), pitch: Math.min(1.5, Math.max(0.6, profile.pitch * modifiers[1])), style };
}

export function splitSpeechText(text: string): string[] {
  // Short utterances avoid browser long-sentence stalls without changing wording.
  const segments: string[] = [];
  let remaining = text.trim();
  while (remaining.length > 110) {
    const head = remaining.slice(0, 110);
    const boundaries = Array.from(head.matchAll(/[.!?。？！]\s*|[,，]\s+|\s+/g));
    const cut = boundaries.filter(match => (match.index ?? 0) > 35).at(-1);
    const length = cut ? (cut.index ?? 0) + cut[0].length : 110;
    segments.push(remaining.slice(0, length));
    remaining = remaining.slice(length);
  }
  if (remaining) segments.push(remaining);
  return segments;
}

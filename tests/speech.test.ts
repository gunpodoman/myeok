import { describe, expect, it } from 'vitest';
import { koreanVoices, knownVoiceGender, normalizeVoiceProfile, resolveKoreanVoice, splitSpeechText, voiceDelivery, type BrowserVoice } from '../src/phase1/speech';

const voice = (name: string, lang = 'ko-KR', localService = true): BrowserVoice => ({ name, voiceURI: name, lang, localService });
const heami = voice('Microsoft Heami - Korean (Korea)');
const injoon = voice('Microsoft InJoon Online (Natural)', 'ko-KR', false);

describe('browser Korean voice configuration', () => {
  it('normalizes missing and legacy settings with sensible defaults', () => {
    expect(normalizeVoiceProfile()).toEqual({ voiceURI: '', gender: 'auto', style: 'adaptive', rate: 1, pitch: 1 });
    expect(normalizeVoiceProfile({ rate: NaN, pitch: Infinity })).toMatchObject({ rate: 1, pitch: 1 });
    expect(normalizeVoiceProfile({ rate: 5, pitch: 0 })).toMatchObject({ rate: 1.3, pitch: 0.7 });
  });
  it('lists only Korean voices and prioritizes local implementations', () => {
    expect(koreanVoices([injoon, voice('English', 'en-US'), heami])).toEqual([heami, injoon]);
    expect(koreanVoices([voice('underscore Korean', 'ko_KR'), voice('not Korean', 'kok-IN')])).toHaveLength(1);
  });
  it('does not infer gender from pitch or undocumented names', () => {
    expect(knownVoiceGender(heami)).toBe('female');
    expect(knownVoiceGender(injoon)).toBe('male');
    expect(knownVoiceGender(voice('Google 한국의'))).toBeNull();
    expect(knownVoiceGender(voice('Heami from an unknown provider'))).toBeNull();
  });
  it('uses explicit voice selection ahead of gender preference', () => {
    expect(resolveKoreanVoice([heami, injoon], { voiceURI: heami.voiceURI, gender: 'male' }).voice).toBe(heami);
  });
  it('applies gender preference when available without inventing a voice', () => {
    expect(resolveKoreanVoice([heami, injoon], { gender: 'male' }).voice).toBe(injoon);
    const missing = resolveKoreanVoice([heami], { gender: 'male' });
    expect(missing.voice).toBe(heami);
    expect(missing.warning).toContain('성별');
  });
  it('honors the question pack preference only for automatic gender', () => {
    expect(resolveKoreanVoice([heami, injoon], {}, { voice_preference: 'male' }).voice).toBe(injoon);
    expect(resolveKoreanVoice([heami, injoon], { gender: 'female' }, { voice_preference: 'male' }).voice).toBe(heami);
  });
  it('falls back honestly if a saved voice disappears or no Korean voice exists', () => {
    expect(resolveKoreanVoice([heami], { voiceURI: 'removed' }).warning).toContain('찾지 못해');
    const missing = resolveKoreanVoice([voice('Chinese', 'zh-CN')], {});
    expect(missing.voice).toBeNull();
    expect(missing.warning).toContain('화면');
  });
  it('adapts delivery to the real pack personality enum', () => {
    expect(voiceDelivery({}, { personality_traits: ['SKEPTICAL'] }).style).toBe('firm');
    expect(voiceDelivery({}, { personality_traits: ['PATIENT'] }).style).toBe('calm');
    expect(voiceDelivery({}, { personality_traits: ['CURIOUS'] }).style).toBe('warm');
    expect(voiceDelivery({ style: 'balanced', rate: 1.2, pitch: 0.9 }, { pressure_tendency: 0.9 })).toMatchObject({ rate: 1.2, pitch: 0.9, style: 'balanced' });
  });
  it('splits long questions without losing wording, numbers, or terminology', () => {
    const text = 'PCR과 CRISPR-Cas9의 차이를 설명하고, 2026년에 진행한 3.5배 농도 실험에서 본인이 직접 수행한 부분과 측정의 한계를 설명해 주세요. '.repeat(8).trim();
    const chunks = splitSpeechText(text);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join('')).toBe(text);
    expect(chunks.every(chunk => chunk.length <= 110)).toBe(true);
    expect(splitSpeechText('')).toEqual([]);
    expect(splitSpeechText('가'.repeat(300)).join('')).toBe('가'.repeat(300));
  });
});

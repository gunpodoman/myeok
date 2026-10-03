import { describe, expect, it } from 'vitest';
import { sha256Bytes, utf8Bytes } from '../src/phase1/hash';

describe('raw byte SHA-256', () => {
  it('matches the known SHA-256 fixture', async () => {
    expect(await sha256Bytes(utf8Bytes('abc'))).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
  });

  it('hashes original bytes rather than normalized JSON', async () => {
    const compact = utf8Bytes('{"a":1}');
    const spaced = utf8Bytes('{ "a": 1 }');
    expect(await sha256Bytes(compact)).not.toBe(await sha256Bytes(spaced));
  });
});

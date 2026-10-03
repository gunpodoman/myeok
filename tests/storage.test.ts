import Dexie from 'dexie';
import { afterEach, describe, expect, it } from 'vitest';
import {
  ACTIVE_PACK_SETTING_KEY,
  LEGACY_ACTIVE_PACK_KEY,
  LEGACY_CONFIG_KEY,
  LEGACY_PACK_KEY,
  Phase1StorageService,
  type StorageLike
} from '../src/phase1/storage';
import { utf8Bytes } from '../src/phase1/hash';
import { makeValidPack } from './fixtures/validPack';

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
  removeItem(key: string): void { this.values.delete(key); }
}

const databaseNames: string[] = [];

function uniqueDatabaseName(label: string): string {
  const name = `myeok-test-${label}-${crypto.randomUUID()}`;
  databaseNames.push(name);
  return name;
}

function packInput(pack = makeValidPack(), sourceName = 'pack.json') {
  const rawJson = JSON.stringify(pack, null, 2);
  return { bytes: utf8Bytes(rawJson), rawJson, parsed: pack, sourceName };
}

afterEach(async () => {
  for (const name of databaseNames.splice(0)) await Dexie.delete(name);
});

describe('Dexie Pack and Settings source of truth', () => {
  it('persists packs, handles duplicates, and keeps original bytes', async () => {
    const compatibility = new MemoryStorage();
    const service = new Phase1StorageService(uniqueDatabaseName('persist'), compatibility);
    await service.initialize();
    const first = await service.importPack(packInput());
    const duplicate = await service.importPack(packInput());
    const snapshot = await service.snapshot();

    expect(first.status).toBe('created');
    expect(duplicate.status).toBe('duplicate');
    expect(snapshot.packs).toHaveLength(1);
    expect(snapshot.packs[0].rawJson).toContain('\n');
    expect(snapshot.packs[0].rawBytes).toEqual(utf8Bytes(snapshot.packs[0].rawJson));
    expect(snapshot.activePackSha256).toBe(first.record.sha256);
    expect(compatibility.getItem(LEGACY_ACTIVE_PACK_KEY)).toBe(first.record.sha256);
    await service.close();
  });

  it('activates another pack and keeps the choice after reopen', async () => {
    const databaseName = uniqueDatabaseName('active');
    const compatibility = new MemoryStorage();
    const service = new Phase1StorageService(databaseName, compatibility);
    await service.initialize();
    const first = await service.importPack(packInput());
    const secondPack = makeValidPack({ pack_id: 'PACK_TEST002', target: { ...makeValidPack().target, university: '두번째대학교' } });
    const second = await service.importPack(packInput(secondPack, 'second.json'));
    await service.activatePack(first.record.sha256);
    await service.close();

    const reopened = new Phase1StorageService(databaseName, compatibility);
    const snapshot = await reopened.initialize();
    expect(snapshot.packs).toHaveLength(2);
    expect(snapshot.activePackSha256).toBe(first.record.sha256);
    expect(snapshot.activePackSha256).not.toBe(second.record.sha256);
    await reopened.close();
  });

  it('deletes the active pack and selects a consistent fallback', async () => {
    const service = new Phase1StorageService(uniqueDatabaseName('delete'), new MemoryStorage());
    await service.initialize();
    const first = await service.importPack(packInput());
    const secondPack = makeValidPack({ pack_id: 'PACK_TEST002', target: { ...makeValidPack().target, university: '두번째대학교' } });
    const second = await service.importPack(packInput(secondPack, 'second.json'));
    expect((await service.snapshot()).activePackSha256).toBe(second.record.sha256);
    const afterDelete = await service.deletePack(second.record.sha256);
    expect(afterDelete.packs).toHaveLength(1);
    expect(afterDelete.activePackSha256).toBe(first.record.sha256);
    await service.close();
  });

  it('persists interview settings in Dexie and mirrors legacy localStorage', async () => {
    const databaseName = uniqueDatabaseName('settings');
    const compatibility = new MemoryStorage();
    const service = new Phase1StorageService(databaseName, compatibility);
    await service.initialize();
    await service.saveInterviewConfig({ preset: 'HARD', minutes: 15 });
    await service.close();

    const reopened = new Phase1StorageService(databaseName, compatibility);
    const snapshot = await reopened.initialize();
    expect(snapshot.interviewConfig).toEqual({ preset: 'HARD', minutes: 15 });
    expect(JSON.parse(compatibility.getItem(LEGACY_CONFIG_KEY) ?? '{}')).toEqual({ preset: 'HARD', minutes: 15 });
    await reopened.close();
  });

  it('migrates a valid legacy localStorage pack without deleting it', async () => {
    const compatibility = new MemoryStorage();
    const rawJson = JSON.stringify(makeValidPack());
    compatibility.setItem(LEGACY_PACK_KEY, rawJson);
    compatibility.setItem(LEGACY_CONFIG_KEY, JSON.stringify({ preset: 'NORMAL' }));
    const service = new Phase1StorageService(uniqueDatabaseName('legacy-local'), compatibility);
    const snapshot = await service.initialize();
    expect(snapshot.packs).toHaveLength(1);
    expect(snapshot.packs[0].sourceKind).toBe('legacy-localStorage');
    expect(snapshot.activePackSha256).toBe(snapshot.packs[0].sha256);
    expect(compatibility.getItem(LEGACY_PACK_KEY)).toBe(rawJson);
    await service.close();
  });

  it('normalizes records from the existing raw IndexedDB schema', async () => {
    const databaseName = uniqueDatabaseName('raw-idb');
    const pack = makeValidPack();
    const rawJson = JSON.stringify(pack);
    const sha256 = 'a'.repeat(64);
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore('packs', { keyPath: 'sha256' });
        const sessions = db.createObjectStore('sessions', { keyPath: 'session_id' });
        sessions.createIndex('created_at', 'created_at');
        sessions.createIndex('pack_sha256', 'pack_sha256');
        db.createObjectStore('settings', { keyPath: 'key' });
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('packs', 'readwrite');
        tx.objectStore('packs').put({ sha256, pack, imported_at: '2026-09-20T00:00:00.000Z', source_name: 'legacy.json' });
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });

    const compatibility = new MemoryStorage();
    compatibility.setItem(LEGACY_ACTIVE_PACK_KEY, sha256);
    const service = new Phase1StorageService(databaseName, compatibility);
    const snapshot = await service.initialize();
    expect(snapshot.packs).toHaveLength(1);
    expect(snapshot.packs[0]).toMatchObject({ sha256, sourceName: 'legacy.json', validationStatus: 'VALID' });
    expect(snapshot.activePackSha256).toBe(sha256);
    expect((await service.db.settings.get(ACTIVE_PACK_SETTING_KEY))?.value).toBe(sha256);
    await service.close();
  });
});

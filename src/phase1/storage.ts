import Dexie, { type EntityTable } from 'dexie';
import type { InterviewPack } from './domain';
import { sha256Bytes, utf8Bytes } from './hash';
import { validateInterviewPack, type PackValidationResult } from './validator';

export const DATABASE_NAME = 'myeonyeokryeok_v1';
export const ACTIVE_PACK_SETTING_KEY = 'activePackSha256';
export const INTERVIEW_CONFIG_SETTING_KEY = 'interviewConfig';
export const LEGACY_PACK_KEY = 'myeonyeokryeok_pack';
export const LEGACY_ACTIVE_PACK_KEY = 'myeonyeokryeok_active_pack_sha256';
export const LEGACY_CONFIG_KEY = 'myeonyeokryeok_interview_config';

export type PackValidationStatus = 'VALID' | 'INVALID';
export type PackSourceKind = 'file' | 'demo' | 'legacy-localStorage' | 'legacy-indexedDB';

export interface StoredPackRecord {
  sha256: string;
  pack: InterviewPack;
  rawJson: string;
  rawBytes: Uint8Array;
  packId: string;
  displayName: string;
  importedAt: string;
  lastUsedAt: string | null;
  university: string | null;
  department: string | null;
  questionCount: number;
  interviewerCount: number;
  validationStatus: PackValidationStatus;
  validationIssues: PackValidationResult['issues'];
  sourceName: string;
  sourceKind: PackSourceKind;
}

export interface StoredSessionRecord {
  session_id: string;
  created_at?: string;
  pack_sha256?: string;
  [key: string]: unknown;
}

export interface SettingRecord {
  key: string;
  value: unknown;
  updatedAt: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ImportPackInput {
  bytes: Uint8Array;
  rawJson: string;
  parsed: unknown;
  sourceName: string;
  sourceKind?: Exclude<PackSourceKind, 'legacy-indexedDB'>;
  activate?: boolean;
}

export interface ImportPackResult {
  status: 'created' | 'duplicate';
  record: StoredPackRecord;
  validation: PackValidationResult;
}

export interface Phase1Snapshot {
  packs: StoredPackRecord[];
  activePackSha256: string | null;
  activePack: StoredPackRecord | null;
  interviewConfig: Record<string, unknown> | null;
}

export class PackImportValidationError extends Error {
  constructor(public readonly validation: PackValidationResult) {
    super('질문팩 검증에 실패했습니다.');
    this.name = 'PackImportValidationError';
  }
}

export class MyeokDatabase extends Dexie {
  packs!: EntityTable<StoredPackRecord, 'sha256'>;
  sessions!: EntityTable<StoredSessionRecord, 'session_id'>;
  settings!: EntityTable<SettingRecord, 'key'>;

  constructor(name = DATABASE_NAME) {
    super(name);
    this.version(1).stores({
      packs: '&sha256',
      sessions: '&session_id,created_at,pack_sha256',
      settings: '&key'
    });
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function recordText(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value ? value : fallback;
}

function nullableText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function toBytes(value: unknown, fallbackText: string): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  return utf8Bytes(fallbackText);
}

function displayName(pack: InterviewPack, sourceName: string): string {
  const target = [pack.target.university, pack.target.department].filter(Boolean).join(' ');
  return target || sourceName || pack.pack_id;
}

function createStoredPack(
  pack: InterviewPack,
  sha256: string,
  rawJson: string,
  rawBytes: Uint8Array,
  validation: PackValidationResult,
  sourceName: string,
  sourceKind: PackSourceKind,
  importedAt = nowIso(),
  lastUsedAt: string | null = null
): StoredPackRecord {
  return {
    sha256,
    pack,
    rawJson,
    rawBytes,
    packId: pack.pack_id,
    displayName: displayName(pack, sourceName),
    importedAt,
    lastUsedAt,
    university: pack.target.university,
    department: pack.target.department,
    questionCount: pack.question_bank.length,
    interviewerCount: pack.interviewer_pool.length,
    validationStatus: validation.ok ? 'VALID' : 'INVALID',
    validationIssues: validation.issues,
    sourceName,
    sourceKind
  };
}

function normalizeLegacyPack(value: unknown): StoredPackRecord | null {
  if (!isRecord(value) || !isRecord(value.pack) || typeof value.sha256 !== 'string') return null;
  const validation = validateInterviewPack(value.pack);
  const pack = value.pack as unknown as InterviewPack;
  const rawJson = recordText(value.rawJson, JSON.stringify(value.pack));
  const sourceName = recordText(value.sourceName, recordText(value.source_name, 'legacy-indexeddb.json'));
  const importedAt = recordText(value.importedAt, recordText(value.imported_at, nowIso()));
  const lastUsedAt = nullableText(value.lastUsedAt ?? value.last_used_at);
  return createStoredPack(
    pack,
    value.sha256,
    rawJson,
    toBytes(value.rawBytes, rawJson),
    validation,
    sourceName,
    recordText(value.sourceKind) as PackSourceKind || 'legacy-indexedDB',
    importedAt,
    lastUsedAt
  );
}

function parseConfig(value: string | null): Record<string, unknown> | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export class Phase1StorageService {
  readonly db: MyeokDatabase;

  constructor(
    databaseName = DATABASE_NAME,
    private readonly compatibilityStorage: StorageLike | null = typeof localStorage === 'undefined' ? null : localStorage
  ) {
    this.db = new MyeokDatabase(databaseName);
  }

  async initialize(): Promise<Phase1Snapshot> {
    await this.db.open();
    await this.normalizeIndexedDbPacks();
    await this.migrateLegacyLocalStorage();

    const packs = await this.listPacks();
    const activeSetting = await this.db.settings.get(ACTIVE_PACK_SETTING_KEY);
    const localActive = this.compatibilityStorage?.getItem(LEGACY_ACTIVE_PACK_KEY) ?? null;
    const validShas = new Set(packs.filter(pack => pack.validationStatus === 'VALID').map(pack => pack.sha256));
    let activePackSha256 = typeof activeSetting?.value === 'string' && validShas.has(activeSetting.value)
      ? activeSetting.value
      : localActive && validShas.has(localActive)
        ? localActive
        : packs.find(pack => pack.validationStatus === 'VALID')?.sha256 ?? null;

    if (activePackSha256) {
      await this.writeSetting(ACTIVE_PACK_SETTING_KEY, activePackSha256);
    } else {
      await this.db.settings.delete(ACTIVE_PACK_SETTING_KEY);
    }

    let interviewConfig = await this.getInterviewConfig();
    if (!interviewConfig) {
      interviewConfig = parseConfig(this.compatibilityStorage?.getItem(LEGACY_CONFIG_KEY) ?? null);
      if (interviewConfig) await this.writeSetting(INTERVIEW_CONFIG_SETTING_KEY, interviewConfig);
    }

    await this.mirrorCompatibility(activePackSha256, interviewConfig);
    return this.snapshot();
  }

  async importPack(input: ImportPackInput): Promise<ImportPackResult> {
    const validation = validateInterviewPack(input.parsed);
    if (!validation.ok || !validation.pack) throw new PackImportValidationError(validation);
    const sha256 = await sha256Bytes(input.bytes);
    const existing = await this.db.packs.get(sha256);
    const activatedAt = input.activate === false ? null : nowIso();
    const record = existing
      ? { ...existing, lastUsedAt: activatedAt ?? existing.lastUsedAt }
      : createStoredPack(
          validation.pack,
          sha256,
          input.rawJson,
          input.bytes,
          validation,
          input.sourceName,
          input.sourceKind ?? 'file',
          nowIso(),
          activatedAt
        );

    await this.db.transaction('rw', this.db.packs, this.db.settings, async () => {
      await this.db.packs.put(record);
      if (input.activate !== false) await this.writeSetting(ACTIVE_PACK_SETTING_KEY, sha256);
    });
    const config = await this.getInterviewConfig();
    const activeSha = input.activate === false ? await this.getActivePackSha256() : sha256;
    await this.mirrorCompatibility(activeSha, config);
    return { status: existing ? 'duplicate' : 'created', record, validation };
  }

  async listPacks(): Promise<StoredPackRecord[]> {
    const packs = await this.db.packs.toArray();
    return packs.sort((left, right) => {
      const leftDate = left.lastUsedAt ?? left.importedAt;
      const rightDate = right.lastUsedAt ?? right.importedAt;
      return rightDate.localeCompare(leftDate);
    });
  }

  async getPack(sha256: string): Promise<StoredPackRecord | null> {
    return await this.db.packs.get(sha256) ?? null;
  }

  async getActivePackSha256(): Promise<string | null> {
    const setting = await this.db.settings.get(ACTIVE_PACK_SETTING_KEY);
    return typeof setting?.value === 'string' ? setting.value : null;
  }

  async getActivePack(): Promise<StoredPackRecord | null> {
    const sha256 = await this.getActivePackSha256();
    return sha256 ? await this.getPack(sha256) : null;
  }

  async activatePack(sha256: string): Promise<StoredPackRecord> {
    const record = await this.db.packs.get(sha256);
    if (!record) throw new Error('활성화할 질문팩을 찾을 수 없습니다.');
    if (record.validationStatus !== 'VALID') throw new Error('검증에 실패한 질문팩은 활성화할 수 없습니다.');
    const updated = { ...record, lastUsedAt: nowIso() };
    await this.db.transaction('rw', this.db.packs, this.db.settings, async () => {
      await this.db.packs.put(updated);
      await this.writeSetting(ACTIVE_PACK_SETTING_KEY, sha256);
    });
    await this.mirrorCompatibility(sha256, await this.getInterviewConfig());
    return updated;
  }

  async deletePack(sha256: string): Promise<Phase1Snapshot> {
    await this.db.transaction('rw', this.db.packs, this.db.settings, async () => {
      const activeSha = await this.getActivePackSha256();
      await this.db.packs.delete(sha256);
      if (activeSha === sha256) {
        const remaining = (await this.db.packs.toArray())
          .filter(pack => pack.validationStatus === 'VALID')
          .sort((left, right) => (right.lastUsedAt ?? right.importedAt).localeCompare(left.lastUsedAt ?? left.importedAt));
        if (remaining[0]) await this.writeSetting(ACTIVE_PACK_SETTING_KEY, remaining[0].sha256);
        else await this.db.settings.delete(ACTIVE_PACK_SETTING_KEY);
      }
    });
    const snapshot = await this.snapshot();
    await this.mirrorCompatibility(snapshot.activePackSha256, snapshot.interviewConfig);
    return snapshot;
  }

  async getInterviewConfig(): Promise<Record<string, unknown> | null> {
    const setting = await this.db.settings.get(INTERVIEW_CONFIG_SETTING_KEY);
    return isRecord(setting?.value) ? setting.value : null;
  }

  async saveInterviewConfig(config: Record<string, unknown>): Promise<void> {
    await this.writeSetting(INTERVIEW_CONFIG_SETTING_KEY, config);
    await this.mirrorCompatibility(await this.getActivePackSha256(), config);
  }

  async putSession(session: StoredSessionRecord): Promise<StoredSessionRecord> {
    await this.db.sessions.put(session);
    return session;
  }

  async getSession(sessionId: string): Promise<StoredSessionRecord | null> {
    return await this.db.sessions.get(sessionId) ?? null;
  }

  async listSessions(): Promise<StoredSessionRecord[]> {
    const sessions = await this.db.sessions.toArray();
    return sessions.sort((left, right) => String(right.created_at ?? '').localeCompare(String(left.created_at ?? '')));
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.db.sessions.delete(sessionId);
  }

  async snapshot(): Promise<Phase1Snapshot> {
    const packs = await this.listPacks();
    const activePackSha256 = await this.getActivePackSha256();
    return {
      packs,
      activePackSha256,
      activePack: activePackSha256 ? packs.find(pack => pack.sha256 === activePackSha256) ?? null : null,
      interviewConfig: await this.getInterviewConfig()
    };
  }

  async close(): Promise<void> {
    this.db.close();
  }

  private async writeSetting(key: string, value: unknown): Promise<void> {
    await this.db.settings.put({ key, value, updatedAt: nowIso() });
  }

  private async normalizeIndexedDbPacks(): Promise<void> {
    const current = await this.db.table('packs').toArray() as unknown[];
    const normalized = current.map(normalizeLegacyPack).filter((record): record is StoredPackRecord => record !== null);
    if (normalized.length) await this.db.packs.bulkPut(normalized);
  }

  private async migrateLegacyLocalStorage(): Promise<void> {
    const rawJson = this.compatibilityStorage?.getItem(LEGACY_PACK_KEY);
    if (!rawJson) return;
    const mirroredActiveSha = this.compatibilityStorage?.getItem(LEGACY_ACTIVE_PACK_KEY);
    if (mirroredActiveSha && await this.db.packs.get(mirroredActiveSha)) return;
    try {
      const parsed: unknown = JSON.parse(rawJson);
      const bytes = utf8Bytes(rawJson);
      const sha256 = await sha256Bytes(bytes);
      if (await this.db.packs.get(sha256)) return;
      const validation = validateInterviewPack(parsed);
      if (!validation.pack) return;
      const record = createStoredPack(
        validation.pack,
        sha256,
        rawJson,
        bytes,
        validation,
        'legacy-localStorage',
        'legacy-localStorage'
      );
      await this.db.packs.put(record);
    } catch {
      // 손상된 legacy JSON은 지우거나 덮어쓰지 않는다.
    }
  }

  private async mirrorCompatibility(
    activePackSha256: string | null,
    interviewConfig: Record<string, unknown> | null
  ): Promise<void> {
    if (!this.compatibilityStorage) return;
    if (activePackSha256) {
      const activePack = await this.db.packs.get(activePackSha256);
      if (activePack) {
        this.compatibilityStorage.setItem(LEGACY_ACTIVE_PACK_KEY, activePackSha256);
        this.compatibilityStorage.setItem(LEGACY_PACK_KEY, JSON.stringify(activePack.pack));
      }
    } else {
      this.compatibilityStorage.removeItem(LEGACY_ACTIVE_PACK_KEY);
      this.compatibilityStorage.removeItem(LEGACY_PACK_KEY);
    }
    if (interviewConfig) this.compatibilityStorage.setItem(LEGACY_CONFIG_KEY, JSON.stringify(interviewConfig));
    else this.compatibilityStorage.removeItem(LEGACY_CONFIG_KEY);
  }
}

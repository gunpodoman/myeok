export * from './domain';
export * from './hash';
export * from './schema';
export * from './storage';
export * from './validator';
export * from './speech';
export * from './recording';

import { Phase1StorageService } from './storage';

export function createPhase1StorageService(): Phase1StorageService {
  return new Phase1StorageService();
}

import { vi } from 'vitest';

export const createClient = vi.fn(() => ({
  execute: vi.fn(),
}));

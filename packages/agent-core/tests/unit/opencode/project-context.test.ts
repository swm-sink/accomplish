/** @vitest-environment node */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { resolveProjectContext } from '../../../src/opencode/project-context.js';

describe('resolveProjectContext', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = path.join(
      os.tmpdir(),
      `proj-ctx-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (testDir && fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('reads .accomplish.md from the working directory', () => {
    const content = '# Finance Context\nChart of accounts: 1000-Assets';
    fs.writeFileSync(path.join(testDir, '.accomplish.md'), content);

    const result = resolveProjectContext(testDir);
    expect(result).toBe(content);
  });

  it('returns undefined when no .accomplish.md exists', () => {
    const result = resolveProjectContext(testDir);
    expect(result).toBeUndefined();
  });

  it('walks up parent directories and concatenates (parent first, child last)', () => {
    const childDir = path.join(testDir, 'a', 'b', 'c');
    fs.mkdirSync(childDir, { recursive: true });
    fs.writeFileSync(path.join(testDir, '.accomplish.md'), 'parent context');
    fs.writeFileSync(path.join(childDir, '.accomplish.md'), 'child context');

    const result = resolveProjectContext(childDir);
    expect(result).toBeDefined();
    // Parent appears before child
    const parentIdx = result!.indexOf('parent context');
    const childIdx = result!.indexOf('child context');
    expect(parentIdx).toBeGreaterThanOrEqual(0);
    expect(childIdx).toBeGreaterThan(parentIdx);
  });

  it('caps total content at 10000 characters', () => {
    const longContent = 'x'.repeat(15000);
    fs.writeFileSync(path.join(testDir, '.accomplish.md'), longContent);

    const result = resolveProjectContext(testDir);
    expect(result).toHaveLength(10000);
  });

  it('does not walk more than 3 parent levels', () => {
    // Place .accomplish.md 4 levels above the working dir
    const deepDir = path.join(testDir, 'a', 'b', 'c', 'd');
    fs.mkdirSync(deepDir, { recursive: true });
    // testDir/.accomplish.md is 4 levels above deepDir (testDir/a/b/c/d)
    fs.writeFileSync(path.join(testDir, '.accomplish.md'), 'too far up');

    const result = resolveProjectContext(deepDir);
    // Should NOT find it since it's 4 levels up and max depth is 3
    expect(result).toBeUndefined();
  });

  it('handles unreadable directory gracefully', () => {
    // Non-existent directory should not throw
    const result = resolveProjectContext(path.join(testDir, 'nonexistent'));
    expect(result).toBeUndefined();
  });
});

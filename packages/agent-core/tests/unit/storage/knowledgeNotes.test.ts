/** @vitest-environment node */

import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('Knowledge Notes repository', () => {
  let testDir: string;
  let metaDbPath: string;
  let metaDbModule: typeof import('../../../src/storage/workspace-meta-db.js') | null = null;
  let knModule: typeof import('../../../src/storage/repositories/knowledgeNotes.js') | null = null;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  const TEST_WORKSPACE_ID = 'ws_test_001';

  beforeAll(async () => {
    metaDbModule = await import('../../../src/storage/workspace-meta-db.js');
    knModule = await import('../../../src/storage/repositories/knowledgeNotes.js');
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  beforeEach(() => {
    if (!metaDbModule || !knModule) {
      return;
    }
    testDir = path.join(
      os.tmpdir(),
      `kn-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    fs.mkdirSync(testDir, { recursive: true });
    metaDbPath = path.join(testDir, 'workspace-meta-test.db');
    const db = metaDbModule.initializeMetaDatabase(metaDbPath);

    // Create a test workspace for foreign key constraint
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO workspaces (id, name, sort_order, is_default, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(TEST_WORKSPACE_ID, 'Test Workspace', 0, 1, now, now);
  });

  afterEach(() => {
    if (metaDbModule) {
      metaDbModule.closeMetaDatabase();
    }
    if (testDir && fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should create and list knowledge notes', () => {
    if (!knModule) {
      return;
    }

    knModule.createKnowledgeNote({
      workspaceId: TEST_WORKSPACE_ID,
      type: 'context',
      content: 'Chart of accounts: 1000-Assets, 2000-Liabilities',
    });
    knModule.createKnowledgeNote({
      workspaceId: TEST_WORKSPACE_ID,
      type: 'instruction',
      content: 'Always use GAAP formatting',
    });

    const notes = knModule.listKnowledgeNotes(TEST_WORKSPACE_ID);
    expect(notes).toHaveLength(2);
    expect(notes[0].type).toBe('context');
    expect(notes[1].type).toBe('instruction');
  });

  it('should allow up to 50 notes per workspace', () => {
    if (!knModule) {
      return;
    }

    for (let i = 0; i < 50; i++) {
      knModule.createKnowledgeNote({
        workspaceId: TEST_WORKSPACE_ID,
        type: 'context',
        content: `Note ${i}`,
      });
    }

    const notes = knModule.listKnowledgeNotes(TEST_WORKSPACE_ID);
    expect(notes).toHaveLength(50);

    // 51st should throw
    expect(() => {
      knModule!.createKnowledgeNote({
        workspaceId: TEST_WORKSPACE_ID,
        type: 'context',
        content: 'One too many',
      });
    }).toThrow('Maximum of 50 notes per workspace');
  });

  it('should truncate content at 2000 characters on create', () => {
    if (!knModule) {
      return;
    }

    const longContent = 'x'.repeat(3000);
    const note = knModule.createKnowledgeNote({
      workspaceId: TEST_WORKSPACE_ID,
      type: 'context',
      content: longContent,
    });

    expect(note.content).toHaveLength(2000);
  });

  it('should truncate content at 2000 characters on update', () => {
    if (!knModule) {
      return;
    }

    const note = knModule.createKnowledgeNote({
      workspaceId: TEST_WORKSPACE_ID,
      type: 'context',
      content: 'Short content',
    });

    const updated = knModule.updateKnowledgeNote(note.id, TEST_WORKSPACE_ID, {
      content: 'y'.repeat(3000),
    });

    expect(updated).not.toBeNull();
    expect(updated!.content).toHaveLength(2000);
  });

  it('should format notes for prompt grouped by type', () => {
    if (!knModule) {
      return;
    }

    knModule.createKnowledgeNote({
      workspaceId: TEST_WORKSPACE_ID,
      type: 'context',
      content: 'Life360 fiscal year ends Dec 31',
    });
    knModule.createKnowledgeNote({
      workspaceId: TEST_WORKSPACE_ID,
      type: 'instruction',
      content: 'Use USD currency format',
    });
    knModule.createKnowledgeNote({
      workspaceId: TEST_WORKSPACE_ID,
      type: 'reference',
      content: 'GL codes: 4000-Revenue, 5000-COGS',
    });

    const prompt = knModule.getKnowledgeNotesForPrompt(TEST_WORKSPACE_ID);
    expect(prompt).toContain('### Context');
    expect(prompt).toContain('- Life360 fiscal year ends Dec 31');
    expect(prompt).toContain('### Instruction');
    expect(prompt).toContain('- Use USD currency format');
    expect(prompt).toContain('### Reference');
    expect(prompt).toContain('- GL codes: 4000-Revenue, 5000-COGS');
  });

  it('should return empty string for workspace with no notes', () => {
    if (!knModule) {
      return;
    }

    const prompt = knModule.getKnowledgeNotesForPrompt(TEST_WORKSPACE_ID);
    expect(prompt).toBe('');
  });

  it('should return empty array for unknown workspace', () => {
    if (!knModule) {
      return;
    }

    const notes = knModule.listKnowledgeNotes('ws_nonexistent');
    expect(notes).toEqual([]);
  });

  it('should delete a note and return true', () => {
    if (!knModule) {
      return;
    }

    const note = knModule.createKnowledgeNote({
      workspaceId: TEST_WORKSPACE_ID,
      type: 'context',
      content: 'Delete me',
    });
    expect(knModule.deleteKnowledgeNote(note.id, TEST_WORKSPACE_ID)).toBe(true);
    expect(knModule.deleteKnowledgeNote(note.id, TEST_WORKSPACE_ID)).toBe(false);
  });
});

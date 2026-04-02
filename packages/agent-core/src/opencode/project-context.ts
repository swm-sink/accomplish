/**
 * Loads .accomplish.md project context files from the working directory
 * and parent directories, similar to how Claude Code loads CLAUDE.md.
 *
 * Finance teams can version-control workspace context alongside their data
 * by placing .accomplish.md files in project directories.
 */

import fs from 'fs';
import path from 'path';

const PROJECT_CONTEXT_FILENAME = '.accomplish.md';
const MAX_CONTEXT_LENGTH = 10000;
const MAX_PARENT_DEPTH = 3;

/**
 * Reads .accomplish.md files from the working directory and up to 3 parent
 * directories. Files are concatenated parent-first so child context can
 * override or extend parent context.
 *
 * Returns undefined if no .accomplish.md files are found.
 */
export function resolveProjectContext(workingDirectory: string): string | undefined {
  const contextFiles: string[] = [];
  let dir: string;
  try {
    dir = path.resolve(workingDirectory);
  } catch {
    return undefined;
  }

  for (let depth = 0; depth <= MAX_PARENT_DEPTH; depth++) {
    const filePath = path.join(dir, PROJECT_CONTEXT_FILENAME);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.trim()) {
          contextFiles.unshift(content);
        }
      }
    } catch {
      // Skip unreadable files silently
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  if (contextFiles.length === 0) {
    return undefined;
  }

  return contextFiles.join('\n\n---\n\n').slice(0, MAX_CONTEXT_LENGTH);
}

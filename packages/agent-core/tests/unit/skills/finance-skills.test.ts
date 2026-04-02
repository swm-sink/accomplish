/** @vitest-environment node */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const BUNDLED_SKILLS_PATH = path.resolve(__dirname, '../../../../../apps/desktop/bundled-skills');

interface SkillFrontmatter {
  name: string;
  description: string;
  command: string;
  verified: boolean;
}

function parseSkillFrontmatter(filePath: string): SkillFrontmatter {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`No frontmatter found in ${filePath}`);
  }
  const yaml = match[1];
  const fm: Record<string, string | boolean> = {};
  for (const line of yaml.split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length > 0) {
      const value = rest.join(':').trim();
      if (value === 'true') {
        fm[key.trim()] = true;
      } else if (value === 'false') {
        fm[key.trim()] = false;
      } else {
        fm[key.trim()] = value;
      }
    }
  }
  return fm as unknown as SkillFrontmatter;
}

function getLineCount(filePath: string): number {
  return fs.readFileSync(filePath, 'utf-8').split('\n').length;
}

describe('Finance bundled skills', () => {
  const skills = [
    {
      dir: 'expense-report',
      name: 'expense-report',
      command: '/expense-report',
      contentKeywords: ['categoriz', 'GL'],
    },
    {
      dir: 'financial-report',
      name: 'financial-report',
      command: '/financial-report',
      contentKeywords: ['MRR', 'ARR', 'Churn'],
    },
    {
      dir: 'contract-review',
      name: 'contract-review',
      command: '/contract-review',
      contentKeywords: ['termination', 'renewal', 'SLA'],
    },
  ];

  for (const skill of skills) {
    describe(skill.dir, () => {
      const skillPath = path.join(BUNDLED_SKILLS_PATH, skill.dir, 'SKILL.md');

      it('SKILL.md file exists', () => {
        expect(fs.existsSync(skillPath)).toBe(true);
      });

      it('has valid frontmatter with correct name and command', () => {
        const fm = parseSkillFrontmatter(skillPath);
        expect(fm.name).toBe(skill.name);
        expect(fm.command).toBe(skill.command);
        expect(fm.verified).toBe(true);
        expect(fm.description).toBeDefined();
        expect(fm.description.length).toBeGreaterThan(10);
      });

      it('is under 200 lines', () => {
        const lineCount = getLineCount(skillPath);
        expect(lineCount).toBeLessThanOrEqual(200);
      });

      it(`contains domain-specific content: ${skill.contentKeywords.join(', ')}`, () => {
        const content = fs.readFileSync(skillPath, 'utf-8');
        for (const keyword of skill.contentKeywords) {
          expect(content).toContain(keyword);
        }
      });
    });
  }
});

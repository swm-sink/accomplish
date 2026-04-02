import { describe, it, expect } from 'vitest';
import { USE_CASE_KEYS } from '@/pages/home/homeConstants';
import homeLocale from '../../../../../locales/en/home.json';

const VALID_ICON_DOMAINS = [
  'sheets.google.com',
  'slides.google.com',
  'docs.google.com',
  'google.com',
  'finance.yahoo.com',
  'calendar.google.com',
  'mail.google.com',
  'notion.so',
  'linkedin.com',
  'eventbrite.com',
];

describe('homeConstants USE_CASE_KEYS', () => {
  it('has exactly 9 entries for a 3x3 grid', () => {
    expect(USE_CASE_KEYS).toHaveLength(9);
  });

  it('includes finance-relevant use case keys', () => {
    const keys = USE_CASE_KEYS.map((uc) => uc.key);
    expect(keys).toContain('saasMetricsDashboard');
    expect(keys).toContain('budgetVsActuals');
    expect(keys).toContain('expenseReportProcess');
    expect(keys).toContain('boardDeckPrep');
    expect(keys).toContain('vendorContractReview');
    expect(keys).toContain('financialModelUpdate');
  });

  it('uses only valid icon domains', () => {
    for (const useCase of USE_CASE_KEYS) {
      for (const icon of useCase.icons) {
        expect(VALID_ICON_DOMAINS).toContain(icon);
      }
    }
  });

  it('each key has a matching entry in en/home.json useCases', () => {
    const useCases = homeLocale.useCases as Record<
      string,
      { title: string; description: string; prompt: string }
    >;
    for (const useCase of USE_CASE_KEYS) {
      expect(useCases[useCase.key]).toBeDefined();
      expect(useCases[useCase.key].title).toBeDefined();
      expect(useCases[useCase.key].description).toBeDefined();
      expect(useCases[useCase.key].prompt).toBeDefined();
    }
  });
});

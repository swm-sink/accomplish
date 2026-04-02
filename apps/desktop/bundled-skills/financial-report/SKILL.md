---
name: financial-report
description: Generate financial reports including SaaS metrics dashboards, budget vs actuals, P&L summaries, and board deck slides. Works with Google Sheets data and outputs to Sheets, Docs, or Slides.
command: /financial-report
verified: true
---

# Financial Report Generator

## Overview

Create professional financial reports from Google Sheets data. Supports multiple report types with proper formatting, formulas, and executive summaries.

---

## Agent Workflow

1. **Identify report type** — Ask which report the user needs (see types below)
2. **Locate source data** — Find or request the Google Sheet with raw financial data
3. **Build structure** — Create the report layout with formulas and references
4. **Apply formatting** — Currency, percentages, conditional colors, charts
5. **Generate summary** — Add narrative summary for Docs/Slides output if requested

---

## Report Types

### 1. SaaS Metrics Dashboard

Build a dashboard sheet with these key metrics:

| Metric                          | Formula                                                           | Format   |
| ------------------------------- | ----------------------------------------------------------------- | -------- |
| MRR (Monthly Recurring Revenue) | Sum of monthly subscriptions                                      | `$#,##0` |
| ARR (Annual Recurring Revenue)  | MRR × 12                                                          | `$#,##0` |
| Net New MRR                     | New + Expansion − Contraction − Churn                             | `$#,##0` |
| Gross Churn Rate                | Churned MRR ÷ Beginning MRR                                       | `0.0%`   |
| Net Revenue Retention           | (Beginning MRR + Expansion − Contraction − Churn) ÷ Beginning MRR | `0.0%`   |
| LTV (Lifetime Value)            | ARPU ÷ Monthly Churn Rate                                         | `$#,##0` |
| CAC (Customer Acquisition Cost) | Total S&M Spend ÷ New Customers                                   | `$#,##0` |
| LTV/CAC Ratio                   | LTV ÷ CAC                                                         | `0.0x`   |
| Months to Recover CAC           | CAC ÷ ARPU                                                        | `0.0`    |
| Quick Ratio                     | (New MRR + Expansion MRR) ÷ (Contraction MRR + Churn MRR)         | `0.0x`   |

**Layout:** Metrics in rows, months in columns. Add sparklines or conditional formatting for trends.

### 2. Budget vs Actuals

| Column       | Description                | Format                     |
| ------------ | -------------------------- | -------------------------- |
| Line Item    | Expense/revenue category   | Text                       |
| Budget       | Planned amount             | `$#,##0`                   |
| Actual       | Real amount                | `$#,##0`                   |
| Variance ($) | Actual − Budget            | `$#,##0` (red if negative) |
| Variance (%) | (Actual − Budget) ÷ Budget | `0.0%` (red if > 10%)      |

**Formatting:** Negative variances in red. Add subtotals by department or category.

### 3. P&L Summary

Standard income statement structure:

```
Revenue
  - Product Revenue
  - Services Revenue
  = Total Revenue

Cost of Goods Sold (COGS)
  = Gross Profit
  = Gross Margin %

Operating Expenses
  - Sales & Marketing
  - Research & Development
  - General & Administrative
  = Total OpEx

EBITDA
EBITDA Margin %

Other Income/Expense
Net Income
```

### 4. Board Deck Summary (Google Slides)

Create a concise slide with:

- Key metrics table (MRR, ARR, growth rate, runway)
- Quarter-over-quarter comparison
- 2-3 highlights and 1-2 risks
- Cash position and burn rate

---

## Formatting Conventions

- **Currency**: `$#,##0` (no decimals for large numbers), `$#,##0.00` for per-unit
- **Percentages**: `0.0%`
- **Negative values**: Red text or parentheses
- **Headers**: Bold, frozen first row and column
- **Conditional formatting**: Green for positive trends, red for negative
- **Number alignment**: Right-aligned, consistent decimal places

---

## Tips

- Always verify formulas reference the correct source data range
- Use named ranges in Google Sheets for clarity
- Add data validation notes explaining methodology
- For board decks, less is more — focus on 5-7 key metrics
- Cross-reference totals between sheets to catch formula errors

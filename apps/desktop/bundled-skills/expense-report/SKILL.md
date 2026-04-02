---
name: expense-report
description: Process expense reports from CSV files, receipt images, or bank statements. Categorize expenses by GL code, validate against policy, and generate a formatted summary in Google Sheets or Google Docs.
command: /expense-report
verified: true
---

# Expense Report Processing

## Overview

Automate expense categorization, policy validation, and report generation from raw financial data (CSVs, receipts, bank statements).

---

## Agent Workflow

1. **Gather inputs** — Ask the user for source data (CSV, uploaded files, or browser-accessible bank portal)
2. **Extract line items** — Parse each transaction: date, vendor, amount, description
3. **Categorize by GL code** — Map each expense to the appropriate category using the table below
4. **Validate against policy** — Flag items that exceed thresholds or lack documentation
5. **Output report** — Generate a formatted Google Sheets report or Google Docs summary

---

## Expense Category Mapping

| Category                 | GL Code | Examples                              |
| ------------------------ | ------- | ------------------------------------- |
| Travel & Transportation  | 6100    | Flights, trains, rideshare, mileage   |
| Lodging                  | 6200    | Hotels, Airbnb                        |
| Meals & Entertainment    | 6300    | Team dinners, client meals, catering  |
| Software & Subscriptions | 6400    | SaaS tools, cloud services, licenses  |
| Office Supplies          | 6500    | Equipment, stationery, peripherals    |
| Professional Services    | 6600    | Legal, accounting, consulting fees    |
| Marketing & Advertising  | 6700    | Ad spend, events, sponsorships        |
| Telecommunications       | 6800    | Phone, internet, conferencing tools   |
| Training & Education     | 6900    | Courses, conferences, certifications  |
| Miscellaneous            | 7000    | Anything not fitting above categories |

When the user has custom GL codes or categories in their workspace knowledge notes, use those instead.

---

## Policy Validation Rules

Flag expenses that match any of these conditions:

- **Meals over $75/person** — Requires manager justification
- **Single transactions over $500** — Requires receipt attachment
- **Missing vendor name** — Must be resolved before submission
- **Weekend expenses** — Flag for review unless travel-related
- **Duplicate amounts** — Same vendor + same amount within 7 days

Adjust thresholds based on workspace knowledge notes if the user has documented custom policies.

---

## Google Sheets Output Format

Create a sheet with these columns:

| Date | Vendor | Description | Amount | Category | GL Code | Policy Flag | Notes |
| ---- | ------ | ----------- | ------ | -------- | ------- | ----------- | ----- |

**Formatting:**

- Currency: `$#,##0.00`
- Header row: bold, frozen
- Policy flags: highlight row in light red
- Add a summary section below the data:
  - Total by category
  - Grand total
  - Count of flagged items

---

## Google Docs Summary Format

If the user prefers a document output:

1. **Header**: Expense Report — [Employee Name] — [Date Range]
2. **Summary table**: Category totals
3. **Flagged items**: List with explanation
4. **Grand total** and approval signature line

---

## Tips

- When processing bank statements, filter out non-expense transactions (transfers, deposits)
- Group related small purchases (e.g., multiple Uber rides) into a single line with count
- If unsure about a category, use the description to make a best guess and add a note
- Always verify the final total matches the sum of individual line items

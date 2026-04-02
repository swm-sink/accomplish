---
name: contract-review
description: Review vendor contracts, SaaS agreements, and service agreements. Extract key terms (pricing, renewal dates, termination clauses, SLAs) and generate a structured summary document.
command: /contract-review
verified: true
---

# Contract Review

## Overview

Extract and summarize key terms from vendor and SaaS contracts. Identify risks, flag important dates, and produce a structured summary in Google Docs.

---

## Agent Workflow

1. **Open contract** — Access the document (PDF in browser, Google Doc, or uploaded file)
2. **Extract key terms** — Identify each item from the checklist below
3. **Flag risks** — Apply the risk criteria to highlight concerns
4. **Output summary** — Generate a structured Google Docs summary with findings

---

## Key Terms Extraction Checklist

Extract each of these from the contract:

### Parties & Dates

- Vendor / counterparty name
- Effective date
- Term length (months/years)
- Expiration date

### Pricing & Payment

- Base cost (monthly/annual)
- Per-unit or per-seat pricing
- Rate escalation clauses (annual increases)
- Payment terms (Net 30, Net 60, Net 90)
- Late payment penalties

### Renewal & Termination

- Auto-renewal: yes/no
- Renewal notice period (days before expiration)
- Termination for convenience: allowed? Notice period?
- Termination for cause: conditions
- Early termination fees or penalties

### Service Levels (SLA)

- Uptime commitment (e.g., 99.9%)
- Response time guarantees
- Remedies for SLA breach (credits, refunds)
- Maintenance windows / planned downtime

### Data & Security

- Data ownership and portability
- Data handling / processing terms
- Security certifications (SOC 2, ISO 27001)
- Breach notification requirements
- Data retention and deletion on termination

### Legal & Liability

- Liability cap (dollar amount or multiple of fees)
- Indemnification scope
- Insurance requirements
- Governing law / jurisdiction
- Dispute resolution (arbitration vs. litigation)

---

## Risk Flags

Flag any of these conditions as risks requiring attention:

| Risk               | Condition                                     | Severity |
| ------------------ | --------------------------------------------- | -------- |
| Auto-renewal trap  | Auto-renews with < 60 days notice window      | High     |
| Uncapped liability | No liability cap specified                    | High     |
| No SLA             | No uptime or service level commitment         | Medium   |
| Price escalation   | Annual increase > 5% or uncapped              | Medium   |
| Lock-in            | Term > 2 years with no early termination      | Medium   |
| Data retention     | No data deletion clause on termination        | Medium   |
| Weak breach notice | Breach notification > 72 hours or unspecified | Low      |
| No SOC 2 / ISO     | Missing security certifications               | Low      |

---

## Output Format (Google Docs)

Structure the summary document as follows:

### 1. Executive Summary (2-3 sentences)

- What the contract is for, total value, and key concern

### 2. Key Terms Table

| Term           | Value                     |
| -------------- | ------------------------- |
| Vendor         | [name]                    |
| Effective Date | [date]                    |
| Term           | [duration]                |
| Annual Cost    | [amount]                  |
| Auto-Renewal   | [yes/no, notice period]   |
| Termination    | [convenience/cause, fees] |
| SLA            | [uptime %, remedies]      |
| Liability Cap  | [amount or multiple]      |
| Payment Terms  | [Net X]                   |

### 3. Risk Flags

- Bulleted list of flagged items with severity and recommendation

### 4. Recommended Actions

- Specific negotiation points or items to clarify before signing

---

## Tips

- If a term is not found in the contract, note it as "Not specified" — this itself may be a risk
- Compare pricing against market rates if the user provides benchmarks in workspace notes
- For multi-year contracts, calculate total cost of ownership including escalations
- Note any amendment or modification clauses that affect flexibility

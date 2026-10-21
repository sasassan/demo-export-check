# Export Risk Navi — Commercial readiness gate

This branch adds a standalone, conservative compliance-triage core and regression tests. It is NOT integrated into the production diagnosis endpoint until existing flows, authorization and data contracts have been reviewed.

## Release gates (must be verified, not assumed)
- [ ] Inventory every diagnosis route, API call and data store; identify mock/fallback outputs.
- [ ] Ensure server-side authentication and tenant isolation on every read/write; add cross-tenant negative tests.
- [ ] Keep API keys exclusively server-side; redact personal data and trade secrets from logs.
- [ ] Implement rate limits, abuse protection, input size limits and audit retention policies.
- [ ] Obtain authoritative sanctions/denied-party feeds with licenses, update cadence, jurisdiction and provenance.
- [ ] Evaluate false negatives, false positives, transliterations, aliases, UBO and indirect end users on a labeled dataset.
- [ ] Show evidence links, timestamps, uncertainty and human-review requirements in the report.
- [ ] Validate security/export-control handling of uploaded drawings and technical specifications before any external AI transmission.
- [ ] Confirm payment webhooks are signature-verified and idempotent; do not trust client subscription claims.
- [ ] Run lint, typecheck, unit, E2E and deployment smoke tests before merging.
- [ ] Establish backup restore test, incident response, deletion/export requests and monitoring.

## Decision semantics
A = no detected findings in the supplied input and required checks completed; NOT an export permission.
B = review finding, missing check or unsupported evidence.
C = critical finding; escalation required.
No grade substitutes for a qualified human export-control decision.

## Integration notes for Verdent
Inspect the current implementation and wire `triageAssessment` only after mapping existing diagnosis data to the validated schema. Do not silently replace existing scoring. Present unsupported/missing checks prominently. Never present synthetic evidence as an official screening hit. Keep this branch separate from main until the full test suite passes.

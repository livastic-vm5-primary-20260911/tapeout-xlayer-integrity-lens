# X Layer TapeOut Accelerate — submission packet (not yet submitted)

Official event: https://web3.okx.pro/xlayer/build-x-series
Deadline: **2026-12-07 23:59 UTC** (confirm official updates before filing). Required form: https://docs.google.com/forms/d/e/1FAIpQLScyVnDmyzxRyBxszLUWbwV5kVbpmZJ3JS6oyOxqjALRvhR1kg/viewform

## Product identity

- **Team:** VM5 Delivery Lab (one human owner, AI-assisted implementation).
- **Project:** TapeOut Integrity Lens — a public read-only operations and contract transparency dashboard for developers and prospective participants in the TapeOut ecosystem.
- **GitHub:** https://github.com/livastic-vm5-primary-20260911/tapeout-xlayer-integrity-lens
- **Live demo:** https://livastic-vm5-primary-20260911.github.io/tapeout-xlayer-integrity-lens/
- **NEW latest-feature hackathon demo video (53.6 s, under 3-minute limit, real live chain + review priorities + actual JSON export + business model):** https://livastic-vm5-primary-20260911.github.io/tapeout-xlayer-integrity-lens/demo/tapeout-real-triage-and-business-20261024.mp4
- **Source license:** MIT.
- **X Layer mainnet chain ID:** 196.
- **TapeOut factory:** 0x1f09daefa827f02cbb40967cc91b259763760761
- **Circuit market:** 0xd89f358c48a7B632c9845af2a02A32eB90DD75DB
- **Genesis CPU (factory index 0):** 0x839bdd6fa7a66416a609a735e11de5411b98574e
- **Proof snapshot (pinned block 73915245):** evidence/tapeout-cpu0-block73915245.json
- **Event-period development (23–24 October):** Created a new public X Layer read-only explorer and source repository, pinned-block TapeOut CPU discovery, EIP-1967 slot transparency, fee math, free JSON/CSV evidence, strict 20-field two-block comparator, deterministic four-bucket review priorities, offline review CLI and machine-readable lossless change exports. The 24 October new-feature 53.6-second real mainnet demo also demonstrates the business model. Current full reproducible regression suite: **74/74 PASS**.

## Elevator pitch

TapeOut Integrity Lens reduces the information and trust gap for builders using TapeOut on X Layer. At a single public URL, a developer can inspect the live TapeOut factory and circuit marketplace, registry processor count, current fees, permission/upgrade signals and the chosen processor's token supply, then export a pinned-block audit snapshot. The application never requests a wallet connection or permission; it only uses public chain RPC methods. The product is an independent transparency tool, **not** a formal audit, financial advisor, escrow validator or sponsor endorsement.

## Why customers might pay (business hypothesis, not actual customers or revenue)

- **Audience:** X Layer TapeOut builders, protocol integrators, DeFi security engineering leads and B2B vendor diligence teams.
- **Pain:** Public contract state is scattered across block explorers, proxy storage, function selectors and per-CPU contracts; teams need reproducible change evidence before deployments and audits.
- **Free product:** Live single-block explorer, responsive CPU inspector, per-use CSV/JSON snapshots and a new one-click public-example or local-file 20-field before/after diff for the same CPU, readable fee math.
- **Actually shipped monetization route, not yet independently purchased by a new customer:** A wallet-free live 20-field explorer stays free; a separate machine-readable x402 v2 JSON report `GET https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-report` is offered at **0.005 native Circle Base USDC** to an original owner-controlled wallet and a different **0.01 native Base USDC** two-block diff endpoint is deployed but its marketplace listing remains pending review. Buyers with compatible x402 clients explicitly authorize payments; the public explorer does not sign for anyone. A bounded third-party human-readable evidence pilot is *indicatively* **$49 USD-equivalent**, negotiated only under a new written customer scope, not an existing contract, order or settled payment. **Future possibility only:** optional $19–49/month monitored change alerts if real customers ask; these are *not* shipped or paid subscriptions.
- **Acquisition:** transparent developer documentation, GitHub examples and one-to-one outreach to verifiable TapeOut developer teams with relevant use cases; no spam, fabricated users, or free-to-paid dark patterns.
- **Why repeat:** fee/implementation/sealing status can change as new CPUs launch; versioned block-pinned comparisons have recurrent operational value.

## 24 October 2026 event-period feature delivery — review-first triage (verified)

This is genuine incremental functional code authored in the published project's own repository during the event, **not** a form submission or sponsor acceptance:

- **One-click review-order panel:** after a valid same-CPU 20-field before/after, transparently ranks actual changed fields as processor-identity, owner/proxy/sealing, fees/supply limits or ordinary activity. It does not call itself a security scanner, assess exploitability, verify historical imported files or assert that an unchanged field is safe.
- **Machine-actionable JSON for agents/engineering teams:** exports `TapeOutXLayerRiskLens/change-review-v1`, `eip155:196`, selected CPU, two pinned blocks, 20-field coverage, grouped review counts, individual field/value deltas as lossless signed strings and explicit provenance limitations.
- **Offline buyer reproducibility:** `node scripts/review-evidence.mjs evidence/tapeout-cpu0-block73915245.json evidence/tapeout-cpu0-block73947001.json` reproduces the pre-existing real two-block source observations without wallet or network. New evidence: `evidence/tapeout-review-block73915245-to-73947001.json`, **1 owner/proxy configuration review + 1 CPU registration counter**, **0 exploits claimed**.
- **Fail closed before showing conclusions:** full historical comparator already rejects wrong chain, wrong CPU/contract, partial RPC reads, bad schema and block order; the newly added module also checks the precise 20 comparator paths, no duplicate fields, uint256/Boolean/address types, consistent change counts and identity flags. No user-specific files are transmitted or used to build automatic investment advice.
- **Regression reproducibility:** `npm test` executed under Node 22 against new and existing source, with the then-current 71/71 checks PASS for the event-period review module; **subsequent original project version with new live video and buyer links passed all 74/74 tests on 24 October 2026, and GitHub Pages deployed the exact recorded media with public HTTP200 and matching SHA256.** Browser wiring, CLI evidence, malicious input refusal and exact pinned-chain 2-field observations covered.
- **Development value:** a zero-wallet, manual reviewer workflow that turns raw blockchain changes into prioritized engineering follow-up with deterministic traceable machine-readable output. It could inform scoped paid evidence reports, but **not** a paid order, automated subscription, continuous alert service, contract security certification or prize by itself.

**The 24 October NEW 53.6-second demo now ACTUALLY demonstrates the shipped review panel and real JSON export** (see [exact capture provenance](demo/RECORDING_PROVENANCE_20261024.md)): X Layer mainnet chain196 pinned block 74,032,901, historical baseline73,915,245, control/proxy review1, activity/counter1, 0 exploit claims. The prior 29-second film predates this extra UI and does not depict it. The submission form's legal full name, nationality, owner-controlled Telegram and legal-majority details remain unknown; no official hackathon submission or prize without real human owner confirmation.

## Responsible participation blockers

The official Google Form currently requires 10 answers. Six are personal/team/contact fields: full legal name, nationality, team name, Telegram handle, team contact email, team size; others are team background, pitch, GitHub and demo video. Real full name, verified nationality, Telegram handle and age-of-majority eligibility were **not supplied** in the available authoritative records. Do not invent, use aliases as legal truth, or attest to adult status. Leave the final entry **not submitted** until the owner supplies truthful required personal information and confirms legal eligibility. No crypto fee, gas, wallet transaction, KYC spoofing or alternate account to bypass this gate.

### Actual live functionality and evidence (23 October 2026)

We ran the same public X Layer RPC interface against CPU0 at block **73,947,001** with **22 read-only eth_call/storage/network requests**, zero errors and `partial=false`. Compared with the preexisting CPU0 pinned evidence for block **73,915,245**, 20 whitelist fields produced two differences: factory registered CPUs **387→388** and factory EIP-1967 implementation **0x74956236ab64ed143933040b4137e8a352e4d17b → 0xb41c1e7602eb5734be2430b72178ccb814a5293d**. The latter also appears in an intervening, previously captured public demo snapshot; this comparison does *not* establish that the upgrade happened during today's observation window, let alone an exploit. It only captures value drift over the two pinned blocks. Source evidence: [later CPU0 snapshot](evidence/tapeout-cpu0-block73947001.json) and [client-side two-block comparison](evidence/tapeout-compare-73915245-to-73947001.json). The imported reference is not separately cryptographically verified; independent mainnet consensus and authorization analysis would be needed for any formal audit. Node tests after the 24 October review-order update: **71/71 PASS** (real pinned-history sample, offline CLI, tampered-input negative tests and versioned browser-app loader).

### Actual official Google Form: ten answers (not submitted)

The original existing VM5 Google account opened the exact official Google Form on 2026-10-23 KST (read-only). These fields are accurate and can be used by the real human applicant once eligibility is proven. Never submit under an invented natural person's identity or Telegram profile.

| Required field | Verified draft answer |
| --- | --- |
| Full Name | **OWNER HUMAN REQUIRED**: genuine verified individual legal full name; no project alias |
| Nationality | **OWNER HUMAN REQUIRED**: correct nationality and eligibility, not guessed from current location |
| Team name | VM5 Delivery Lab (independent project name; not a registered firm) |
| Telegram handle | **OWNER HUMAN REQUIRED**: real Telegram account handle with owner control |
| Team contact email | onecursor1@gmail.com (the existing original confirmed project email; verify it remains authorized) |
| How many people | 1 real human owner; AI agents are software tools, NOT human team members |
| Tell us about your team/background | An independent remote software creator, supported transparently by AI tools. We ship reproducible JavaScript/API tests, offline evidence tooling and publicly verifiable web applications. Our TapeOut app uses public X Layer contract reads and already has a production read-only demo. We do not claim a registered professional audit firm, previous commercial TapeOut customers, formal security certifications or pre-existing prize winnings. |
| Elevator pitch | **TapeOut Integrity Lens makes on-chain processor settings auditable for builders before they ship.** X Layer participants currently have to piece together TapeOut factory settings, CPU fee structures, token supply, market fee, governance flags and EIP-1967 upgrade information from many contracts. Our deployed wallet-free dashboard reads actual TapeOut CPU factory and marketplace contracts on X Layer mainnet (196), pins values to a block, and lets a builder safely compare an earlier bundled CPU0 reference or locally saved snapshot against 20 refreshed chain fields. Developers export JSON/CSV evidence with no API key, gas, key sharing or wallet connection. Our separate Base x402 v2 paid 0.005-USDC machine report is live as a pay-per-call offering to original owner wallet, but new endpoint customer revenue has not yet been independently verified. We aim to convert genuine ecosystem due-diligence demand into finite $49 scoped evidence comparisons first; recurring alerts are a possible future service, not an existing paid capability. This is an independent data transparency tool, not a contract audit, oracle, financial advice or sponsor-backed guarantee. |
| GitHub repo | https://github.com/livastic-vm5-primary-20260911/tapeout-xlayer-integrity-lens |
| Demo video (maximum 3 min) | https://livastic-vm5-primary-20260911.github.io/tapeout-xlayer-integrity-lens/demo/tapeout-real-triage-and-business-20261024.mp4 (53.6 s actual, onchain X Layer block 74032901, newest 4-category review-order panel and verified JSON download, then real public free/x402/manual-price funnel; no recorded revenue asserted) |

**Submission and prize gates:** Official event deadline Dec 7 23:59 UTC (recheck original rules). The top prize is nominal 20,000 USDT and the nominal prize pool is 100,000 USDT, not current receivable or guarantee. Winners may need a genuine human legal/age/region identity, offline Demo Day and milestones for staggered payout, safe supported USDT network/custody and tax compliance. The original MetaMask's Base Circle USDC address cannot be assumed to receive an arbitrary USDT prize network. No legal acceptance on behalf of an unidentified human. Presently contest registration 0, confirmed prize 0, buyer orders 0.

No judges contacted, no award, paid lead, or contract is proven by software publication alone.

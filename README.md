# TapeOut Integrity Lens — X Layer contract risk and fee explorer

**Live, read-only, no wallet, zero gas.** Public prototype initiated 2026-10-23 KST during the [X Layer TapeOut Accelerate](https://web3.okx.pro/xlayer/build-x-series) build window.

It reads live data pinned to one block on X Layer **mainnet chain 196**. No backend, API key, wallet connect, sign-in, paid API, transaction signing, smart contract deployment, bridge, deposit or trading required.

**[Open live demo](https://livastic-vm5-primary-20260911.github.io/tapeout-xlayer-integrity-lens/)** · **[Watch actual 19-second read-only demo](https://livastic-vm5-primary-20260911.github.io/tapeout-xlayer-integrity-lens/demo/tapeout-lens-demo.mp4)** · [Screenshot](demo/poster.png) · [Example JSON](demo/sample-live-export.json)

## Features

- TapeOut CPU factory: on-chain CPU count, current deployment/protocol fees, owner, `isSealed` and EIP-1967 proxy implementation.
- TapeOut circuit market: current fee in basis points, listing counter, owner, sealing status and implementation slot.
- CPU inspector: choose an index from the **factory's live registry**. Resolve its circuit contract and transistor token; inspect mint supply, creator, unit mint fee, protocol fee, tapeout fee and last circuit ID at the same block.
- Deterministic math-based fee quote (not gas). Exports pinned-block JSON and CSV evidence.
- **New 23 Oct 2026:** strict local before/after evidence comparison: import a previously exported JSON file from the same CPU, compare 20 real contract fields against a newer live block, flag fee/owner/implementation/minted-supply changes, and download a versioned comparison JSON. Nothing is uploaded; invalid or partial snapshots fail closed. An imported file is *not* cryptographically authenticated and should never be mistaken for an independently verified event.
- Diagnostics about upgradeability and administrative controls. Missing reads are explicitly unknown, never assumed safe.
- RPC: [official X Layer endpoints](https://web3.okx.pro/onchainos/dev-docs/xlayer/developer/rpc-endpoints/rpc-endpoints), 100 requests/sec per IP; this uses at most a few dozen calls per requested refresh. It **does not** bypass rate limiting. No `eth_sendRawTransaction`, `personal_sign`, `eth_sign`, `eth_requestAccounts` or wallet connection.

Reference X Layer TapeOut contracts and interfaces independently described and test-fork verified by [NetLayerLabs/Cerebr TAPEOUT.md](https://github.com/NetLayerLabs/Cerebr/blob/main/TAPEOUT.md). The explorer reads the present mainnet state, not hard-coded values from that report.

### Compare two historical readings safely

1. Open the public browser app and select CPU index 0. Click **Refresh live chain state**.
2. Under **05 / HISTORY**, click **Try published CPU0 example** to load the explicitly packaged earlier block 73,915,245 (same-origin public GET only, no user-file upload); alternatively choose an older local `.json` file from this explorer and click **Compare with current block**. The bundled example is a pinned RPC sample, not an independent cryptographic chain proof.
3. The published example compares immediately. For your own local file, click **Compare with current block**. Changed CPU creation/protocol fees, market fees, sealing and proxy implementation, processor/token supply and other fields are displayed with before/after values. Different networks, CPU indices, historical order, invalid types and partial/error snapshots are rejected.
4. [Inspect a real two-block comparison example](evidence/tapeout-compare-73915245-to-73947001.json) from the first-party public X Layer RPC reads at blocks 73,915,245 and 73,947,001. It shows factory CPU count **387 → 388** and proxy implementation **0x749562… → 0xb41c1e…**. This demonstrates a detectable value difference, **not a verified safety incident or unanticipated attack**.
5. Export the comparison as JSON for your own independent review. The file contains `baselineBlock` / `liveBlock`, 20 explicitly allowlisted fields and any changes. It does not prove the imported reference is authentic. **Never act on a diff alone to send assets or sign a transaction.**

This local comparison offers genuine developer utility: it makes configuration drift at two exact X Layer blocks inspectable without paid surveillance or a wallet. It does not claim continuous monitoring, automatic notifications, attack detection, verified contract safety or existing customer revenue.

### Development

Static website: `index.html`, `styles.css`, `src/core.mjs`, `src/rpc.mjs`, `src/app.mjs`.

```sh
node --test tests/*.test.mjs
python3 -m http.server 8765
# browse http://localhost:8765
```

No JS runtime dependency or build step. `ethers` was used only in development to confirm standard Ethereum Keccak-256 function selectors; production browser code includes no package imports.

### Current business model and revenue limitations

Potential paying users: TapeOut processor creators, ecosystem marketplaces, corporate security reviewers, Web3 automation builders. **Available today:** the public browser explorer is entirely free, and a *separate* optional x402 v2 JSON API is deployed for buyer-authorized payments of **0.005 native Circle Base USDC per GET** directly to the original owner VM1 receiving wallet. [Free API sample](https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-sample) requires no payment; [paid machine endpoint](https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-report) returns HTTP 402 before compatible buyer-side authorization. A separate [indicative USD-equivalent $49 custom evidence pilot](./commercial.html) requires an explicit written paid scope and acceptance terms; there is **no live custom human-report checkout**. Recurring alerts and subscriptions are not implemented. **No independent paying customer, signed service order, prize award or realized revenue for the new TapeOut paid endpoint has been verified; a deployed HTTP 402 is not a completed purchase.**

### Caveats

- This is NOT a smart contract security audit, oracle, market price guarantee, escrow proof or financial advice.
- Price may change after the pinned snapshot due to owner-controlled settings.
- RPC values are best-effort public provider reads, not independent full-node consensus verification.
- A factory-level `isSealed` or implementation slot is not an exhaustive characterization of all contract authority.
- Never send money to a wallet on the basis of a dashboard. No seed/private keys belong here.

MIT License. Attribution required only for the underlying MIT license notice. This repo does not affiliate with OKX or TapeOut.

### Optional machine-to-machine API (separate x402 service)

A **new** directly owner-receivable 0.005 Base mainnet Circle USDC read-only TapeOut genesis CPU report is exposed through the original VM5 x402 API infrastructure. Free terms: https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-sample ; paid GET: https://vm5-openapi-x402.onrender.com/v1/tapeout-cpu0-report . Chain 196 public readings are pinned before an x402 payment requirement. The dedicated route's destination is the **original owner's VM1 MetaMask**, unlike historical VM5 merchant products. Source: https://github.com/livastic-vm5-primary-20260911/x402-openapi-lint/tree/main/tapeout . **This is a no-spend seller launch, not verified sales or a promise of available buyer funds.** The free browser app remains genuinely free.

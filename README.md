# TapeOut Integrity Lens — X Layer contract risk and fee explorer

**Live, read-only, no wallet, zero gas.** Public prototype initiated 2026-10-23 KST during the [X Layer TapeOut Accelerate](https://web3.okx.pro/xlayer/build-x-series) build window.

It reads live data pinned to one block on X Layer **mainnet chain 196**. No backend, API key, wallet connect, sign-in, paid API, transaction signing, smart contract deployment, bridge, deposit or trading required.

**[Open live demo](https://livastic-vm5-primary-20260911.github.io/tapeout-xlayer-integrity-lens/)** · **[Watch actual 19-second read-only demo](https://livastic-vm5-primary-20260911.github.io/tapeout-xlayer-integrity-lens/demo/tapeout-lens-demo.mp4)** · [Screenshot](demo/poster.png) · [Example JSON](demo/sample-live-export.json)

## Features

- TapeOut CPU factory: on-chain CPU count, current deployment/protocol fees, owner, `isSealed` and EIP-1967 proxy implementation.
- TapeOut circuit market: current fee in basis points, listing counter, owner, sealing status and implementation slot.
- CPU inspector: choose an index from the **factory's live registry**. Resolve its circuit contract and transistor token; inspect mint supply, creator, unit mint fee, protocol fee, tapeout fee and last circuit ID at the same block.
- Deterministic math-based fee quote (not gas). Exports verifiable JSON and CSV evidence with block number.
- Diagnostics about upgradeability and administrative controls. Missing reads are explicitly unknown, never assumed safe.
- RPC: [official X Layer endpoints](https://web3.okx.pro/onchainos/dev-docs/xlayer/developer/rpc-endpoints/rpc-endpoints), 100 requests/sec per IP; this uses at most a few dozen calls per requested refresh. It **does not** bypass rate limiting. No `eth_sendRawTransaction`, `personal_sign`, `eth_sign`, `eth_requestAccounts` or wallet connection.

Reference X Layer TapeOut contracts and interfaces independently described and test-fork verified by [NetLayerLabs/Cerebr TAPEOUT.md](https://github.com/NetLayerLabs/Cerebr/blob/main/TAPEOUT.md). The explorer reads the present mainnet state, not hard-coded values from that report.

### Development

Static website: `index.html`, `styles.css`, `src/core.mjs`, `src/rpc.mjs`, `src/app.mjs`.

```sh
node --test tests/*.test.mjs
python3 -m http.server 8765
# browse http://localhost:8765
```

No JS runtime dependency or build step. `ethers` was used only in development to confirm standard Ethereum Keccak-256 function selectors; production browser code includes no package imports.

### Current business model and revenue limitations

Potential paying users: TapeOut processor creators, ecosystem marketplaces, corporate security reviewers, Web3 automation builders. Possible commercial offerings: independent recurring audit snapshots, programmable change alerts, and evidence bundles for procurement / governance review. **None are implemented as a paid checkout in this free prototype. No customer, sale, prize award, subscription or future income is implied.** Any paid scope, payer, payout network, owner wallet and fee must be individually agreed before taking an order.

### Caveats

- This is NOT a smart contract security audit, oracle, market price guarantee, escrow proof or financial advice.
- Price may change after the pinned snapshot due to owner-controlled settings.
- RPC values are best-effort public provider reads, not independent full-node consensus verification.
- A factory-level `isSealed` or implementation slot is not an exhaustive characterization of all contract authority.
- Never send money to a wallet on the basis of a dashboard. No seed/private keys belong here.

MIT License. Attribution required only for the underlying MIT license notice. This repo does not affiliate with OKX or TapeOut.

# Real X Layer before/after demo capture — 23 Oct 2026 (KST)

The [29.08-second MP4](tapeout-history-real-demo-20261023.mp4) and the [actual-browser screenshot](tapeout-history-real-diff-20261023.png) were produced in an isolated, non-user Chrome instance (Playwright Chromium using installed Google Chrome) on original VM5. It navigated to the publicly deployed GitHub Pages site, waited for a real `eth_chainId` + pinned-block X Layer read to show `LIVE VERIFIED BLOCK`, scrolled through actual factory/CPU data, and clicked **Try published CPU0 example**. The actual public provider reads at recording time reached block **73,948,226** (network eip155:196, CPU0, 22 first-party read-only RPC requests) and the comparison result reported **2 changes out of 20** against the previously recorded block 73,915,245:

- CPU factory count 387 → 388.
- Factory proxy implementation `0x74956236ab64ed143933040b4137e8a352e4d17b` → `0xb41c1e7602eb5734be2430b72178ccb814a5293d`.

The recording is a browser display of *public provider results* at the relevant blocks, not a full-node consensus verification, exploit proof, commercial contract, security audit, signed transaction or generated customer payment. Static evidence files and tests are separately provided. No wallet account, transaction, seed, personal browser or user private keys were accessed or recorded. No simulated chain values were overlaid.

Local capture source and original WebM, provenance JSON and nonpublic PNG frames live only under `make_money2/research/tapeout-video-20261023/`. The MP4 was converted offline using ffmpeg/libx264 (no audio) and verified via ffprobe to be 1440×900, 25 fps, 29.08 seconds, H.264. Public artifact SHA256: `5b43763a4237923cf336640f33bccd45b38fcf80a672ffe7a1be650e24c35609`.

The 29.08-second film is below the official contest's 3-minute demo limit. A prior 19.4-second free-browsing demo `demo/tapeout-lens-demo.mp4` is retained independently to avoid hiding its provenance.

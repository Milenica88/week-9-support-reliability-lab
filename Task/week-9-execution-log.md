# Week 9 execution handoff

## Revisions and setup

- Start: `9f15ef98873d14e557b907998dda6c39d1a42da7`. Initial `git status --short`: only `?? Task/` (the four supplied source documents). Final source/test commit: `40e64d16535c2a181ec55c23f2066fe918330217` (`Require active policy sources`); no push. The commit contains only `src/app.ts` and `tests/source-eligibility.test.mjs`.
- Node: `v24.21.0`. Locked TypeScript `5.9.2` was already installed (`npm ls --depth=0`), so no install was needed. `npm run typecheck`: exit 0 before and after.
- Initial plain `npm test`: exit 1 before test execution because this sandbox denied the Node test runner's child-process spawn (`EPERM`; 0 tests ran). With `NODE_OPTIONS=--test-isolation=none`, the unchanged `npm test` command passed 3/3 before and 4/4 after (exit 0). This setting only avoids runner subprocess isolation; package scripts and tests were not edited.
- Initial `npm start -- shipping`, `refund`, `legacy`, and `unknown`: each exited 0. Shipping returned `ok`, 3 days, `shipping-current`; refund returned `ok`, 30 days, `refund-old`; legacy returned `ok`, its archived policy text, `legacy-old`; unknown returned `refused` with no citation. CLI exit 0 did not establish acceptance.

## Generated runs and commands

| Run | Actual directory | Command result and saved output |
| --- | --- | --- |
| Baseline evaluation | `C:\Users\Nikola\Desktop\zajNed9\week-9-support-reliability-lab\runs\evaluate-38cac5b7-6280-435e-8679-faa34b9a372f` | `npm run evaluate`: exit 1, 2/4; `baseline-evaluate.txt` |
| Baseline regression | `C:\Users\Nikola\Desktop\zajNed9\week-9-support-reliability-lab\runs\regression-299731fd-9c50-4579-ada5-f9c424952858` | `npm run regression`: exit 1, 5/7; `baseline-regression.txt` |
| Final evaluation | `C:\Users\Nikola\Desktop\zajNed9\week-9-support-reliability-lab\runs\evaluate-392ac8e4-bd0c-42af-b74f-a4e02bcef195` | `npm run evaluate`: exit 0, 4/4; `final-evaluate.txt` |
| Final regression | `C:\Users\Nikola\Desktop\zajNed9\week-9-support-reliability-lab\runs\regression-7e90bdbb-88e6-4679-93cb-8149c38285b3` | `npm run regression`: exit 0, 7/7; `final-regression.txt` |

Each run has `report.json`, `summary.md`, and all its case trace files; none were missing. The baseline exit 1 values are failed deterministic criteria with complete reports, not build failures. The reports contain `git.revision: null` and `git.dirty: null` in this sandbox; the Git revisions above came from direct `git rev-parse HEAD`. Report source/build/test hashes changed, while data/config/script hashes matched in each before/after pair. The generated `runs/` directories are Git ignored and must be carried with the workspace evidence.

## Observation, test, and comparison

- Baseline `refund` report: `ok`, `Policy: Refund period: 30 days.`, citation `refund-old`, 1 model call; status check passed, text and citation checks failed. Its trace selects `refund-old` revision 1, which `data/lab.json` marks `archived`; `refund-current` revision 2 is `active` and says 14 days. Baseline `legacy`: `ok`, `legacy-old`, 1 model call, failed status and model-call checks; its sole source is archived. The trace records source ID/revision but not state, so source state was checked in the data file. Refund's `weakCheck` was true and its 0.95 `recordedJudge` value is an authored synthetic fixture, not a live model judgment.
- Added `tests/source-eligibility.test.mjs` with archived `warranty-old` before active `warranty-current`, independent expected citation/text, and a model-source call record. `npm run build` on the unmodified app: exit 0. `node --test tests/source-eligibility.test.mjs` with the isolation setting: exit 1, 1 test executed, failing the `warranty-old` versus `warranty-current` citation assertion; full output: `test-before.txt`. After the one-predicate active-source change, the same command exited 0, 1/1; output: `test-after.txt`.
- Final `refund`: `ok`, `Policy: Refund period: 14 days.`, citation `refund-current`, 1 model call; trace selects revision 2. Final `legacy`: `refused`, empty citations, 0 model calls, and only a refusal response event. `shipping` and `unsupported` stayed PASS in both suites; `active-account`, `suspended-account`, and `invalid` stayed PASS in regression. No case regressed.
- Separate `npm run compare -- <baseline report.json> <final report.json>` calls for evaluation and regression both exited 0; exact outputs are `compare-evaluate.txt` and `compare-regression.txt`. They report `refund` and `legacy` FAIL → PASS, all other cases PASS → PASS, and 2/4 → 4/4 and 5/7 → 7/7 respectively.

## Limits and remaining checks

All requested final commands and trace/report checks executed. The only failed setup command was the initial isolated `npm test` run; the isolation workaround then passed. The scoped fix leaves the separate unknown-account defect unchanged, and the public regression cases cover only known accounts. This experiment uses structured policy requests, a deterministic model substitute, and a small synthetic corpus; it does not measure live-model behavior, arbitrary future sources, real traffic, or production availability. The final evidence note, personal reports, and release decision are for the next chat.

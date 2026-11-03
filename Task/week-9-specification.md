# Week 9 implementation specification

Working instructions for the next Codex chat. This is **not** the pair's final evidence note. The contract comes from `Task/weekly-assignment.md`; `Task/nedelja-09-prethodno-citanje.pdf` explains acceptance criteria, traces, controlled comparisons, regression checks, and the limits of a release decision. The final note must use `Task/evidence-template.md` and actual generated evidence.

## Service, contract, and observed defect

The project is a Node 24+ CLI, not a web service. `npm start -- <topic>` builds and calls the `policy` route. `scripts/run.mjs` also drives public evaluation and regression cases, including `account` requests. `answer` in `src/app.ts` accepts structured input and injected dependencies: local documents, a read-only account lookup, and a controlled model function. For a selected policy source, that function returns `Policy: ${source.text}`. There is no live LLM or free-form question understanding in this experiment.

Three claims have different meanings:

1. **Successful execution:** the build or CLI can complete and print JSON, even when the returned answer violates policy. `npm start` does not grade business correctness; `refused` can also be a successful process exit.
2. **Basic tests pass:** the three existing tests in `tests/app.test.mjs` cover invalid requests, a topic with no documents, and a known suspended account. They do not cover an archived document preceding an active document or an archived-only topic.
3. **Acceptance criteria pass:** the relevant source is active and matches the requested topic, its ID is cited, and no eligible source means `refused` with no model call. This needs the public cases, the new independent test, and trace inspection. Passing a small suite does not prove every future request or a production release is safe.

**Code/data observations, before any measurement:** the policy branch uses `dependencies.documents.find(document => document.topic === request.topic)`. It checks the topic but not `state`. `data/lab.json` orders `refund-old` (archived, revision 1, 30 days) before `refund-current` (active, revision 2, 14 days); `legacy` has only `legacy-old` (archived). `shipping-current` is active, and `unknown` has no source. The code passes the chosen source to `model`, then cites `source.id`. Therefore the current code path predicts the old refund text and citation, and an answer for legacy. The assignment describes those as starter behavior; this specification has **not** measured a local baseline run. Record the actual baseline report and trace before calling them observed execution results.

**Cause hypothesis:** selection by the first matching topic, without an eligibility predicate, causes both policy failures. Confirm it with the baseline `refund` result and `traces/refund.json`, matching its `sourceId` and revision to `data/lab.json`. The trace records selection and model/response events, but has no `state` field and cannot by itself establish why the source was selected. The controlled model renders the selected source, so a prompt or model hallucination is not supported as the cause here.

## Policy rule and acceptance matrix

For every valid `policy` request, choose an **active** document whose `topic` equals the requested topic, and cite that document's ID. Archived documents are ineligible regardless of list order. If there is no eligible document, return `status: "refused"`, an empty citation list, and do not call `model`. Preserve the existing refusal message unless there is a demonstrated reason to change it. The public data has one eligible source per topic; behavior for multiple active revisions is not specified here and should not be invented as part of this fix.

| Case | Source situation | Required status, text, citation | Model calls | Suite / expected transition |
| --- | --- | --- | --- | --- |
| `refund` | Archived `refund-old` precedes active `refund-current` | `ok`; `Policy: Refund period: 14 days.`; `refund-current` | One expected from route; public case checks status/text/citation | Evaluation + regression; expected FAIL → PASS |
| `shipping` | Active `shipping-current` | `ok`; `Policy: Shipping takes 3 days.`; `shipping-current` | One expected from route | Evaluation + regression; expected PASS → PASS |
| `legacy` | Only archived `legacy-old` | `refused`; no citation; no policy answer | **0**, asserted by public case | Evaluation + regression; expected FAIL → PASS |
| `unsupported` | No document for `unknown` | `refused`; no citation; no policy answer | **0**, asserted by public case | Evaluation + regression; expected PASS → PASS |
| `active-account` | Lookup `A-100` = active | `ok`; `Status naloga: active.` | **0**, asserted by public case | Regression only; expected PASS → PASS |
| `suspended-account` | Lookup `A-200` = suspended | `ok`; `Status naloga: suspended.` | **0**, asserted by public case | Regression only; expected PASS → PASS |
| `invalid` | `null` request | `invalid`; existing invalid response | **0**, asserted by public case | Regression only; expected PASS → PASS |

The assignment's **2/4 and 5/7 starting**, and **4/4 and 7/7 target**, are expectations, **not measured results** for this copy. Report actual scores and per-case checks from the four run directories. `scripts/evidence.mjs` checks only fields present in each case's `expected`; for example it does not assert refund's model call count or the exact refusal text. The synthetic test and trace review complement those checks. A nonempty answer passes `weakCheck` even when its source is archived. The refund `recordedJudge` scores (0.95 for old, 0.92 for current) are authored synthetic fixtures, explicitly marked `authored-synthetic-example-not-a-real-model-run`; they are not live model judgments or acceptance criteria.

## Permitted implementation and new test

Make the smallest application change in the policy-source selection in `src/app.ts`: require both topic equality and `state === "active"` before the existing no-source branch and model call. Keep the rest of the policy response flow and the account route intact. No refund-specific branch, hard-coded 14-day text, reordering of public data, hand-editing `dist/`, or changes to existing tests, `data/lab.json`, package/configuration, `scripts/`, or public criteria. Do not build a UI, database, network service, paid-model integration, or general evaluator.

The separate account defect is **out of scope**: for an unknown account, `lookup` returns `undefined`, but `src/app.ts` currently substitutes `"active"` and returns `ok`. The public regression set checks two known accounts, not an unknown one. Preserve the account branch during this H1 policy fix; account risk still matters when assessing the whole service.

Add `tests/source-eligibility.test.mjs` using `node:test`, `node:assert/strict`, and the real `answer` from `../dist/app.js`. Keep two synthetic documents inside the test, on a topic other than refund, for example `warranty`:

```js
const documents = [
  { id: "warranty-old", revision: "1", topic: "warranty", state: "archived", text: "Warranty lasts 30 days." },
  { id: "warranty-current", revision: "2", topic: "warranty", state: "active", text: "Warranty lasts 90 days." }
];
const modelSources = [];
const result = answer({ kind: "policy", topic: "warranty" }, {
  documents,
  lookup: () => { throw new Error("Unexpected account lookup"); },
  model: source => { modelSources.push(source.id); return `Policy: ${source.text}`; }
});
assert.equal(result.status, "ok");
assert.deepEqual(result.citations, ["warranty-current"]);
assert.equal(result.text, "Policy: Warranty lasts 90 days.");
assert.deepEqual(modelSources, ["warranty-current"]);
```

Wrap this in one named `test(...)`. The citation assertion deliberately comes before the text assertion: on the original code, `status` is `ok`, then the expected active citation fails against `warranty-old`. Confirm the saved failure is that assertion, with one executed test, rather than an import/build/syntax error. After the fix, text and the exactly one model call with the active source must also pass. The expected ID/text are stated independently of the selection algorithm. Public `legacy` and `unsupported` cases cover the no-eligible-source, zero-model-call branch.

## Required execution and evidence sequence (PowerShell)

Run from this project root. Use PowerShell commands, not the Bash `$(...)`, `sed`, `test -f`, or `&&` examples in the assignment. Do not edit `src/` until both baseline suites and the new test's failure are captured. `npm test`, `evaluate`, and `regression` build from current `src/`. A failing baseline evaluation/regression or before-test should have exit code 1 **and** a real report or assertion failure; a missing module/build failure is a setup problem. Keep each run directory as generated, including `report.json`, `summary.md`, and `traces/`.

1. **Record starting state and prepare:** run `node --version`, `git rev-parse --show-toplevel`, `git rev-parse HEAD`, and `git status --short`; retain actual output. The workspace currently has a Git `HEAD`, but the next chat must recheck it and note any pre-existing dirty/untracked files. Install locked dependencies if needed with `npm ci --ignore-scripts --no-audit --no-fund` (use `--offline` only if the cache contains them). Run `npm run typecheck` and `npm test`; record exit codes and the actual three-test result. If Git metadata is absent, state that fact rather than making up a revision.
2. **Baseline, before changing `src/`:** run `npm run evaluate`, then `npm run regression`, each separately. Capture complete output, each `$LASTEXITCODE`, and each printed `...; evidence: <directory>` path. Verify `Test-Path (Join-Path $preEval 'report.json')` and the corresponding regression path; open both summaries and reports. Verify `refund` actual status/text/citations, checks, `modelCalls`, and `traces/refund.json`; join the selected ID/revision to the source state in `data/lab.json`. Inspect `legacy`, `shipping`, `unsupported`, and regression outcomes too. Do not replace an unexecuted check with the assignment's expected score.
3. **New test on the old implementation:** create only `tests/source-eligibility.test.mjs`, then run `npm run build` and `node --test tests/source-eligibility.test.mjs *> test-before.txt; $beforeTestExit = $LASTEXITCODE; Get-Content test-before.txt`. Confirm exit 1 due to the active-citation assertion, not setup. Save `test-before.txt` and the exit code. If it passes, correct the test before editing application code.
4. **Minimal fix:** change the one source-selection predicate in `src/app.ts`. Review `git diff -- src/app.ts`, `git status --short`, and the new test file. Run `npm run typecheck`, `npm test`, and `node --test tests/source-eligibility.test.mjs *> test-after.txt; $afterTestExit = $LASTEXITCODE; Get-Content test-after.txt`. Record actual exits and counts; expect the same new test to pass and the original three to remain green.
5. **Final suites:** run `npm run evaluate` and `npm run regression` separately on the fixed source. Capture each output/exit/path and verify each fresh `report.json`. Inspect final `refund` trace for `refund-current`, revision 2, and `legacy` report for `refused` and `modelCalls: 0`; check all other case results.
6. **Like-for-like comparison:** run `npm run compare -- (Join-Path $preEval 'report.json') (Join-Path $postEval 'report.json')` and separately compare `$preReg` with `$postReg`. Record each exit/output. `scripts/compare.mjs` requires matching suite label, data hashes, config, script hashes, and case IDs/order. Do not bypass a failed comparison. Source/build/test hashes may legitimately change; review them in reports. Compare per-case changes and regressions, not only totals. Record final `git rev-parse HEAD` and `git status --short`; create a final commit only as appropriate to the implementation chat's authorization/workflow, then record its actual revision. If no new commit is made, explain why `HEAD` did not change and use report file hashes plus working-tree status as the content evidence.

For reliable PowerShell capture, each suite may use this pattern, substituting a distinct log and mode:

```powershell
npm run evaluate *> baseline-evaluate.txt
$preEvalExit = $LASTEXITCODE
$preEvalLine = Get-Content baseline-evaluate.txt | Where-Object { $_ -match '; evidence: ' } | Select-Object -Last 1
if ($preEvalLine -notmatch '; evidence: (?<path>.+)$') { throw 'Evaluation did not print an evidence path.' }
$preEval = $Matches.path.Trim()
if (-not (Test-Path (Join-Path $preEval 'report.json'))) { throw 'Evaluation report is missing.' }
Get-Content (Join-Path $preEval 'summary.md')
```

Use analogous `$preReg`, `$postEval`, and `$postReg` variables. Keep the four suite logs or otherwise preserve their exact output and exit codes. `npm run compare -- ...` takes two actual report paths, and a failed assertion there means the comparison is not controlled. The generated `runs/` directory may be Git-ignored, so confirm it is delivered through the submission channel.

## Handoff to the reporting chat

Provide four distinct run directories: initial/final `evaluate` and initial/final `regression`, each with its untouched `report.json`, `summary.md`, and all trace files. Also provide `test-before.txt`, `test-after.txt`, the new test and source diff, initial/final Git revisions (or a truthful explanation of missing/unchanged revisions), and actual commands, exit codes, test counts, scores, comparison output, and any setup failures. Preserve generated metadata and hashes; do not rewrite scores, UUIDs, times, or traces. The reporting chat should fill the short evidence template with interpretation and file references, not copied tables.

The evidence supports only the tested structured requests under a deterministic model substitute and small synthetic corpus. It does not measure live model accuracy, arbitrary topics, future source revisions, real user traffic, production availability, or the unknown-account behavior. A high illustrative judge score and a passing nonempty-text check cannot override source eligibility. Even 7/7 public regression cases would not close the known account risk or prove an unrestricted release.

Before writing personal contributions or a release recommendation, obtain from **you and Milena**: each person's name as it should appear, who leads this week's presentation, what each actually did and personally verified, the specific simulated use being judged (policy route alone or the whole service), whether exclusion of the account route can truly be enforced, the accepted risk boundary, and the real final results. For a release note, choose `release`, `restrict`, or `do not release` only against that defined use and evidence. State one actionable monitoring signal (for example, an answer citing a document whose current state is archived), the reaction threshold (any such citation), who would verify it against source state, and the stop/recheck response. Wednesday's tutor result and incident interpretation belong in the later update, after those facts exist; do not invent them now.

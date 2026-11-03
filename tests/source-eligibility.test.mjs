import assert from "node:assert/strict";
import test from "node:test";
import { answer } from "../dist/app.js";

test("policy answers use an active source and cite it", () => {
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
});

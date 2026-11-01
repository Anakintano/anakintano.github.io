// node src/lib/run.check.ts
import assert from "node:assert/strict";
import { toRun } from "./run.ts";

const r = toRun({ id: 1, head_sha: "abcdef0123" }, [
  {
    name: "build",
    started_at: "2026-11-01T05:48:53Z",
    completed_at: "2026-11-01T05:49:22Z",
    steps: [{ name: "npm ci", started_at: "2026-11-01T05:48:56Z", completed_at: null }],
  },
]);
assert.equal(r.sha, "abcdef0");
assert.equal(r.jobs[0].secs, 29);
assert.equal(r.jobs[0].steps[0].secs, null); // still running
console.log("run ok");

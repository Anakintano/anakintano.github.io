// The laptop replays this site's latest real GitHub Actions deploy.
export type Step = { name: string; secs: number | null };
export type Run = { id: number; sha: string; live: boolean; jobs: (Step & { steps: Step[] })[] };

type ApiStep = { name: string; started_at: string | null; completed_at: string | null };
type ApiJob = ApiStep & { steps?: ApiStep[] };

const secs = (s: ApiStep) =>
  s.started_at && s.completed_at ? Math.round((Date.parse(s.completed_at) - Date.parse(s.started_at)) / 1000) : null;

export function toRun(run: { id: number; head_sha: string }, jobs: ApiJob[]): Run {
  return {
    id: run.id,
    sha: run.head_sha.slice(0, 7),
    live: true,
    jobs: jobs.map((j) => ({ name: j.name, secs: secs(j), steps: (j.steps ?? []).map((s) => ({ name: s.name, secs: secs(s) })) })),
  };
}

// real run 41278354733, captured 2026-11-01; shown when the API is unreachable or rate-limited
export const SNAPSHOT: Run = {
  id: 41278354733,
  sha: "2e16022",
  live: false,
  jobs: [
    {
      name: "build",
      secs: 29,
      steps: [
        { name: "Set up job", secs: 0 },
        { name: "Run actions/checkout@v4", secs: 1 },
        { name: "Run actions/setup-node@v4", secs: 1 },
        { name: "Run npm ci", secs: 11 },
        { name: "Run npm run build", secs: 8 },
        { name: "Run actions/upload-pages-artifact@v3", secs: 1 },
        { name: "Complete job", secs: 0 },
      ],
    },
    {
      name: "deploy",
      secs: 10,
      steps: [
        { name: "Set up job", secs: 1 },
        { name: "Run actions/deploy-pages@v4", secs: 6 },
        { name: "Complete job", secs: 0 },
      ],
    },
  ],
};

const API = "https://api.github.com/repos/Anakintano/anakintano.github.io/actions/runs";

export async function latestRun(): Promise<Run> {
  try {
    const get = (u: string) => fetch(u, { signal: AbortSignal.timeout(4000) }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
    const run = (await get(`${API}?per_page=1`)).workflow_runs[0];
    return toRun(run, (await get(run.jobs_url)).jobs);
  } catch {
    return SNAPSHOT;
  }
}

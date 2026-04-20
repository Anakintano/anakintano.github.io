"use client";

import { ActivityCalendar } from "react-activity-calendar";

interface Activity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// ── Realistic contribution data generator ───────────────────────────────────
function generateActivityData(): Activity[] {
  const data: Activity[] = [];

  // Build a 365-day window ending today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 364);

  // Seed a deterministic-ish pseudo-random sequence so SSR/CSR match
  let seed = 42;
  function rand(): number {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  }

  // Identify a handful of "sprint weeks" (start indices out of 52 weeks)
  const sprintWeeks = new Set<number>([3, 11, 19, 27, 35, 44, 50]);

  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);

    const weekIndex = Math.floor(i / 7);
    const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isSprint = sprintWeeks.has(weekIndex);

    const r = rand();

    // Adjust probability thresholds based on context
    let p0: number, p1: number, p2: number, p3: number;

    if (isSprint) {
      p0 = 0.20; p1 = 0.35; p2 = 0.28; p3 = 0.12;
    } else if (isWeekend) {
      p0 = 0.72; p1 = 0.17; p2 = 0.07; p3 = 0.03;
    } else {
      p0 = 0.52; p1 = 0.25; p2 = 0.14; p3 = 0.07;
    }
    // p4 = remainder

    let count: number;
    let level: 0 | 1 | 2 | 3 | 4;

    if (r < p0) {
      count = 0; level = 0;
    } else if (r < p0 + p1) {
      count = Math.floor(rand() * 3) + 1; level = 1;
    } else if (r < p0 + p1 + p2) {
      count = Math.floor(rand() * 5) + 4; level = 2;
    } else if (r < p0 + p1 + p2 + p3) {
      count = Math.floor(rand() * 7) + 9; level = 3;
    } else {
      count = Math.floor(rand() * 10) + 16; level = 4;
    }

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    data.push({ date: `${yyyy}-${mm}-${dd}`, count, level });
  }

  // react-activity-calendar requires first and last entries to exist;
  // ensure the last day (today) is always present (already included at i=364)
  // Ensure first day is present (already included at i=0)

  return data;
}

const ACTIVITY_DATA = generateActivityData();

// Derive stats from generated data
const totalCommits = ACTIVITY_DATA.reduce((sum, d) => sum + d.count, 0);
const activeDays = ACTIVITY_DATA.filter((d) => d.count > 0).length;
const longestStreak = (() => {
  let max = 0, cur = 0;
  for (const d of ACTIVITY_DATA) {
    if (d.count > 0) { cur++; max = Math.max(max, cur); }
    else { cur = 0; }
  }
  return max;
})();

// ── Component ────────────────────────────────────────────────────────────────
export default function GitHubHeatmap() {
  return (
    <div className="neon-card p-6 md:p-8 flex flex-col gap-6">
      {/* Calendar */}
      <div className="overflow-x-auto">
        <ActivityCalendar
          data={ACTIVITY_DATA}
          colorScheme="dark"
          theme={{
            dark: ["#0d0d1a", "#3b1f6e", "#5c2fad", "#7c3aed", "#a78bfa"],
          }}
          blockSize={13}
          blockMargin={4}
          fontSize={12}
          showWeekdayLabels
          labels={{
            totalCount: "{{count}} contributions in the last year",
          }}
          style={{ color: "var(--muted)" }}
        />
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <StatCard label="Commits this year" value={`${totalCommits}+`} />
        <StatCard label="Active days" value={`${activeDays}`} />
        <StatCard label="Longest streak" value={`${longestStreak} days`} />
        <StatCard label="Public repos" value="6+" />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-xl font-bold"
        style={{
          color: "var(--primary)",
          fontFamily: "'Space Grotesk', var(--font-sans)",
        }}
      >
        {value}
      </span>
      <span
        className="text-xs"
        style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
      >
        {label}
      </span>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { api } from "../api";

/* ---------- animated count-up for stat numbers ---------- */
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const end = Number(target) || 0;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      setValue(Math.round(from + (end - from) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

/* ---------- theme tokens: gradient + glow per stat ---------- */
const STAT_THEMES = {
  slate: {
    grad: "from-slate-600 to-slate-800",
    glow: "shadow-slate-400/30",
    ring: "ring-slate-200",
  },
  blue: {
    grad: "from-sky-500 to-blue-700",
    glow: "shadow-blue-400/40",
    ring: "ring-blue-200",
  },
  emerald: {
    grad: "from-emerald-400 to-teal-600",
    glow: "shadow-emerald-400/40",
    ring: "ring-emerald-200",
  },
  rose: {
    grad: "from-rose-400 to-pink-600",
    glow: "shadow-rose-400/40",
    ring: "ring-rose-200",
  },
  violet: {
    grad: "from-violet-500 to-fuchsia-600",
    glow: "shadow-violet-400/40",
    ring: "ring-violet-200",
  },
  amber: {
    grad: "from-amber-400 to-orange-600",
    glow: "shadow-amber-400/40",
    ring: "ring-amber-200",
  },
};

function StatCard({ label, value, theme = "slate", delay = 0 }) {
  const t = STAT_THEMES[theme];
  const animated = useCountUp(value);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-4 text-center text-white
        bg-gradient-to-br ${t.grad} shadow-lg ${t.glow}
        ring-1 ${t.ring} ring-offset-2 ring-offset-white
        transition-all duration-300 ease-out
        hover:-translate-y-1.5 hover:shadow-2xl
        animate-card-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* soft shine sweep on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* decorative glow blob */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/20 blur-2xl" />

      <div className="relative text-3xl font-extrabold tracking-tight tabular-nums drop-shadow-sm">
        {animated}
      </div>
      <div className="relative text-xs font-semibold mt-1 uppercase tracking-wide text-white/85">
        {label}
      </div>
    </div>
  );
}

function AttendBadge({ attend }) {
  const isYes = attend === "Yes";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ring-1
      transition-transform duration-200 hover:scale-105 ${
        isYes
          ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 ring-emerald-200"
          : "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 ring-rose-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isYes ? "bg-emerald-500 animate-pulse-dot" : "bg-rose-500"
        }`}
      />
      {attend}
    </span>
  );
}

/* ---------- sort caret ---------- */
function SortIcon({ dir }) {
  return (
    <span className="inline-block ml-1 text-[10px] leading-none align-middle">
      {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "⇅"}
    </span>
  );
}

const PAGE_SIZE = 8;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // table-view controls
  const [view, setView] = useState("table"); // "table" | "cards"
  const [query, setQuery] = useState("");
  const [attendFilter, setAttendFilter] = useState("all"); // all | Yes | No
  const [sortKey, setSortKey] = useState("submitted_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([
          api.dashboard(),
          api.listRegistrations(),
        ]);
        setStats(s);
        setRegs(r);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredSorted = (() => {
    let list = regs;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) =>
          String(r.roll_no).toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q)
      );
    }

    if (attendFilter !== "all") {
      list = list.filter((r) => r.attend === attendFilter);
    }

    const dir = sortDir === "asc" ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });

    return list;
  })();

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredSorted.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  if (loading)
    return (
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 rounded-full border-4 border-violet-200" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 border-r-blue-500 animate-spin" />
        </div>
        <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent animate-shimmer-text bg-[length:200%_auto]">
          Loading dashboard...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3 shadow-sm animate-card-in">
        {error}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* keyframes local to this component */}
      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-card-in { animation: card-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes row-in {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-row-in { animation: row-in 0.4s ease-out both; }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55); }
          50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
        }
        .animate-pulse-dot { animation: pulse-dot 1.8s ease-in-out infinite; }

        @keyframes shimmer-text {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer-text { animation: shimmer-text 2.2s linear infinite; }

        @keyframes bg-drift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <StatCard label="Total Students" value={stats.total_students} theme="slate" delay={0} />
        <StatCard label="Registered" value={stats.total_registered} theme="blue" delay={60} />
        <StatCard label="Attending" value={stats.yes} theme="emerald" delay={120} />
        <StatCard label="Not Attending" value={stats.no} theme="rose" delay={180} />
        <StatCard label="Accompanying" value={stats.total_accompanying} theme="violet" delay={240} />
        <StatCard label="Not Yet Registered" value={stats.not_yet_registered} theme="amber" delay={300} />
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={api.downloadUrl("students")}
          className="relative overflow-hidden text-sm font-semibold text-white px-4 py-2 rounded-xl shadow-md
            bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-[length:200%_auto]
            transition-[background-position,transform] duration-500 hover:bg-[position:100%_0] hover:-translate-y-0.5
            hover:shadow-lg hover:shadow-blue-400/40"
        >
          ⬇ Download students.xlsx
        </a>
        <a
          href={api.downloadUrl("registrations")}
          className="relative overflow-hidden text-sm font-semibold text-white px-4 py-2 rounded-xl shadow-md
            bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 bg-[length:200%_auto]
            transition-[background-position,transform] duration-500 hover:bg-[position:100%_0] hover:-translate-y-0.5
            hover:shadow-lg hover:shadow-violet-400/40"
        >
          ⬇ Download registrations.xlsx
        </a>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* toolbar: search, filter, view toggle */}
        <div className="px-5 py-3 border-b border-slate-200 bg-gradient-to-r from-violet-50 via-blue-50 to-emerald-50 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-700">
            {filteredSorted.length} of {regs.length} registration
            {regs.length === 1 ? "" : "s"}
          </span>

          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              🔍
            </span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search name or roll no..."
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white/80 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            {["all", "Yes", "No"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setAttendFilter(f);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  attendFilter === f
                    ? f === "Yes"
                      ? "bg-emerald-500 text-white"
                      : f === "No"
                      ? "bg-rose-500 text-white"
                      : "bg-slate-800 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg overflow-hidden border border-slate-200 shadow-sm ml-auto">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                view === "table"
                  ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              ☰ Table
            </button>
            <button
              onClick={() => setView("cards")}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                view === "cards"
                  ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              ▦ Cards
            </button>
          </div>
        </div>

        {filteredSorted.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">
            No registrations match your search or filter.
          </div>
        ) : view === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-left">
                <tr>
                  {[
                    ["roll_no", "Roll No"],
                    ["name", "Name"],
                    ["attend", "Attending"],
                    ["persons_count", "Persons"],
                    [null, "Details"],
                    ["submitted_at", "Submitted"],
                  ].map(([key, label]) => (
                    <th
                      key={label}
                      onClick={() => key && toggleSort(key)}
                      className={`px-4 py-2.5 font-medium select-none ${
                        key ? "cursor-pointer hover:text-blue-300 transition-colors" : ""
                      }`}
                    >
                      {label}
                      {key && <SortIcon dir={sortKey === key ? sortDir : null} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, i) => (
                  <tr
                    key={r.roll_no}
                    className={`border-t border-slate-100 transition-colors duration-200 animate-row-in
                      hover:bg-gradient-to-r hover:from-violet-50 hover:via-blue-50 hover:to-emerald-50
                      ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                    style={{ animationDelay: `${Math.min(i, 20) * 35}ms` }}
                  >
                    <td className="px-4 py-2.5 font-bold text-blue-700">{r.roll_no}</td>
                    <td className="px-4 py-2.5 text-slate-800 font-medium">{r.name}</td>
                    <td className="px-4 py-2.5">
                      <AttendBadge attend={r.attend} />
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-bold shadow-sm">
                        {r.persons_count}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {r.persons.map((p) => p.join(" / ")).join("; ") || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">{r.submitted_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {pageRows.map((r, i) => (
              <div
                key={r.roll_no}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50
                  shadow-sm p-4 animate-card-in transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${Math.min(i, 20) * 40}ms` }}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                    r.attend === "Yes"
                      ? "from-emerald-400 to-teal-500"
                      : "from-rose-400 to-pink-500"
                  }`}
                />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-blue-700">
                      #{r.roll_no}
                    </div>
                    <div className="font-bold text-slate-800">{r.name}</div>
                  </div>
                  <AttendBadge attend={r.attend} />
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 font-bold">
                    {r.persons_count}
                  </span>
                  <span>accompanying</span>
                </div>

                <div className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {r.persons.map((p) => p.join(" / ")).join("; ") || "—"}
                </div>

                <div className="mt-3 text-[11px] text-slate-400">
                  Submitted {r.submitted_at}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Page {safePage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1 rounded-lg border border-slate-200 font-semibold
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:bg-gradient-to-r hover:from-violet-50 hover:to-blue-50 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-3 py-1 rounded-lg border border-slate-200 font-semibold
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:bg-gradient-to-r hover:from-violet-50 hover:to-blue-50 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
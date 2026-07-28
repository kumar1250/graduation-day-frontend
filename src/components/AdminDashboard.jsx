import { useEffect, useState } from "react";
import { api } from "../api";

const STAT_THEMES = {
  slate: "bg-slate-50 border-slate-200 text-slate-900",
  blue: "bg-blue-50 border-blue-200 text-blue-900",
  emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
  rose: "bg-rose-50 border-rose-200 text-rose-900",
  violet: "bg-violet-50 border-violet-200 text-violet-900",
  amber: "bg-amber-50 border-amber-200 text-amber-900",
};

function StatCard({ label, value, theme = "slate" }) {
  return (
    <div className={`rounded-xl shadow-sm border p-4 text-center ${STAT_THEMES[theme]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium mt-1 opacity-70">{label}</div>
    </div>
  );
}

function AttendBadge({ attend }) {
  const isYes = attend === "Yes";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isYes
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isYes ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {attend}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading)
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
        {error}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <StatCard label="Total Students" value={stats.total_students} theme="slate" />
        <StatCard label="Registered" value={stats.total_registered} theme="blue" />
        <StatCard label="Attending" value={stats.yes} theme="emerald" />
        <StatCard label="Not Attending" value={stats.no} theme="rose" />
        <StatCard label="Accompanying" value={stats.total_accompanying} theme="violet" />
        <StatCard label="Not Yet Registered" value={stats.not_yet_registered} theme="amber" />
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={api.downloadUrl("students")}
          className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-600 transition"
        >
          Download students.xlsx
        </a>
        <a
          href={api.downloadUrl("registrations")}
          className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-violet-500 text-white px-4 py-2 rounded-lg shadow-sm hover:from-violet-700 hover:to-violet-600 transition"
        >
          Download registrations.xlsx
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <div className="px-5 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white text-sm font-medium text-slate-600">
          {regs.length} registration{regs.length === 1 ? "" : "s"}
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Roll No</th>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Attending</th>
              <th className="px-4 py-2.5 font-medium">Persons</th>
              <th className="px-4 py-2.5 font-medium">Details</th>
              <th className="px-4 py-2.5 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {regs.map((r, i) => (
              <tr
                key={r.roll_no}
                className={`border-t border-slate-100 hover:bg-violet-50/60 transition-colors ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <td className="px-4 py-2.5 font-semibold text-blue-700">{r.roll_no}</td>
                <td className="px-4 py-2.5 text-slate-800">{r.name}</td>
                <td className="px-4 py-2.5">
                  <AttendBadge attend={r.attend} />
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
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
    </div>
  );
}
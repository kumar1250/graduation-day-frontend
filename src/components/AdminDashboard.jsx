import { useEffect, useState } from "react";
import { api } from "../api";

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
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

  if (loading) return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
        {error}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <StatCard label="Total Students" value={stats.total_students} />
        <StatCard label="Registered" value={stats.total_registered} />
        <StatCard label="Attending" value={stats.yes} />
        <StatCard label="Not Attending" value={stats.no} />
        <StatCard label="Accompanying" value={stats.total_accompanying} />
        <StatCard label="Not Yet Registered" value={stats.not_yet_registered} />
      </div>

      <div className="flex gap-3">
        <a
          href={api.downloadUrl("students")}
          className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          Download students.xlsx
        </a>
        <a
          href={api.downloadUrl("registrations")}
          className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          Download registrations.xlsx
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <div className="px-5 py-3 border-b border-slate-200 text-sm text-slate-500">
          {regs.length} registration{regs.length === 1 ? "" : "s"}
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Roll No</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Attending</th>
              <th className="px-4 py-2 font-medium">Persons</th>
              <th className="px-4 py-2 font-medium">Details</th>
              <th className="px-4 py-2 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {regs.map((r) => (
              <tr key={r.roll_no} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-900">{r.roll_no}</td>
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.attend}</td>
                <td className="px-4 py-2">{r.persons_count}</td>
                <td className="px-4 py-2 text-slate-500">
                  {r.persons.map((p) => p.join(" / ")).join("; ") || "—"}
                </td>
                <td className="px-4 py-2 text-slate-500">{r.submitted_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

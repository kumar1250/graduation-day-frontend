import { useEffect, useState } from "react";
import { api } from "../api";

/* ---------- class-awarded badge, colored by grade ---------- */
const CLASS_THEME = {
  "First Class with Distinction": "from-fuchsia-100 to-violet-100 text-violet-700 ring-violet-200",
  "First Class": "from-emerald-100 to-teal-100 text-emerald-700 ring-emerald-200",
  "Second Class": "from-amber-100 to-orange-100 text-amber-700 ring-amber-200",
};

function ClassBadge({ value }) {
  const theme =
    CLASS_THEME[value] || "from-sky-100 to-blue-100 text-blue-700 ring-blue-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full bg-gradient-to-r text-xs font-semibold shadow-sm ring-1 transition-transform duration-200 hover:scale-105 ${theme}`}
    >
      {value}
    </span>
  );
}

export default function Directory() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (q = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listStudents(q);
      setStudents(data.students);
      setCount(data.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  return (
    <div className="space-y-4 px-4 sm:px-0">
      <style>{`
        @keyframes dir-row-in {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-dir-row-in { animation: dir-row-in 0.4s ease-out both; }

        @keyframes dir-card-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dir-card-in { animation: dir-card-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes dir-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-dir-shimmer { animation: dir-shimmer 2.2s linear infinite; }
      `}</style>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 animate-dir-card-in"
      >
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by roll number, name, or father name"
            autoComplete="off"
            className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 sm:py-2 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
        </div>
        <div className="flex gap-2.5 sm:gap-3">
          <button
            type="submit"
            className="flex-1 sm:flex-none relative overflow-hidden text-white text-sm font-semibold px-5 py-2.5 sm:py-2 rounded-lg shadow-md
              bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-[length:200%_auto]
              transition-[background-position,transform] duration-500 hover:bg-[position:100%_0] hover:-translate-y-0.5
              hover:shadow-lg hover:shadow-violet-400/40"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                load("");
              }}
              className="text-sm bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent hover:from-rose-600 hover:to-pink-700 font-bold px-2 shrink-0 transition"
            >
              Clear ✕
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3 animate-dir-card-in">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-dir-card-in">
        <div className="px-4 sm:px-5 py-3 border-b border-slate-200 bg-gradient-to-r from-violet-50 via-blue-50 to-emerald-50 text-sm font-semibold text-slate-700 flex items-center gap-2">
          {loading ? (
            <>
              <span className="relative w-4 h-4 inline-block">
                <span className="absolute inset-0 rounded-full border-2 border-violet-200" />
                <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-600 border-r-blue-500 animate-spin" />
              </span>
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent animate-dir-shimmer bg-[length:200%_auto]">
                Loading…
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-600 text-white text-xs font-bold shadow-sm">
                {count}
              </span>
              <span className="bg-gradient-to-r from-violet-700 to-blue-700 bg-clip-text text-transparent font-bold">
                student{count === 1 ? "" : "s"}
              </span>
            </>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-left">
              <tr>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">Roll No</th>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">Name</th>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">Father Name</th>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">Class Awarded</th>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">CGPA</th>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">Month &amp; Year</th>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">Mobile</th>
                <th className="px-4 py-2.5 font-medium whitespace-nowrap">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.roll_no}
                  className={`border-t border-slate-100 transition-colors duration-200 animate-dir-row-in
                    hover:bg-gradient-to-r hover:from-violet-50 hover:via-blue-50 hover:to-emerald-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  style={{ animationDelay: `${Math.min(i, 20) * 35}ms` }}
                >
                  <td className="px-4 py-2.5 font-bold text-blue-700 whitespace-nowrap">
                    {s.roll_no}
                  </td>
                  <td className="px-4 py-2.5 text-slate-800 font-medium whitespace-nowrap">
                    {s.name}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">
                    {s.father_name}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <ClassBadge value={s.class_awarded} />
                  </td>
                  <td className="px-4 py-2.5 font-bold text-amber-600 whitespace-nowrap">
                    {s.cgpa}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{s.month_year}</td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{s.mobile}</td>
                  <td className="px-4 py-2.5 text-blue-600 whitespace-nowrap">{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && students.length === 0 && (
          <div className="px-4 sm:px-5 py-6 text-center text-sm text-slate-400">
            No students found.
          </div>
        )}
      </div>
    </div>
  );
}
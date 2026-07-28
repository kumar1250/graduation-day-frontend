import { useEffect, useState } from "react";
import { api } from "../api";

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
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by roll number, name, or father name"
          autoComplete="off"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <div className="flex gap-2.5 sm:gap-3">
          <button
            type="submit"
            className="flex-1 sm:flex-none bg-slate-900 text-white text-sm font-medium px-5 py-2.5 sm:py-2 rounded-lg hover:bg-slate-700 transition"
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
              className="text-sm text-slate-500 hover:text-slate-800 px-2 shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-slate-200 text-sm text-slate-500">
          {loading ? "Loading…" : `${count} student${count === 1 ? "" : "s"}`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-2 font-medium whitespace-nowrap">Roll No</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">Name</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">Father Name</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">Class Awarded</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">CGPA</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">Month &amp; Year</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">Mobile</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.roll_no} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap">
                    {s.roll_no}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.father_name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.class_awarded}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.cgpa}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.month_year}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.mobile}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{s.email}</td>
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
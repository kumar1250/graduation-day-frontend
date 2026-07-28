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
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by roll number, name, or father name"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="submit"
          className="bg-slate-900 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-700"
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
            className="text-sm text-slate-500 hover:text-slate-800 px-2"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <div className="px-5 py-3 border-b border-slate-200 text-sm text-slate-500">
          {loading ? "Loading..." : `${count} student${count === 1 ? "" : "s"}`}
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Roll No</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Father Name</th>
              <th className="px-4 py-2 font-medium">Class Awarded</th>
              <th className="px-4 py-2 font-medium">CGPA</th>
              <th className="px-4 py-2 font-medium">Month &amp; Year</th>
              <th className="px-4 py-2 font-medium">Mobile</th>
              <th className="px-4 py-2 font-medium">Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.roll_no} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-900">{s.roll_no}</td>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.father_name}</td>
                <td className="px-4 py-2">{s.class_awarded}</td>
                <td className="px-4 py-2">{s.cgpa}</td>
                <td className="px-4 py-2">{s.month_year}</td>
                <td className="px-4 py-2">{s.mobile}</td>
                <td className="px-4 py-2">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

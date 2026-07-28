import { useState } from "react";
import { api } from "../api";

const DETAIL_ROWS = [
  ["Roll Number", "roll_no"],
  ["Student Name", "name"],
  ["Father Name", "father_name"],
  ["Class Awarded", "class_awarded"],
  ["CGPA / Percent", "cgpa"],
  ["Month & Year", "month_year"],
  ["Mobile", "mobile"],
  ["Email", "email"],
];

function emptyPerson() {
  return { name: "", contact: "", relation: "" };
}

export default function RegisterSection({ onRegistered }) {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [attend, setAttend] = useState("Yes");
  const [persons, setPersons] = useState([emptyPerson()]);
  const [submitting, setSubmitting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setStudent(null);
    if (!rollNo.trim()) return;
    setLoading(true);
    try {
      const data = await api.getStudent(rollNo.trim());
      setStudent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePerson = (idx, field, value) => {
    setPersons((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const addPerson = () => setPersons((prev) => [...prev, emptyPerson()]);
  const removePerson = (idx) =>
    setPersons((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student) return;
    setSubmitting(true);
    setError("");
    try {
      const cleanPersons =
        attend === "Yes" ? persons.filter((p) => p.name.trim()) : [];
      await api.submitRegistration({
        roll_no: student.roll_no,
        name: student.name,
        attend,
        persons_list: cleanPersons,
      });
      onRegistered({ ...student, attend, persons: cleanPersons });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewAcknowledgement = () => {
    if (!student) return;
    const resolvedPersons =
      student.persons || student.persons_list || student.companions || [];
    const resolvedAttend = student.attend || "Yes";
    onRegistered({ ...student, attend: resolvedAttend, persons: resolvedPersons });
  };

  return (
    <div id="register" className="space-y-6 max-w-2xl mx-auto">
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex gap-3"
      >
        <input
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Enter roll number, e.g. 22221A0101"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {student && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-3">Student Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {DETAIL_ROWS.map(([label, key]) => (
              <div key={key} className="flex justify-between border-b border-slate-100 pb-1">
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-900 text-right">
                  {student[key] ?? "—"}
                </dd>
              </div>
            ))}
          </dl>

          {student.already_registered ? (
            <div className="mt-4 space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
                This student has already been registered for graduation day.
              </div>
              <button
                type="button"
                onClick={handleViewAcknowledgement}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-700 transition"
              >
                Download Acknowledgement
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4 border-t border-slate-200 pt-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Will attend graduation day?</label>
                <div className="flex gap-4 mt-2">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="attend"
                        value={opt}
                        checked={attend === opt}
                        onChange={() => setAttend(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {attend === "Yes" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Accompanying persons</label>
                  {persons.map((p, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        placeholder="Name"
                        value={p.name}
                        onChange={(e) => updatePerson(idx, "name", e.target.value)}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                      />
                      <input
                        placeholder="Contact"
                        value={p.contact}
                        onChange={(e) => updatePerson(idx, "contact", e.target.value)}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                      />
                      <input
                        placeholder="Relation"
                        value={p.relation}
                        onChange={(e) => updatePerson(idx, "relation", e.target.value)}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                      />
                      {persons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePerson(idx)}
                          className="text-slate-400 hover:text-red-600 text-sm px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPerson}
                    className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                  >
                    + Add another person
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
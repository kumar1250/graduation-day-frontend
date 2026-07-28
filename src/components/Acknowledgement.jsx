import { forwardRef } from "react";
import bvceLogo from "../assets/bvce-logo.png";

const INSTRUCTIONS = [
  "Be at the venue at least 30-45 minutes before the ceremony begins to check in and get seated.",
  "Proceed to the designated check-in area to receive your name card and instructions.",
  "Collect your Graduation Day kit from the department by showing this acknowledgement.",
  "Wear the appropriate academic regalia (cap and gown).",
  "Follow instructions for the processional order — walk in a straight line at a steady pace.",
  "Once seated, remain in your assigned seat unless directed otherwise.",
  "Turn off or silence your phone during the ceremony.",
  "Maintain a respectful attitude — applaud and cheer for fellow graduates.",
  "When your name is called, walk to the stage confidently and return to your seat smoothly.",
  "After the ceremony, feel free to take photos with family and friends.",
];

const Acknowledgement = forwardRef(function Acknowledgement({ student }, ref) {
  const persons = student.persons || [];
  const rows = [...persons, ...Array(Math.max(0, 2 - persons.length)).fill(null)];

  return (
    <div
      ref={ref}
      className="paper-texture bg-parchment-50 text-ink-950 w-[800px] mx-auto p-0"
    >
      {/* Outer engraved border */}
      <div className="border-[3px] border-ink-900 m-3">
        <div className="border border-brass-500 m-1.5 p-9">
          {/* Letterhead */}
          <div className="flex items-center gap-4 border-b-2 border-brass-500 pb-5">
            <img
              src={bvceLogo}
              alt="BVCE logo"
              className="w-16 h-16 object-contain shrink-0"
            />
            <div>
              <h1 className="font-display text-lg font-bold text-ink-950 leading-tight tracking-tight">
                Bonam Venkata Chalamayya Engineering College Odalarevu
              </h1>
              <p className="text-[11px] text-ink-900/55 tracking-wide mt-0.5">
                Amalapuram &middot; Odalarevu &middot; Rajahmundry — Since 1997
              </p>
            </div>
            <div className="ml-auto shrink-0 w-16 h-16 rounded-full border-2 border-brass-500 flex flex-col items-center justify-center text-center leading-none">
              <span className="text-[8px] font-semibold uppercase tracking-wider text-brass-600">
                Registered
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-600 mt-0.5"
              >
                <path d="m20 6-11 11-5-5" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brass-600">
              Graduation Day 2026 &middot; 22nd August 2026
            </p>
            <h2 className="font-display text-2xl font-bold text-ink-950 mt-1.5">
              Registration Acknowledgement
            </h2>
          </div>

          <p className="mt-7 text-sm leading-relaxed">
            Dear <b>{student.name}</b>, congratulations on completing your
            degree. This letter confirms your registration for Graduation Day,
            with the details recorded below.
          </p>

          {/* Details grid */}
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 text-sm border-y border-ink-900/10 py-4">
            <p>
              <span className="text-ink-900/50">Roll Number</span>
              <br />
              <b>{student.roll_no}</b>
            </p>
            <p>
              <span className="text-ink-900/50">Name of the Candidate</span>
              <br />
              <b>{student.name}</b>
            </p>
            <p>
              <span className="text-ink-900/50">Father's Name</span>
              <br />
              <b>{student.father_name}</b>
            </p>
            <p>
              <span className="text-ink-900/50">Class Awarded</span>
              <br />
              <b>{student.class_awarded}</b>
            </p>
            <p>
              <span className="text-ink-900/50">CGPA / Percent</span>
              <br />
              <b>{student.cgpa}</b>
            </p>
            <p>
              <span className="text-ink-900/50">Attending Ceremony</span>
              <br />
              <b>{student.attend}</b>
            </p>
          </div>

          {/* Companions */}
          <p className="mt-6 font-semibold text-sm text-ink-950">
            Accompanying Guests
          </p>
          <table className="w-full mt-2 text-sm border border-ink-900/15">
            <thead className="bg-ink-950 text-white">
              <tr>
                <th className="border border-ink-900/15 px-2 py-1.5 font-medium w-12">
                  S.No
                </th>
                <th className="border border-ink-900/15 px-2 py-1.5 font-medium text-left">
                  Name
                </th>
                <th className="border border-ink-900/15 px-2 py-1.5 font-medium text-left">
                  Relation
                </th>
                <th className="border border-ink-900/15 px-2 py-1.5 font-medium text-left">
                  Contact No.
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={i} className={i % 2 ? "bg-brass-300/10" : "bg-white"}>
                  <td className="border border-ink-900/15 px-2 py-1.5 text-center">
                    {i + 1}
                  </td>
                  <td className="border border-ink-900/15 px-2 py-1.5">
                    {p?.name || ""}
                  </td>
                  <td className="border border-ink-900/15 px-2 py-1.5">
                    {p?.relation || ""}
                  </td>
                  <td className="border border-ink-900/15 px-2 py-1.5">
                    {p?.contact || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Instructions */}
          <div className="mt-7 border-t border-ink-900/10 pt-5">
            <p className="font-semibold text-sm text-ink-950">
              Instructions to the Graduates
            </p>
            <ol className="mt-2.5 space-y-1.5 text-[13px] leading-relaxed">
              {INSTRUCTIONS.map((line, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-brass-600 font-semibold shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Sign-off */}
          <div className="mt-8 flex items-end justify-between border-t-2 border-brass-500 pt-5">
            <div>
              <p className="font-script text-xl text-ink-950/80">
                Congratulations, and welcome to the alumni family.
              </p>
              <p className="text-[11px] text-ink-900/45 mt-1">
                Graduation Day Office &middot; BVCE College &middot; Amalapuram &middot; Odalarevu
              </p>
            </div>
            <div className="text-center shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-brass-500 flex items-center justify-center mx-auto">
                <span className="font-display text-[9px] font-bold text-brass-600 text-center leading-tight">
                  BVCE<br />SEAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Acknowledgement;
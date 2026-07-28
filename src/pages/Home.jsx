import { useState } from "react";
import bvceLogo from "../assets/bvce-logo.png";
import heroImg from "../assets/hero.png";
import RegisterSection from "../components/RegisterSection";
import AcknowledgementSection from "../components/AcknowledgementSection";

const DETAILS = [
  {
    label: "Date",
    value: "22nd August, 2026",
    icon: (
      <path d="M7 3v3M17 3v3M4 9h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v13A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-13A1.5 1.5 0 0 1 5.5 5Z" />
    ),
  },
  {
    label: "Venue",
    value: "College Main Auditorium",
    icon: (
      <path d="M4 21h16M5 21V10l7-6 7 6v11M9 21v-6h6v6" />
    ),
  },
  {
    label: "Eligible Batch",
    value: "2022-2026 Batch — PC Eligible List",
    icon: (
      <path d="M12 3 2 8l10 5 10-5-10-5Zm-7 8.5V16c0 1.5 3 3.5 7 3.5s7-2 7-3.5v-4.5M22 8v6" />
    ),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Find your record",
    text: "Enter your roll number to pull up your official graduation record from the PC eligible list.",
  },
  {
    n: "02",
    title: "Confirm attendance",
    text: "Verify your details and let us know if you'll be joining, along with anyone accompanying you.",
  },
  {
    n: "03",
    title: "Download your pass",
    text: "Get an instant, printable acknowledgement with your seating and check-in instructions.",
  },
];

function scrollToRegister() {
  const el = document.getElementById("register");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  const [registeredStudent, setRegisteredStudent] = useState(null);

  return (
    <div className="min-h-screen bg-parchment-50">
      <div className="h-1.5 rule-brass" />

      <section className="relative overflow-hidden bg-ink-950 text-white">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/95 via-ink-950/90 to-ink-950" />

        <div className="relative max-w-5xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="flex flex-col items-center text-center gap-6">
            <img
              src={bvceLogo}
              alt="BVCE emblem"
              className="w-24 h-24 md:w-28 md:h-28 drop-shadow-[0_4px_18px_rgba(201,162,39,0.35)]"
            />

            <div>
              <p className="font-body uppercase tracking-[0.35em] text-brass-400 text-xs md:text-sm">
                Bonam Venkata Chalamayya Group of Institutions
              </p>
              <p className="text-ink-100/60 text-xs mt-1.5 tracking-wide">
                Amalapuram &middot; Odalarevu &middot; Rajahmundry — Since 1997
              </p>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[1.08] max-w-3xl">
              Graduation Day <span className="text-brass-400">2026</span>
            </h1>
            <p className="font-script text-2xl md:text-3xl text-brass-300/90 -mt-2">
              Class of 2022 &mdash; a chapter closes, a legacy begins
            </p>

            <p className="text-ink-100/70 max-w-xl text-sm md:text-base leading-relaxed">
              Register your attendance below to confirm your seat at the ceremony
              and receive your official acknowledgement, ready to download in
              seconds.
            </p>

            {!registeredStudent && (
              <button
                type="button"
                onClick={scrollToRegister}
                className="mt-2 group inline-flex items-center gap-2 bg-brass-500 hover:bg-brass-400 text-ink-950 font-semibold text-sm px-8 py-3.5 rounded-full shadow-[0_10px_30px_-8px_rgba(201,162,39,0.55)] transition"
              >
                Register for Graduation Day
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className="transition group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="h-px rule-brass opacity-70" />
      </section>

      <section className="max-w-5xl mx-auto px-6 -mt-8 md:-mt-10 relative z-10">
        <div className="grid sm:grid-cols-3 gap-5">
          {DETAILS.map((d) => (
            <div
              key={d.label}
              className="bg-white rounded-2xl shadow-[0_18px_40px_-24px_rgba(14,33,68,0.35)] border border-ink-900/5 px-6 py-6 flex items-center gap-4"
            >
              <div className="shrink-0 w-11 h-11 rounded-full bg-ink-900 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-brass-400)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {d.icon}
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-600/70">
                  {d.label}
                </p>
                <p className="text-ink-950 font-semibold text-sm mt-0.5">
                  {d.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-4">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brass-600">
            Three simple steps
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink-950 mt-2">
            Getting registered takes a minute
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative pl-14">
              <span className="absolute left-0 top-0 font-display text-4xl font-bold text-ink-900/10">
                {s.n}
              </span>
              <h3 className="font-semibold text-ink-950">{s.title}</h3>
              <p className="text-sm text-ink-900/60 mt-1.5 leading-relaxed">
                {s.text}
              </p>
              {i < STEPS.length - 1 && (
                <span className="hidden md:block absolute -right-4 top-2 text-ink-900/15">
                  &rarr;
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="register" className="px-6 pt-10 pb-20">
        {registeredStudent ? (
          <AcknowledgementSection
            student={registeredStudent}
            onRegisterAnother={() => setRegisteredStudent(null)}
          />
        ) : (
          <>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brass-600">
                Registration
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink-950 mt-2">
                Confirm your attendance
              </h2>
              <p className="text-ink-900/60 text-sm mt-3 leading-relaxed">
                Enter your roll number to confirm your details and register your
                attendance for Graduation Day. If you're already registered,
                you can re-download your acknowledgement here too.
              </p>
            </div>
            <RegisterSection
              onRegistered={(student) => setRegisteredStudent(student)}
            />
          </>
        )}
      </section>

      <footer className="bg-ink-950 text-ink-100/60">
        <div className="h-px rule-brass opacity-70" />
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <img src={bvceLogo} alt="BVCE emblem" className="w-9 h-9 opacity-90" />
            <div>
              <p className="text-white font-semibold text-sm">
                Bonam Venkata Chalamayya Group of Institutions
              </p>
              <p className="text-xs mt-0.5">
                Amalapuram &middot; Odalarevu &middot; Rajahmundry
              </p>
            </div>
          </div>
          <p className="text-xs">
            &copy; 2026 BVCE Graduation Day Office. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
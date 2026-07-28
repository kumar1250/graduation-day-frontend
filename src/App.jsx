import { useState } from "react";
import Home from "./pages/Home";
import Directory from "./components/Directory";
import AdminDashboard from "./components/AdminDashboard";

const ADMIN_PATH = "/bvc-admin";
const isAdminRoute =
  typeof window !== "undefined" &&
  window.location.pathname.replace(/\/+$/, "") === ADMIN_PATH;

const ADMIN_TABS = [
  { key: "directory", label: "Student Directory" },
  { key: "admin", label: "Admin Dashboard" },
];

export default function App() {
  const [tab, setTab] = useState(ADMIN_TABS[0].key);

  if (!isAdminRoute) {
    return <Home />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Graduation Day Portal — Admin
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            JNTUK &middot; B V C Engineering College &middot; 2022 Batch PC Eligible List
          </p>
        </div>
      </header>

      <nav className="max-w-5xl mx-auto px-4">
        <div className="flex gap-1 border-b border-slate-200 mt-4">
          {ADMIN_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                tab === t.key
                  ? "bg-white border border-slate-200 border-b-white text-slate-900 -mb-px"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === "directory" && <Directory />}
        {tab === "admin" && <AdminDashboard />}
      </main>
    </div>
  );
}
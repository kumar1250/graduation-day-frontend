import { useState } from "react";
import Home from "./pages/Home";
import Directory from "./components/Directory";
import AdminDashboard from "./components/AdminDashboard";
import logo from "./assets/bvce-logo.png";

const ADMIN_PATH = "/bvc-admin";
const isAdminRoute =
  typeof window !== "undefined" &&
  window.location.pathname.replace(/\/+$/, "") === ADMIN_PATH;

const ADMIN_TABS = [
  { key: "admin", label: "📊 Admin Dashboard" },
  { key: "directory", label: "🎓 Student Directory" },
];

export default function App() {
  // Admin Dashboard will open first
  const [tab, setTab] = useState("admin");

  if (!isAdminRoute) {
    return <Home />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Header */}
    <header className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 text-white shadow-xl">
  <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-5">
    {/* College Logo */}
    <img
      src={logo}
      alt="BVC Engineering College Logo"
      className="w-16 h-16 rounded-full bg-white p-1 shadow-lg"
    />

    {/* Header Text */}
    <div>
      <h1 className="text-3xl font-bold tracking-wide">
        Graduation Day Portal — Admin
      </h1>
      <p className="text-teal-100 text-sm mt-1">
        JNTUK • B V C Engineering College • 2022 Batch PC Eligible List
      </p>
    </div>
  </div>
</header>

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex gap-3">
          {ADMIN_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                tab === t.key
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-105 shadow-xl"
                  : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === "admin" && <AdminDashboard />}
        {tab === "directory" && <Directory />}
      </main>
    </div>
  );
}
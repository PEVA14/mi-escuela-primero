import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GestionEscuelas from "../components/admin/GestionEscuelas";
import RespuestasDonadores from "../components/admin/RespuestasDonadores";

const NAV_ITEMS = [
  { key: "escuelas", label: "Gestión de Escuelas" },
  { key: "respuestas", label: "Respuestas de Donadores" },
];

export default function Admin() {
  const navigate = useNavigate();
  const [vista, setVista] = useState("escuelas");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="z-10 flex items-center justify-between bg-emerald-700 px-6 py-4 shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
          <p className="text-sm text-emerald-200">Gestiona las escuelas y sus necesidades del catálogo</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          ← Volver al sitio
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop */}
        <aside className="hidden w-56 flex-col border-r border-slate-200 bg-white py-6 px-3 shadow-sm md:flex">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Menú</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setVista(item.key)}
              className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                vista === item.key
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="mt-auto border-t border-slate-200 pt-4">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main content — único scroll aquí */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {vista === "escuelas" ? (
            <GestionEscuelas showToast={showToast} />
          ) : (
            <RespuestasDonadores showToast={showToast} />
          )}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-slate-200 bg-white md:hidden">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setVista(item.key)}
            className={`flex-1 py-3 text-xs font-semibold transition ${
              vista === item.key
                ? "border-t-2 border-emerald-700 text-emerald-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-[20px] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-700"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

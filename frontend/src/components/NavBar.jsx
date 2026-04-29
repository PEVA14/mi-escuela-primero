import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logoMEP.png";
import PopUpDonativos from "./PopUpDonativos";

export default function NavBar() {
  const navigate = useNavigate();
  const [showDonatePopup, setShowDonatePopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function openDonatePopup() {
    setShowDonatePopup(true);
    setMenuOpen(false);
  }

  function closeDonatePopup() {
    setShowDonatePopup(false);
  }

  function handleNav(path) {
    navigate(path);
    setMenuOpen(false);
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        {/* Top bar */}
        <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-5 py-3 md:px-8 lg:px-12">
          <button
            className="flex items-center gap-3 rounded-2xl bg-white text-left transition hover:opacity-90"
            onClick={() => handleNav("/")}
            type="button"
            aria-label="Ir al inicio"
          >
            <img
              className="h-12 w-auto object-contain md:h-14"
              src={logo}
              alt="Mi Escuela Primero Logo.png"
            />
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
              onClick={() => handleNav("/")}
              type="button"
            >
              Inicio
            </button>
            <button
              className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
              onClick={() => handleNav("/#movexp")}
              type="button"
            >
              Como funciona
            </button>
            <button
              className="rounded-2xl border border-amber-200 bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-amber-500"
              onClick={openDonatePopup}
              type="button"
            >
              Donar Ahora
            </button>
            <button
              className="rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              onClick={() => handleNav("/escuelas")}
              type="button"
            >
              Explorar Escuelas
            </button>
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 transition hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <span
              className={`block h-0.5 w-6 bg-slate-700 transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-slate-700 transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-slate-700 transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 pb-4 md:hidden">
            <div className="flex flex-col gap-1 pt-2">
              <button
                className="w-full rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
                onClick={() => handleNav("/")}
                type="button"
              >
                Inicio
              </button>
              <button
                className="w-full rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
                onClick={() => handleNav("/#movexp")}
                type="button"
              >
                Como funciona
              </button>
              <button
                className="w-full rounded-2xl border border-amber-200 bg-amber-400 px-4 py-2.5 text-left text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-amber-500"
                onClick={openDonatePopup}
                type="button"
              >
                Donar Ahora
              </button>
              <button
                className="w-full rounded-2xl bg-emerald-700 px-4 py-2.5 text-left text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                onClick={() => handleNav("/escuelas")}
                type="button"
              >
                Explorar Escuelas
              </button>
            </div>
          </div>
        )}
      </nav>
      {showDonatePopup && (
        <PopUpDonativos closePopup={closeDonatePopup} escuela={null} />
      )}
    </>
  );
}

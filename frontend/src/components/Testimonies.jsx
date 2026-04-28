import { useState } from "react";
import quotes from "../assets/quotes.png";
import pfp_icon from "../assets/pfp_icon.png";
import PopUpDonativos from "./PopUpDonativos";

export default function Testimonies() {
  const [showPopup, setShowPopup] = useState(false);

  function openPopup() {
    setShowPopup(true);
  }

  function closePopup() {
    setShowPopup(false);
  }

  return (
    <section
      id="testimonies"
      className="bg-white px-6 py-16 md:px-10 lg:px-14 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
            Testimonios reales
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl lg:text-5xl">
            Testimonios de Aliados
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
            Conoce las experiencias de quienes ya han apoyado nuestras escuelas
            y han visto el impacto real de su contribución.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article className="flex h-full min-h-[360px] flex-col rounded-[28px] border border-slate-200 bg-slate-50 p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <img
              src={quotes}
              className="h-10 w-10 object-contain opacity-55 hue-rotate-[85deg] saturate-150"
              alt="acotaciones.png"
            />
            <p className="mt-6 text-[1.02rem] leading-9 text-slate-600 italic">
              "Gracias a esta plataforma pudimos identificar fácilmente escuelas
              que necesitaban apoyo en nuestra región. El proceso fue
              transparente y pudimos ver el impacto directo de nuestra
              contribución."
            </p>
            <div className="mt-auto flex items-center gap-4 pt-8">
              <img
                src={pfp_icon}
                className="h-16 w-16 rounded-full object-cover"
                alt="profile picture.png"
              />
              <div>
                <h5 className="text-2xl font-bold text-slate-900">
                  María González
                </h5>
                <p className="mt-1 text-base leading-7 text-slate-500">
                  Directora de Responsabilidad Social, Grupo Industrial del
                  Norte
                </p>
              </div>
            </div>
          </article>

          <article className="flex h-full min-h-[360px] flex-col rounded-[28px] border border-slate-200 bg-slate-50 p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <img
              src={quotes}
              className="h-10 w-10 object-contain opacity-55 hue-rotate-[85deg] saturate-150"
              alt="acotaciones.png"
            />
            <p className="mt-6 text-[1.02rem] leading-9 text-slate-600 italic">
              "La claridad en la información y el seguimiento constante nos dio
              la confianza para apoyar a múltiples escuelas. Es una herramienta
              invaluable para conectar necesidades reales con quienes quieren
              ayudar."
            </p>
            <div className="mt-auto flex items-center gap-4 pt-8">
              <img
                src={pfp_icon}
                className="h-16 w-16 rounded-full object-cover"
                alt="profile picture.png"
              />
              <div>
                <h5 className="text-2xl font-bold text-slate-900">
                  Roberto Martínez
                </h5>
                <p className="mt-1 text-base leading-7 text-slate-500">
                  Fundación Educando Juntos
                </p>
              </div>
            </div>
          </article>

          <article className="flex h-full min-h-[360px] flex-col rounded-[28px] border border-slate-200 bg-slate-50 p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <img
              src={quotes}
              className="h-10 w-10 object-contain opacity-55 hue-rotate-[85deg] saturate-150"
              alt="acotaciones.png"
            />
            <p className="mt-6 text-[1.02rem] leading-9 text-slate-600 italic">
              "Como emprendedora, siempre quise retribuir a mi comunidad. Esta
              plataforma me permitió encontrar proyectos específicos donde mi
              apoyo realmente hace la diferencia."
            </p>
            <div className="mt-auto flex items-center gap-4 pt-8">
              <img
                src={pfp_icon}
                className="h-16 w-16 rounded-full object-cover"
                alt="profile picture.png"
              />
              <div>
                <h5 className="text-2xl font-bold text-slate-900">
                  Ana Sofía Ruiz
                </h5>
                <p className="mt-1 text-base leading-7 text-slate-500">
                  Empresaria independiente
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
            onClick={openPopup}
          >
            Quiero que se comuniquen conmigo
          </button>
        </div>
      </div>

      {showPopup && <PopUpDonativos closePopup={closePopup} escuela={null} />}
    </section>
  );
}

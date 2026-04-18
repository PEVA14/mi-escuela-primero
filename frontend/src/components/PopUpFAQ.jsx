import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PopUp from "./PopUp";

const faqItems = [
  {
    question: "¿A qué se destinan los donativos?",
    answer: (
      <p className="text-sm leading-7 text-slate-600 md:text-base">
        Los donativos recibidos son destinados directamente a las escuelas que forman parte del proyecto Mi Escuela Primero, escuelas de educación básica de sostenimiento público en contextos vulnerables. A través de una priorización de necesidades, destinamos cada apoyo a la escuela que más lo necesita.
      </p>
    ),
  },
  {
    question: "¿Cómo puedo realizar mi donativo?",
    answer: ({ openDonationPopup }) => (
      <p className="text-sm leading-7 text-slate-600 md:text-base">
        El primer paso para realizar tu donativo es llenar el formulario de contacto{" "}
        <button
          type="button"
          className="font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
          onClick={openDonationPopup}
        >
          aquí
        </button>
        . A partir de ahí, el personal de Mi Escuela Primero se pondrá en contacto contigo para realizar las gestiones necesarias y dar seguimiento a tu donación.
      </p>
    ),
  },
  {
    question: "¿Puedo donar en especie y qué artículos necesitan actualmente?",
    answer: (
      <p className="text-sm leading-7 text-slate-600 md:text-base">
        Sí, se puede donar en especie. Conoce nuestro apartado{" "}
        <Link className="font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800" to="/escuelas">
          aquí
        </Link>
        . A partir de ahí, el personal de Mi Escuela Primero se pondrá en contacto contigo para realizar las gestiones necesarias y dar seguimiento a tu donación.
      </p>
    ),
  },
  {
    question: "¿Qué impacto tiene mi donativo?",
    answer: (
      <p className="text-sm leading-7 text-slate-600 md:text-base">
        Cada aportación contribuye directamente a mejorar las condiciones y oportunidades de los niños, niñas y adolescentes de escuelas públicas en contextos vulnerables. Al momento de hacer la donación, te compartiremos los avances y resultados al correo que registras para que puedas conocer el impacto generado.
      </p>
    ),
  },
  {
    question: "¿Existe un monto mínimo para donar?",
    answer: (
      <p className="text-sm leading-7 text-slate-600 md:text-base">
        No, cualquier cantidad económica o de materiales suma y es bienvenida. Lo más importante es la intención de apoyar y formar parte del cambio.
      </p>
    ),
  },
  {
    question: "¿Puedo donar algo que no está dentro de las necesidades prioritarias de la escuela?",
    answer: (
      <p className="text-sm leading-7 text-slate-600 md:text-base">
        Sí, cualquier donación que pueda ser de utilidad para las escuelas, sus estudiantes, docentes, personal escolar o padres de familia es bienvenida. De esta manera seguimos fortaleciendo las comunidades educativas.
      </p>
    ),
  },
];

export default function PopUpFAQ({ closePopup }) {
  const [showPopup, setShowPopup] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(null);

  function toggleQuestion(index) {
    setOpenQuestion((prev) => (prev === index ? null : index));
  }

  function handleCloseAll() {
    setShowPopup(false);
    closePopup();
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        if (showPopup) {
          setShowPopup(false);
        } else {
          closePopup();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPopup, closePopup]);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-slate-900/55 px-4 py-6 backdrop-blur-sm md:py-10"
      onClick={handleCloseAll}
    >
      <div
        className="relative my-4 w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)] md:my-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-bold text-slate-500 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
          onClick={handleCloseAll}
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>

        <div className="pr-10">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
            Preguntas frecuentes
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-3xl">
            FAQ
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">
            Resolvemos algunas dudas comunes sobre los donativos y el proceso de apoyo.
          </p>
        </div>

        <div className="mt-6 grid max-h-[65vh] grid-cols-1 gap-4 overflow-y-auto pr-1">
          {faqItems.map((item, index) => {
            const isOpen = openQuestion === index;
            return (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => toggleQuestion(index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-100"
                >
                  <span className="text-base font-semibold text-slate-900">{item.question}</span>
                  <span className={`shrink-0 text-xl font-bold text-emerald-700 transition-transform ${isOpen ? "rotate-45" : "rotate-0"}`}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-200 px-4 py-4">
                    {typeof item.answer === "function"
                      ? item.answer({ openDonationPopup: () => setShowPopup(true) })
                      : item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showPopup && <PopUp closePopup={() => setShowPopup(false)} escuela={null} />}
    </div>
  );
}
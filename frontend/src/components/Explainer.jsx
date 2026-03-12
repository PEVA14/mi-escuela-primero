import lupa from "../assets/search-3820_64.png";
import heart from "../assets/heart-492_64.png";
import sendIcon from "../assets/send-4008_64.png";
import check from "../assets/check-mark-3279_64.png";

const steps = [
    {
        number: "1",
        icon: lupa,
        title: "Explora escuelas y necesidades",
        description:
            "Navega por nuestro catálogo interactivo y filtra por ubicación, categoría o prioridad para encontrar causas que resuenan contigo.",
    },
    {
        number: "2",
        icon: heart,
        title: "Selecciona una causa o proyecto",
        description:
            "Revisa los detalles de cada necesidad: descripción completa, monto requerido, progreso actual y nivel de prioridad.",
    },
    {
        number: "3",
        icon: sendIcon,
        title: "Envía tu interés mediante el formulario",
        description:
            "Completa un formulario simple con tus datos de contacto. Nosotros nos encargamos de conectarte con la escuela.",
    },
    {
        number: "4",
        icon: check,
        title: "La organización da seguimiento",
        description:
            "Nuestro equipo te contactará para coordinar los detalles de tu apoyo y asegurar que llegue directamente a quien lo necesita.",
    },
];

export default function Explainer() {
    return (
        <section id="explainer" className="bg-slate-50 px-6 py-16 md:px-10 lg:px-14 lg:py-20">
            <div className="mx-auto w-full max-w-[1280px]">
                <div className="mx-auto max-w-4xl text-center">
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
                        Proceso transparente
                    </span>
                    <h2 id = "movexp" className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl lg:text-5xl">
                        Cómo funciona
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                        Conectamos necesidades reales con aliados comprometidos en 4 pasos simples. El proceso es transparente, eficiente y fácil de seguir.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 xl:grid-cols-4 md:grid-cols-2">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative">
                            {index < steps.length - 1 && (
                                <span className="absolute left-[calc(100%-12px)] top-1/2 hidden h-[2px] w-6 -translate-y-1/2 bg-emerald-200 xl:block" />
                            )}

                            <article className="relative flex h-full min-h-[290px] flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                <div className="absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-md">
                                    {step.number}
                                </div>

                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                                    <img className="h-7 w-7 object-contain" src={step.icon} alt="" />
                                </div>

                                <h3 className="text-[1.45rem] font-bold leading-snug text-slate-900">
                                    {step.title}
                                </h3>
                                <p className="mt-4 text-base leading-8 text-slate-600">
                                    {step.description}
                                </p>
                            </article>
                        </div>
                    ))}
                </div>

                <div className="mx-auto mt-10 max-w-5xl rounded-[24px] border border-emerald-100 bg-emerald-50/60 px-6 py-5 text-center shadow-sm">
                    <p className="text-sm leading-7 text-slate-600 md:text-base">
                        <span className="font-semibold text-slate-900">Nota importante:</span> Todos tus datos se manejan con total confidencialidad de acuerdo con nuestro Aviso de Privacidad. Tu información solo se usa para coordinar el apoyo con las escuelas.
                    </p>
                </div>
            </div>
        </section>
    );
}
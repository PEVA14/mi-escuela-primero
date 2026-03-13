import { useState } from "react";
import privacyPDF from "../assets/AvisodePrivacidadMEP.pdf";

const instanceOptions = [
    { value: "empresa", label: "Empresa" },
    { value: "osc", label: "Organización de la sociedad civil" },
    { value: "institucion_educativa", label: "Institución educativa" },
    { value: "gobierno_municipal", label: "Gobierno municipal" },
    { value: "sin_instancia", label: "No represento una instancia" },
    { value: "otro", label: "Otro" },
];

function InputField({ label, required = false, ...props }) {
    return (
        <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-700">
                {label}{required ? " *" : ""}
            </label>
            <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                {...props}
            />
        </div>
    );
}

function SelectField({ label, required = false, children, ...props }) {
    return (
        <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-700">
                {label}{required ? " *" : ""}
            </label>
            <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                {...props}
            >
                {children}
            </select>
        </div>
    );
}

export default function PopUpDonativos({ closePopup, escuela }) {
    const [instanceType, setInstanceType] = useState("");
    const [otherInstance, setOtherInstance] = useState("");
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const requiresInstanceName = instanceType && instanceType !== "sin_instancia";

    function handleSubmit(event) {
        event.preventDefault();
        if (!acceptedPrivacy) return;
        setSubmitted(true);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/55 px-4 py-6 backdrop-blur-sm md:py-10">
            <div className="relative my-4 w-full max-w-xl max-h-[82vh] overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.22)] md:my-6 md:p-6">
                <button
                    className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-bold text-slate-500 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
                    onClick={closePopup}
                    aria-label="Cerrar"
                    type="button"
                >
                    ×
                </button>

                <div className="pr-10">
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
                        Formulario de aliados
                    </span>
                    <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-3xl">
                        {`Quiero que se comuniquen conmigo${escuela?.nombre ? ` - ${escuela.nombre}` : ""}`}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">
                        Completa tus datos y nuestro equipo se pondrá en contacto contigo para brindarte más información.
                    </p>
                </div>

                {submitted ? (
                    <div className="mt-6 rounded-[24px] border border-emerald-100 bg-emerald-50/80 px-5 py-6 text-slate-700">
                        <h3 className="text-xl font-bold text-slate-900">¡Gracias por contactarnos!</h3>
                        <p className="mt-3 text-sm leading-7 md:text-base">
                            Hemos recibido tu información y nuestro equipo dará seguimiento para ponerse en contacto contigo lo antes posible.
                        </p>
                        <div className="mt-5 flex justify-end">
                            <button
                                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                                type="button"
                                onClick={closePopup}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className="mt-6 grid max-h-[58vh] grid-cols-1 gap-4 overflow-y-auto pr-1" onSubmit={handleSubmit}>
                        <InputField
                            label="Nombre completo"
                            type="text"
                            placeholder="Tu nombre completo"
                            required
                        />

                        <SelectField
                            label="Tipo de instancia desde la que nos contactas"
                            value={instanceType}
                            onChange={(event) => setInstanceType(event.target.value)}
                            required
                        >
                            <option value="">Selecciona una opción</option>
                            {instanceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </SelectField>

                        {instanceType === "otro" && (
                            <InputField
                                label="Especifica el tipo de instancia"
                                type="text"
                                placeholder="Describe la instancia"
                                value={otherInstance}
                                onChange={(event) => setOtherInstance(event.target.value)}
                                required
                            />
                        )}

                        {requiresInstanceName && (
                            <InputField
                                label="Nombre de la instancia de la que nos contactas"
                                type="text"
                                placeholder="Nombre de la empresa, organización o institución"
                                required
                            />
                        )}

                        <InputField
                            label="Correo electrónico"
                            type="email"
                            placeholder="mi.correo@empresa.com"
                            required
                        />

                        <InputField
                            label="Celular de contacto"
                            type="tel"
                            placeholder="Tu número de contacto"
                            required
                        />

                        <InputField
                            label="Municipio y estado"
                            type="text"
                            placeholder="Ej. Zapopan, Jalisco"
                            required
                        />

                        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                            <input
                                className="mt-1 h-4 w-4 shrink-0 accent-emerald-600"
                                type="checkbox"
                                checked={acceptedPrivacy}
                                onChange={(event) => setAcceptedPrivacy(event.target.checked)}
                                required
                            />
                            <span>
                                Acepto el{" "}
                                <a
                                    className="font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
                                    href={privacyPDF}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    aviso de privacidad
                                </a>
                                .
                            </span>
                        </label>

                        <div className="flex justify-end pt-1">
                            <button
                                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                type="submit"
                                disabled={!acceptedPrivacy}
                            >
                                Enviar información
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
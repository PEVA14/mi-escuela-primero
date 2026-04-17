import { useMemo, useState } from "react";
import { crearRespuesta } from "../services/api";

const donationTypes = [
    { value: "formacion_familias", label: "Formación para familias", group: "formacion" },
    { value: "formacion_estudiantes", label: "Formación para estudiantes", group: "formacion" },
    { value: "formacion_docentes", label: "Formación a docentes", group: "formacion" },
    { value: "atencion_psicologica", label: "Atención psicológica para estudiantes", group: "psicologica" },
    { value: "material_tecnologico", label: "Material tecnológico", group: "material" },
    { value: "material_papeleria", label: "Material de papelería", group: "material" },
    { value: "material_literario", label: "Material literario", group: "material" },
    { value: "material_educacion_fisica", label: "Material de educación física", group: "material" },
    { value: "material_infraestructura", label: "Material de infraestructura", group: "material" },
    { value: "mobiliario", label: "Mobiliario", group: "material" },
    { value: "transporte", label: "Transporte", group: "apoyo" },
    { value: "condiciones_camino", label: "Condiciones del camino", group: "apoyo" },
    { value: "salud_fisica", label: "Salud física", group: "apoyo" },
    { value: "visitas_extraescolares", label: "Visitas extraescolares", group: "apoyo" },
    { value: "apoyo_gestion", label: "Apoyo en gestión", group: "apoyo" },
    { value: "otro", label: "Otro", group: "apoyo" },
];

const audienceOptions = [
    { value: "estudiantes", label: "Estudiantes" },
    { value: "docentes", label: "Docentes" },
    { value: "familias", label: "Familias" },
];

const logisticsOptions = [
    { value: "flete_escuela", label: "Puedo poner flete hasta la escuela" },
    { value: "llevar_oficina", label: "Puedo llevarlo a la oficina" },
    { value: "pasar_recoger", label: "Habría que pasar por ello" },
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

function TextareaField({ label, required = false, className = "", ...props }) {
    return (
        <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-700">
                {label}{required ? " *" : ""}
            </label>
            <textarea
                className={`min-h-[96px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${className}`}
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

export default function PopUp({ closePopup, escuela }) {
    const [donationType, setDonationType] = useState("");
    const [otherDonationType, setOtherDonationType] = useState("");
    const [audiences, setAudiences] = useState([]);
    const [logistics, setLogistics] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    // Contact fields
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [empresa, setEmpresa] = useState("");

    // Conditional fields
    const [tema, setTema] = useState("");
    const [horas, setHoras] = useState("");
    const [articulo, setArticulo] = useState("");
    const [cantidadArticulos, setCantidadArticulos] = useState("");
    const [direccionRecogida, setDireccionRecogida] = useState("");
    const [descripcionApoyo, setDescripcionApoyo] = useState("");
    const [mensajeAdicional, setMensajeAdicional] = useState("");

    const selectedType = useMemo(
        () => donationTypes.find((type) => type.value === donationType),
        [donationType]
    );

    const donationGroup = selectedType?.group || "";

    function handleAudienceChange(value) {
        setAudiences((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        const tipoLabel = donationType === "otro"
            ? otherDonationType
            : selectedType?.label || donationType;

        // Build detalles from the conditional fields specific to each donation group
        let detalles = "";
        if (donationGroup === "formacion") {
            detalles = [
                tema          && `Tema: ${tema}`,
                audiences.length && `Público: ${audiences.join(", ")}`,
                horas         && `Horas/sesiones: ${horas}`,
            ].filter(Boolean).join(" | ");
        } else if (donationGroup === "psicologica") {
            detalles = [
                audiences.length && `Público: ${audiences.join(", ")}`,
                horas         && `Horas/sesiones: ${horas}`,
            ].filter(Boolean).join(" | ");
        } else if (donationGroup === "material") {
            const logisticaLabel = logisticsOptions.find(o => o.value === logistics)?.label || logistics;
            detalles = [
                articulo          && `Artículo: ${articulo}`,
                cantidadArticulos && `Cantidad: ${cantidadArticulos}`,
                logisticaLabel    && `Logística: ${logisticaLabel}`,
                direccionRecogida && `Dirección recogida: ${direccionRecogida}`,
            ].filter(Boolean).join(" | ");
        } else if (donationGroup === "apoyo") {
            detalles = descripcionApoyo;
        }

        try {
            await crearRespuesta({
                nombre,
                correo,
                telefono,
                empresa,
                tipo_apoyo: tipoLabel,
                cantidad: cantidadArticulos || horas || "",
                detalles,
                mensaje: mensajeAdicional,
                id_escuela: escuela?.id_escuela ?? null,
            });
            setSubmitted(true);
        } catch (err) {
            setError("Ocurrió un error al enviar tu información. Por favor intenta de nuevo.");
        }
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
                        Formulario de apoyo
                    </span>
                    <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-3xl">
                        {`Apoyar a ${escuela?.nombre}`}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">
                        Completa el formulario y nuestro equipo te contactará para coordinar el apoyo.
                    </p>
                </div>

                {submitted ? (
                    <div className="mt-6 rounded-[24px] border border-emerald-100 bg-emerald-50/80 px-5 py-6 text-slate-700">
                        <h3 className="text-xl font-bold text-slate-900">Gracias por ser parte del cambio.</h3>
                        <p className="mt-3 text-sm leading-7 md:text-base">
                            Tu donativo representa una oportunidad más para seguir transformando vidas. En menos de 48 horas nos pondremos en contacto contigo para dar seguimiento y realizar las gestiones necesarias para que tu apoyo llegue a las escuelas.
                        </p>
                        <p className="mt-3 text-sm leading-7 md:text-base">
                            Te pedimos estar atento a tu correo y celular. ¡Gracias por creer y actuar!
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
                            label="Nombre Completo"
                            type="text"
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />

                        <InputField
                            label="Correo Electrónico"
                            type="email"
                            placeholder="mi.correo@empresa.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />

                        <InputField
                            label="Celular"
                            type="tel"
                            placeholder="Tu número de contacto"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />

                        <InputField
                            label="Empresa u Organización (opcional)"
                            type="text"
                            placeholder="Nombre de tu empresa u organización"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                        />

                        <SelectField
                            label="Tipo de donativo"
                            value={donationType}
                            onChange={(event) => setDonationType(event.target.value)}
                            required
                        >
                            <option value="">Selecciona un tipo de donativo</option>
                            {donationTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </SelectField>

                        {donationType === "otro" && (
                            <InputField
                                label="Especifica el tipo de donativo"
                                type="text"
                                placeholder="Describe el tipo de apoyo"
                                value={otherDonationType}
                                onChange={(event) => setOtherDonationType(event.target.value)}
                                required
                            />
                        )}

                        <InputField
                            label="Escuela(s) destino"
                            type="text"
                            placeholder={escuela?.nombre || "Escribe la escuela o escuelas"}
                            defaultValue={escuela?.nombre || ""}
                            readOnly={!!escuela?.nombre}
                            required
                        />

                        {donationGroup === "formacion" && (
                            <>
                                <InputField
                                    label="Tema de formación que desean impartir"
                                    type="text"
                                    placeholder="Ej. habilidades socioemocionales, lectura, tecnología..."
                                    value={tema}
                                    onChange={(e) => setTema(e.target.value)}
                                    required
                                />

                                <div className="grid gap-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Público al que va dirigido *
                                    </label>
                                    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                        {audienceOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-3 text-sm text-slate-700">
                                                <input
                                                    className="h-4 w-4 accent-emerald-600"
                                                    type="checkbox"
                                                    checked={audiences.includes(option.value)}
                                                    onChange={() => handleAudienceChange(option.value)}
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <InputField
                                    label="Número de horas y/o sesiones"
                                    type="text"
                                    placeholder="Ej. 8 sesiones de 2 horas"
                                    value={horas}
                                    onChange={(e) => setHoras(e.target.value)}
                                    required
                                />
                            </>
                        )}

                        {donationGroup === "psicologica" && (
                            <>
                                <div className="grid gap-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Público al que va dirigido *
                                    </label>
                                    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                        {audienceOptions.map((option) => (
                                            <label key={option.value} className="flex items-center gap-3 text-sm text-slate-700">
                                                <input
                                                    className="h-4 w-4 accent-emerald-600"
                                                    type="checkbox"
                                                    checked={audiences.includes(option.value)}
                                                    onChange={() => handleAudienceChange(option.value)}
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <InputField
                                    label="Número de horas y/o sesiones"
                                    type="text"
                                    placeholder="Ej. 10 sesiones semanales"
                                    value={horas}
                                    onChange={(e) => setHoras(e.target.value)}
                                    required
                                />
                            </>
                        )}

                        {donationGroup === "material" && (
                            <>
                                <InputField
                                    label="Artículo a donar"
                                    type="text"
                                    placeholder="Ej. pupitres, laptops, libros, pintura..."
                                    value={articulo}
                                    onChange={(e) => setArticulo(e.target.value)}
                                    required
                                />

                                <InputField
                                    label="Cantidad de artículos a donar"
                                    type="number"
                                    min="1"
                                    placeholder="Cantidad"
                                    value={cantidadArticulos}
                                    onChange={(e) => setCantidadArticulos(e.target.value)}
                                    required
                                />

                                <SelectField
                                    label="Logística de entrega"
                                    value={logistics}
                                    onChange={(event) => setLogistics(event.target.value)}
                                    required
                                >
                                    <option value="">Selecciona una opción</option>
                                    {logisticsOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </SelectField>

                                {logistics === "pasar_recoger" && (
                                    <TextareaField
                                        label="Dirección para recoger el donativo"
                                        placeholder="Comparte la dirección completa y referencias"
                                        value={direccionRecogida}
                                        onChange={(e) => setDireccionRecogida(e.target.value)}
                                        required
                                        className="min-h-[88px]"
                                    />
                                )}
                            </>
                        )}

                        {donationGroup === "apoyo" && (
                            <TextareaField
                                label="Descripción del tipo de apoyo"
                                placeholder="Describe cómo te gustaría apoyar a la escuela"
                                value={descripcionApoyo}
                                onChange={(e) => setDescripcionApoyo(e.target.value)}
                                required
                                className="min-h-[88px]"
                            />
                        )}

                        <TextareaField
                            label="Mensaje Adicional (opcional)"
                            placeholder="Cuéntanos más sobre tu interés en apoyar..."
                            value={mensajeAdicional}
                            onChange={(e) => setMensajeAdicional(e.target.value)}
                        />

                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-600">
                            <p>
                                <span className="font-semibold text-slate-900">Protección de datos:</span> Tus datos se manejarán conforme a nuestro Aviso de Privacidad y únicamente se utilizarán para coordinar el apoyo con las escuelas.
                            </p>
                        </div>

                        {error && (
                            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end pt-1">
                            <button
                                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                                type="submit"
                            >
                                Enviar Interés
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

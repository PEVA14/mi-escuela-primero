import { useState } from "react";
import privacyPDF from "../assets/AvisodePrivacidadMEP.pdf";
import { crearRespuesta } from "../services/api";
import { validateFormBeforeSubmit } from "../utils/formValidation";

const instanceOptions = [
  { value: "empresa", label: "Empresa" },
  { value: "osc", label: "Organización de la sociedad civil" },
  { value: "institucion_educativa", label: "Institución educativa" },
  { value: "gobierno_municipal", label: "Gobierno municipal" },
  { value: "sin_instancia", label: "No represento una instancia" },
  { value: "otro", label: "Otro" },
];

function InputField({
  label,
  required = false,
  invalid = false,
  warning,
  ...props
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
          invalid
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        }`}
        {...props}
      />
      {invalid && warning && (
        <p className="text-xs font-medium text-red-600">{warning}</p>
      )}
    </div>
  );
}

function SelectField({
  label,
  required = false,
  children,
  invalid = false,
  warning,
  ...props
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required ? " *" : ""}
      </label>
      <select
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition ${
          invalid
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        }`}
        {...props}
      >
        {children}
      </select>
      {invalid && warning && (
        <p className="text-xs font-medium text-red-600">{warning}</p>
      )}
    </div>
  );
}

export default function PopUpDonativos({ closePopup, escuela }) {
  const [instanceType, setInstanceType] = useState("");
  const [otherInstance, setOtherInstance] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [municipioEstado, setMunicipioEstado] = useState("");
  const [nombreInstancia, setNombreInstancia] = useState("");

  const requiresInstanceName = instanceType && instanceType !== "sin_instancia";
  const warningText = "Por favor llena este espacio";
  const isInvalid = (fieldName) => invalidFields.includes(fieldName);

  function clearFieldError(fieldName) {
    setInvalidFields((prev) => prev.filter((item) => item !== fieldName));
  }

  function markInvalidFields(fields) {
    setInvalidFields(fields);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateFormBeforeSubmit(event, setError, setInvalidFields)) return;
    setError(null);
    try {
      await crearRespuesta({
        form_type: "contacto",
        nombre,
        correo,
        telefono,
        empresa: nombreInstancia,
        instancia_donante:
          instanceType === "otro" ? otherInstance : instanceType,
        municipio_donante: municipioEstado,
        id_escuela: escuela?.id_escuela ?? null,
      });
      setSubmitted(true);
    } catch (err) {
      const serverMessage = err?.response?.data?.mensaje;
      if (serverMessage === "Nombre, correo y teléfono son obligatorios") {
        markInvalidFields(
          ["nombre", "correo", "telefono"].filter((field) => {
            const values = { nombre, correo, telefono };
            return !values[field]?.trim();
          }),
        );
        return;
      }

      if (
        serverMessage ===
        "Instancia, nombre de la instancia y municipio son obligatorios"
      ) {
        markInvalidFields(
          [
            !instanceType.trim() && "instancia_donante",
            requiresInstanceName && !nombreInstancia.trim() && "empresa",
            !municipioEstado.trim() && "municipio_donante",
          ].filter(Boolean),
        );
        return;
      }

      setError(
        serverMessage ||
          "Ocurrió un error al enviar tu información. Por favor intenta de nuevo.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-slate-900/55 px-4 py-6 backdrop-blur-sm md:py-10">
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
            Completa tus datos y nuestro equipo se pondrá en contacto contigo
            para brindarte más información.
          </p>
        </div>

        {submitted ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/80 px-5 py-5 text-slate-700">
              <h3 className="text-xl font-bold text-slate-900">
                ¡Gracias por contactarnos!
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Hemos recibido tu información y nuestro equipo se pondrá en
                contacto contigo lo antes posible.
              </p>
            </div>

            {/* Submission summary */}
            <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                Resumen de tu registro
              </p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Nombre</dt>
                  <dd className="text-right text-slate-800">{nombre}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Correo</dt>
                  <dd className="text-right text-slate-800">{correo}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Teléfono</dt>
                  <dd className="text-right text-slate-800">{telefono}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">
                    Tipo de instancia
                  </dt>
                  <dd className="text-right text-slate-800">
                    {instanceType === "otro"
                      ? otherInstance ||
                        instanceOptions.find((o) => o.value === instanceType)
                          ?.label
                      : instanceOptions.find((o) => o.value === instanceType)
                          ?.label || instanceType}
                  </dd>
                </div>
                {nombreInstancia && (
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-slate-600">Instancia</dt>
                    <dd className="text-right text-slate-800">
                      {nombreInstancia}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="font-semibold text-slate-600">Municipio</dt>
                  <dd className="text-right text-slate-800">{municipioEstado}</dd>
                </div>
              </dl>
            </div>

            <div className="flex justify-end">
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
          <form
            className="mt-6 grid max-h-[58vh] grid-cols-1 gap-4 overflow-y-auto pr-1"
            onSubmit={handleSubmit}
            noValidate
            onInputCapture={() => error && setError(null)}
            onChangeCapture={() => error && setError(null)}
          >
            <InputField
              label="Nombre completo"
              name="nombre"
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                clearFieldError("nombre");
              }}
              invalid={isInvalid("nombre")}
              warning={warningText}
              required
            />

            <SelectField
              label="Tipo de instancia desde la que nos contactas"
              name="instancia_donante"
              value={instanceType}
              onChange={(event) => {
                setInstanceType(event.target.value);
                clearFieldError("instancia_donante");
              }}
              invalid={isInvalid("instancia_donante")}
              warning={warningText}
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
                name="otra_instancia"
                type="text"
                placeholder="Describe la instancia"
                value={otherInstance}
                onChange={(event) => {
                  setOtherInstance(event.target.value);
                  clearFieldError("otra_instancia");
                }}
                invalid={isInvalid("otra_instancia")}
                warning={warningText}
                required
              />
            )}

            {requiresInstanceName && (
              <InputField
                label="Nombre de la instancia de la que nos contactas"
                name="empresa"
                type="text"
                placeholder="Nombre de la empresa, organización o institución"
                value={nombreInstancia}
                onChange={(e) => {
                  setNombreInstancia(e.target.value);
                  clearFieldError("empresa");
                }}
                invalid={isInvalid("empresa")}
                warning={warningText}
                required
              />
            )}

            <InputField
              label="Correo electrónico"
              name="correo"
              type="email"
              placeholder="mi.correo@empresa.com"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                clearFieldError("correo");
              }}
              invalid={isInvalid("correo")}
              warning={warningText}
              required
            />

            <InputField
              label="Celular de contacto"
              name="telefono"
              type="tel"
              placeholder="Tu número de contacto"
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);
                clearFieldError("telefono");
              }}
              invalid={isInvalid("telefono")}
              warning={warningText}
              required
            />

            <InputField
              label="Municipio y estado"
              name="municipio_donante"
              type="text"
              placeholder="Ej. Zapopan, Jalisco"
              value={municipioEstado}
              onChange={(e) => {
                setMunicipioEstado(e.target.value);
                clearFieldError("municipio_donante");
              }}
              invalid={isInvalid("municipio_donante")}
              warning={warningText}
              required
            />

            <div className="grid gap-2">
              <label
                className={`flex items-start gap-3 rounded-2xl border px-4 py-4 text-sm leading-6 ${
                  isInvalid("acepto_privacidad")
                    ? "border-red-400 bg-red-50 text-red-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                <input
                  className="mt-1 h-4 w-4 shrink-0 accent-emerald-600"
                  type="checkbox"
                  name="acepto_privacidad"
                  checked={acceptedPrivacy}
                  onChange={(event) => {
                    setAcceptedPrivacy(event.target.checked);
                    clearFieldError("acepto_privacidad");
                  }}
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
              {isInvalid("acepto_privacidad") && (
                <p className="text-xs font-medium text-red-600">
                  {warningText}
                </p>
              )}
            </div>

            {error && invalidFields.length === 0 && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
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

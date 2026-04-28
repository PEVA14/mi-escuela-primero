import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { validateFormBeforeSubmit } from "../utils/formValidation";

export default function LoginForm() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [invalidFields, setInvalidFields] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const warningText = "Por favor llena este espacio";
  const inputCls = (fieldName) =>
    `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
      invalidFields.includes(fieldName)
        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
    }`;

  function clearFieldError(fieldName) {
    setInvalidFields((prev) => prev.filter((item) => item !== fieldName));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateFormBeforeSubmit(e, null, setInvalidFields)) return;

    try {
      const res = await login({ correo, contraseña });
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (err) {
      const msg = err?.response?.data?.mensaje;
      setError(msg || "Credenciales incorrectas");
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-10">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
            Acceso administrador
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-900">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">
            Ingresa tus credenciales para acceder al panel.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-5">
          <div className="grid gap-2 text-left">
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="correo"
            >
              Correo electrónico
            </label>
            <input
              className={inputCls("correo")}
              id="correo"
              name="correo"
              type="email"
              placeholder="admin@miescuela.mx"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                clearFieldError("correo");
              }}
              required
            />
            {invalidFields.includes("correo") && (
              <p className="text-xs font-medium text-red-600">{warningText}</p>
            )}
          </div>

          <div className="grid gap-2 text-left">
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="contraseña"
            >
              Contraseña
            </label>
            <input
              className={inputCls("contraseña")}
              id="contraseña"
              name="contraseña"
              type="password"
              placeholder="Tu contraseña"
              value={contraseña}
              onChange={(e) => {
                setContraseña(e.target.value);
                clearFieldError("contraseña");
              }}
              required
            />
            {invalidFields.includes("contraseña") && (
              <p className="text-xs font-medium text-red-600">{warningText}</p>
            )}
          </div>

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
            type="submit"
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <span className="text-base">←</span>
            <span>Regresar a home</span>
          </button>
        </form>
      </div>
    </div>
  );
}

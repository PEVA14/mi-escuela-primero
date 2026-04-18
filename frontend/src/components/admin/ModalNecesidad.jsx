import { useState, useEffect } from "react";
import { crearNecesidad, updateNecesidad } from "../../services/api";

const CATEGORIAS = ["infraestructura", "material", "formacion", "salud", "otro"];
const PRIORIDADES = ["Alta", "Media", "Baja"];
const ESTADOS = ["Pendiente", "En progreso", "Completada"];

const EMPTY = {
  titulo: "",
  descripcion: "",
  categoria: "material",
  prioridad: "Media",
  monto_requerido: "",
  monto_recaudado: "",
  estado: "Pendiente",
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";
const labelCls = "text-xs font-bold uppercase tracking-wide text-slate-600";

export default function ModalNecesidad({ open, necesidad, id_escuela, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = !!necesidad;

  useEffect(() => {
    if (open) {
      setForm(necesidad ? { ...necesidad } : { ...EMPTY });
      setError(null);
    }
  }, [open, necesidad]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const missingRequired = [!form.titulo.trim() && "Título"].filter(Boolean);

  async function handleSubmit(e) {
    e.preventDefault();
    if (missingRequired.length) {
      setError(`Campos obligatorios: ${missingRequired.join(", ")}`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const datos = {
        ...form,
        id_escuela,
        monto_requerido: parseFloat(form.monto_requerido) || 0,
        monto_recaudado: parseFloat(form.monto_recaudado) || 0,
      };
      if (isEditing) {
        await updateNecesidad(necesidad.id_necesidad, datos);
      } else {
        await crearNecesidad(datos);
      }
      onSuccess();
    } catch {
      setError("Error al guardar la necesidad. Verifica que tu sesión esté activa.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] bg-white shadow-xl">
        <div className="bg-emerald-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {isEditing ? "Editar Necesidad" : "Nueva Necesidad"}
          </h2>
          <p className="text-sm text-emerald-200">
            {isEditing ? "Modifica los datos de esta necesidad" : "Registra una nueva necesidad para esta escuela"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-6">
          <div className="col-span-2 grid gap-1.5">
            <label className={labelCls}>Título *</label>
            <input
              className={inputCls}
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej. Pintura para salones"
              required
              aria-required="true"
            />
          </div>

          <div className="col-span-2 grid gap-1.5">
            <label className={labelCls}>Descripción</label>
            <textarea
              className={`${inputCls} resize-none`}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={2}
              placeholder="Descripción detallada de la necesidad..."
            />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Categoría</label>
            <select className={inputCls} name="categoria" value={form.categoria} onChange={handleChange}>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Prioridad</label>
            <select className={inputCls} name="prioridad" value={form.prioridad} onChange={handleChange}>
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Monto requerido ($)</label>
            <input
              className={inputCls}
              name="monto_requerido"
              type="number"
              min="0"
              value={form.monto_requerido}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Monto recaudado ($)</label>
            <input
              className={inputCls}
              name="monto_recaudado"
              type="number"
              min="0"
              value={form.monto_recaudado}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="col-span-2 grid gap-1.5">
            <label className={labelCls}>Estado</label>
            <select className={inputCls} name="estado" value={form.estado} onChange={handleChange}>
              {ESTADOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-3 border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || missingRequired.length > 0}
              title={missingRequired.length ? `Campos obligatorios: ${missingRequired.join(", ")}` : ""}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear necesidad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

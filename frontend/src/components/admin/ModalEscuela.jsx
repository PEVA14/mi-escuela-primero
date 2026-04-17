import { useState, useEffect } from "react";
import { agregarEscuela, updateEscuela } from "../../services/api";

const NIVELES = ["Preescolar", "Primaria", "Secundaria", "Bachillerato", "Otro"];
const MODALIDADES = ["SEP-General", "SEP-Multigrado", "CONAFE", "Indígena", "Telesecundaria", "Otra"];
const TURNOS = ["Matutino", "Vespertino", "Nocturno", "Mixto"];
const SOSTENIMIENTOS = ["Estatal", "Federal", "Federalizado", "Privado", "Autónomo"];
const EMPTY = {
  nombre: "",
  plantel: "",
  municipio: "",
  direccion: "",
  ubicacion: "",
  cct: "",
  personal_escolar: "",
  estudiantes: "",
  nivelEducativo: "Primaria",
  modalidad: "SEP-General",
  turno: "Matutino",
  sostenimiento: "Federal",
  fotos: [],
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";
const labelCls = "text-xs font-bold uppercase tracking-wide text-slate-600";

export default function ModalEscuela({ open, escuela, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = !!escuela;

  useEffect(() => {
    if (open) {
      const initial = escuela ? { ...EMPTY, ...escuela } : { ...EMPTY };
      initial.fotos = Array.isArray(initial.fotos) ? [...initial.fotos] : [];
      setForm(initial);
      setError(null);
    }
  }, [open, escuela]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFotoChange(i, value) {
    const next = [...form.fotos];
    next[i] = value;
    setForm({ ...form, fotos: next });
  }

  function handleFotoAdd() {
    setForm({ ...form, fotos: [...form.fotos, ""] });
  }

  function handleFotoRemove(i) {
    setForm({ ...form, fotos: form.fotos.filter((_, idx) => idx !== i) });
  }

  const missingRequired = [
    !form.nombre.trim() && "Nombre",
    !form.municipio.trim() && "Municipio",
    !form.cct.trim() && "CCT",
  ].filter(Boolean);

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
        personal_escolar: parseInt(form.personal_escolar) || 0,
        estudiantes: parseInt(form.estudiantes) || 0,
        fotos: form.fotos.map(f => f.trim()).filter(Boolean),
      };
      if (isEditing) {
        await updateEscuela(escuela.id_escuela, datos);
      } else {
        await agregarEscuela(datos);
      }
      onSuccess();
    } catch {
      setError("Error al guardar. Verifica que tu sesión esté activa.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-white shadow-xl">
        <div className="flex-shrink-0 bg-emerald-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {isEditing ? "Editar Escuela" : "Nueva Escuela"}
          </h2>
          <p className="text-sm text-emerald-200">
            {isEditing ? "Modifica los datos de la escuela" : "Registra una nueva escuela en el catálogo"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 overflow-y-auto p-6">
          <div className="col-span-2 grid gap-1.5">
            <label className={labelCls}>Nombre *</label>
            <input
              className={inputCls}
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre oficial de la escuela"
              required
              aria-required="true"
            />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Plantel</label>
            <input
              className={inputCls}
              name="plantel"
              value={form.plantel}
              onChange={handleChange}
              placeholder="Nombre del plantel"
            />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Municipio *</label>
            <input
              className={inputCls}
              name="municipio"
              value={form.municipio}
              onChange={handleChange}
              placeholder="Municipio"
              required
              aria-required="true"
            />
          </div>

          <div className="col-span-2 grid gap-1.5">
            <label className={labelCls}>Dirección</label>
            <input
              className={inputCls}
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección completa"
            />
          </div>

          <div className="col-span-2 grid gap-1.5">
            <label className={labelCls}>URL Google Maps</label>
            <input
              className={inputCls}
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>CCT *</label>
            <input
              className={inputCls}
              name="cct"
              value={form.cct}
              onChange={handleChange}
              placeholder="Ej. 14DPR1234X"
              required
              aria-required="true"
            />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Nivel Educativo</label>
            <select className={inputCls} name="nivelEducativo" value={form.nivelEducativo} onChange={handleChange}>
              {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Modalidad</label>
            <select className={inputCls} name="modalidad" value={form.modalidad} onChange={handleChange}>
              {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Turno</label>
            <select className={inputCls} name="turno" value={form.turno} onChange={handleChange}>
              {TURNOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Sostenimiento</label>
            <select className={inputCls} name="sostenimiento" value={form.sostenimiento} onChange={handleChange}>
              {SOSTENIMIENTOS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Estudiantes</label>
            <input
              className={inputCls}
              name="estudiantes"
              type="number"
              min="0"
              value={form.estudiantes}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Personal Escolar</label>
            <input
              className={inputCls}
              name="personal_escolar"
              type="number"
              min="0"
              value={form.personal_escolar}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <div className="col-span-2 grid gap-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>Fotos (links)</label>
              <button
                type="button"
                onClick={handleFotoAdd}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                + Agregar foto
              </button>
            </div>
            {form.fotos.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Sin fotos. Haz clic en "Agregar foto" para pegar un link.
              </p>
            ) : (
              <div className="grid gap-2">
                {form.fotos.map((url, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className={inputCls}
                      value={url}
                      onChange={(e) => handleFotoChange(i, e.target.value)}
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => handleFotoRemove(i)}
                      aria-label="Quitar foto"
                      className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear escuela"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

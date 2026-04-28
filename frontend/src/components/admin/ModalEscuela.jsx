import { useState, useEffect, useRef, useCallback } from "react";
import { agregarEscuela, updateEscuela, uploadFotos, deleteFoto } from "../../services/api";
import { validateFormBeforeSubmit } from "../../utils/formValidation";

const NIVELES       = ["Preescolar", "Primaria", "Secundaria", "Bachillerato", "Otro"];
const MODALIDADES   = ["SEP-General", "SEP-Multigrado", "CONAFE", "Indígena", "Telesecundaria", "Otra"];
const TURNOS        = ["Matutino", "Vespertino", "Nocturno", "Mixto"];
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
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";
const labelCls = "text-xs font-bold uppercase tracking-wide text-slate-600";

export default function ModalEscuela({ open, escuela, onClose, onSuccess }) {
  const [form, setForm]               = useState(EMPTY);
  const [existingFotos, setExisting]  = useState([]);
  const [newFiles, setNewFiles]       = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [toDelete, setToDelete]       = useState([]);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);

  const fileInputRef   = useRef(null);
  const photoSectionRef = useRef(null);
  const isEditing = !!escuela;

  useEffect(() => {
    if (open) {
      const { fotos: _, ...rest } = escuela ?? {};
      setForm(escuela ? { ...EMPTY, ...rest } : { ...EMPTY });
      setExisting(Array.isArray(escuela?.fotos) ? [...escuela.fotos] : []);
      setNewFiles([]);
      setPreviewUrls([]);
      setToDelete([]);
      setError(null);
      setInvalidFields([]);
    }
  }, [open, escuela]);

  useEffect(() => {
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newFiles]);

  function handleChange(e) {
    setInvalidFields((prev) => prev.filter((item) => item !== e.target.name));
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleFilePick = useCallback((e) => {
    const picked = Array.from(e.target.files);
    if (!picked.length) return;
    setNewFiles((prev) => [...prev, ...picked]);
    e.target.value = "";
    setTimeout(() => {
      photoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 80);
  }, []);

  function handleNewFileRemove(index) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleExistingRemove(id_foto) {
    setToDelete((prev) => [...prev, id_foto]);
    setExisting((prev) => prev.filter((f) => f.id_foto !== id_foto));
  }

  const warningText = "Por favor llena este espacio";
  const fieldCls = (fieldName) =>
    `${inputCls.split(" border-slate-200").join("")} ${
      invalidFields.includes(fieldName)
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
    }`;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateFormBeforeSubmit(e, null, setInvalidFields)) return;
    setSaving(true);
    setError(null);
    try {
      const datos = {
        ...form,
        personal_escolar: parseInt(form.personal_escolar) || 0,
        estudiantes:       parseInt(form.estudiantes)      || 0,
      };

      let schoolId;
      if (isEditing) {
        await updateEscuela(escuela.id_escuela, datos);
        schoolId = escuela.id_escuela;
      } else {
        const res = await agregarEscuela(datos);
        schoolId = res.data.escuela.id_escuela;
      }

      if (newFiles.length > 0) {
        await uploadFotos(schoolId, newFiles);
      }

      for (const id_foto of toDelete) {
        await deleteFoto(id_foto);
      }

      onSuccess();
    } catch (err) {
      const serverMsg = err?.response?.data?.mensaje;
      setError(serverMsg || "Error al guardar. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const totalFotos = existingFotos.length + newFiles.length;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-white shadow-xl">

        {/* Header */}
        <div className="flex-shrink-0 bg-emerald-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {isEditing ? "Editar Escuela" : "Nueva Escuela"}
          </h2>
          <p className="text-sm text-emerald-200">
            {isEditing
              ? "Modifica los datos de la escuela"
              : "Registra una nueva escuela en el catálogo"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 overflow-y-auto p-6">

          <div ref={photoSectionRef} className="col-span-2 grid gap-3">
            <div className="flex items-center justify-between">
              <label className={labelCls}>
                Fotos
                {totalFotos > 0 && (
                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                    {totalFotos}
                  </span>
                )}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilePick}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 active:scale-95"
              >
                + Subir imágenes
              </button>
            </div>

            {totalFotos === 0 ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <span className="block text-2xl mb-1">📷</span>
                Haz clic aquí o en "Subir imágenes" para agregar fotos
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {existingFotos.map((foto) => (
                  <div
                    key={foto.id_foto}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={foto.url}
                      alt="foto guardada"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleExistingRemove(foto.id_foto)}
                      aria-label="Eliminar foto"
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white opacity-0 shadow transition group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {previewUrls.map((url, i) => (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-emerald-300 bg-slate-100"
                  >
                    <img
                      src={url}
                      alt={newFiles[i]?.name ?? `foto ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-700/80 py-0.5 text-center text-[10px] font-semibold text-white">
                      Nueva
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNewFileRemove(i)}
                      aria-label="Quitar foto"
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white opacity-0 shadow transition group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2 border-t border-slate-100" />

          <div className="col-span-2 grid gap-1.5">
            <label className={labelCls}>Nombre *</label>
            <input className={fieldCls("nombre")} name="nombre" value={form.nombre}
              onChange={handleChange} placeholder="Nombre oficial de la escuela"
              required aria-required="true" />
            {invalidFields.includes("nombre") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Plantel</label>
            <input className={inputCls} name="plantel" value={form.plantel}
              onChange={handleChange} placeholder="Nombre del plantel" />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Municipio *</label>
            <input className={fieldCls("municipio")} name="municipio" value={form.municipio}
              onChange={handleChange} placeholder="Municipio"
              required aria-required="true" />
            {invalidFields.includes("municipio") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
          </div>

          <div className="col-span-2 grid gap-1.5">
            <label className={labelCls}>Dirección</label>
            <input className={inputCls} name="direccion" value={form.direccion}
              onChange={handleChange} placeholder="Dirección completa" />
          </div>

          <div className="col-span-2 grid gap-1.5">
            <label className={labelCls}>URL Google Maps</label>
            <input className={inputCls} name="ubicacion" value={form.ubicacion}
              onChange={handleChange} placeholder="https://maps.app.goo.gl/..." />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>CCT *</label>
            <input className={fieldCls("cct")} name="cct" value={form.cct}
              onChange={handleChange} placeholder="Ej. 14DPR1234X"
              required aria-required="true" />
            {invalidFields.includes("cct") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Nivel Educativo</label>
            <select className={inputCls} name="nivelEducativo" value={form.nivelEducativo} onChange={handleChange}>
              {NIVELES.map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Modalidad</label>
            <select className={inputCls} name="modalidad" value={form.modalidad} onChange={handleChange}>
              {MODALIDADES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Turno</label>
            <select className={inputCls} name="turno" value={form.turno} onChange={handleChange}>
              {TURNOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Sostenimiento</label>
            <select className={inputCls} name="sostenimiento" value={form.sostenimiento} onChange={handleChange}>
              {SOSTENIMIENTOS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Estudiantes</label>
            <input className={inputCls} name="estudiantes" type="number" min="0"
              value={form.estudiantes} onChange={handleChange} placeholder="0" />
          </div>

          <div className="grid gap-1.5">
            <label className={labelCls}>Personal Escolar</label>
            <input className={inputCls} name="personal_escolar" type="number" min="0"
              value={form.personal_escolar} onChange={handleChange} placeholder="0" />
          </div>

          {error && (
            <div className="col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-3 border-t border-slate-100 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
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

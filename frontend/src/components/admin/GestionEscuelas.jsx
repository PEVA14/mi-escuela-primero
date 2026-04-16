import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  getEscuelas,
  deleteEscuela,
  getNecesidadesByEscuela,
  deleteNecesidad,
  importarEscuelas,
} from "../../services/api";
import ModalEscuela from "./ModalEscuela";
import ModalNecesidad from "./ModalNecesidad";
import ConfirmDialog from "./ConfirmDialog";

const CAT_LABELS = {
  infraestructura: "Infraestructura",
  material: "Material",
  formacion: "Formación",
  salud: "Salud",
  otro: "Otro",
  na: "N/A",
};

const PRIORIDAD_CLS = {
  Alta: "bg-red-100 text-red-700",
  Media: "bg-amber-100 text-amber-700",
  Baja: "bg-emerald-100 text-emerald-700",
};

const ESTADO_CLS = {
  Pendiente: "bg-slate-100 text-slate-600",
  "En progreso": "bg-blue-100 text-blue-700",
  Completada: "bg-emerald-100 text-emerald-700",
};

// Mapeo de columnas del Excel del usuario → campos internos
const COL_MAP = {
  "Escuela":          "nombre",
  "Plantel":          "plantel",
  "Municipio":        "municipio",
  "Personal esco":    "personal_escolar",
  "Personal escolar": "personal_escolar",
  "Estudiantes":      "estudiantes",
  "Nivel ed.":        "nivelEducativo",
  "Nivel educativo":  "nivelEducativo",
  "CCT":              "cct",
  "Modalidad":        "modalidad",
  "Turno":            "turno",
  "Sostenimiento":    "sostenimiento",
  "Dirección":        "direccion",
  "Ubicación":        "ubicacion",
  "Categoría":        "categoria",
  // También acepta los nombres internos directamente
  nombre: "nombre", plantel: "plantel", municipio: "municipio",
  personal_escolar: "personal_escolar", estudiantes: "estudiantes",
  nivelEducativo: "nivelEducativo", cct: "cct", modalidad: "modalidad",
  turno: "turno", sostenimiento: "sostenimiento", direccion: "direccion",
  ubicacion: "ubicacion", categoria: "categoria",
};

function normalizarFila(fila) {
  const out = {};
  for (const [col, val] of Object.entries(fila)) {
    const key = COL_MAP[col.trim()];
    if (key) out[key] = val;
  }
  return out;
}

export default function GestionEscuelas({ showToast }) {
  const [escuelas, setEscuelas] = useState([]);
  const [escuelaActiva, setEscuelaActiva] = useState(null);
  const [vistaGeneral, setVistaGeneral] = useState(true);
  const [necesidades, setNecesidades] = useState([]);
  const [loadingEscuelas, setLoadingEscuelas] = useState(true);
  const [loadingNecesidades, setLoadingNecesidades] = useState(false);

  const [modalEscuela, setModalEscuela] = useState({ open: false, escuela: null });
  const [modalNecesidad, setModalNecesidad] = useState({ open: false, necesidad: null });
  const [confirm, setConfirm] = useState({ open: false, message: "", onConfirm: null });

  const [importError, setImportError] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    cargarEscuelas();
  }, []);

  useEffect(() => {
    if (escuelaActiva) {
      cargarNecesidades(escuelaActiva.id_escuela);
    } else {
      setNecesidades([]);
    }
  }, [escuelaActiva]);

  async function cargarEscuelas() {
    setLoadingEscuelas(true);
    try {
      const res = await getEscuelas();
      setEscuelas(res.data);
      return res.data;
    } catch {
      showToast("Error al cargar escuelas", "error");
    } finally {
      setLoadingEscuelas(false);
    }
  }

  async function cargarNecesidades(id) {
    setLoadingNecesidades(true);
    try {
      const res = await getNecesidadesByEscuela(id);
      setNecesidades(res.data);
    } catch {
      showToast("Error al cargar necesidades", "error");
    } finally {
      setLoadingNecesidades(false);
    }
  }

  function pedirConfirm(message, onConfirm) {
    setConfirm({ open: true, message, onConfirm });
  }

  function handleEliminarEscuela(e) {
    pedirConfirm(`¿Eliminar "${e.nombre}"? Esta acción no se puede deshacer.`, async () => {
      try {
        await deleteEscuela(e.id_escuela);
        showToast("Escuela eliminada correctamente");
        if (escuelaActiva?.id_escuela === e.id_escuela) {
          setEscuelaActiva(null);
          setVistaGeneral(true);
        }
        cargarEscuelas();
      } catch {
        showToast("Error al eliminar escuela", "error");
      }
    });
  }

  function handleEliminarNecesidad(n) {
    pedirConfirm(`¿Eliminar la necesidad "${n.titulo}"?`, async () => {
      try {
        await deleteNecesidad(n.id_necesidad);
        showToast("Necesidad eliminada correctamente");
        cargarNecesidades(escuelaActiva.id_escuela);
      } catch {
        showToast("Error al eliminar necesidad", "error");
      }
    });
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImportError(null);
    setImporting(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const sheetName = wb.SheetNames.includes("Escuelas") ? "Escuelas" : wb.SheetNames[0];
      const raw = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
      if (!raw.length) throw new Error("El archivo no contiene datos");
      const datos = raw.map(normalizarFila);
      const required = ["nombre", "municipio", "cct"];
      const missing = required.filter((r) => !datos[0][r]);
      if (missing.length) throw new Error(`Faltan columnas requeridas: ${missing.join(", ")}`);
      const res = await importarEscuelas(datos);
      showToast(`${res.data.insertadas} escuela(s) importada(s) correctamente`);
      cargarEscuelas();
    } catch (err) {
      setImportError(err.response?.data?.mensaje || err.message || "Error al importar el archivo");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  function handleExportar() {
    if (!escuelas.length) {
      showToast("No hay datos para exportar", "error");
      return;
    }
    const wb = XLSX.utils.book_new();
    const escuelasData = escuelas.map((e) => ({
      ID: e.id_escuela,
      Nombre: e.nombre,
      Plantel: e.plantel,
      Municipio: e.municipio,
      "Nivel Educativo": e.nivelEducativo,
      Modalidad: e.modalidad,
      Turno: e.turno,
      Sostenimiento: e.sostenimiento,
      Estudiantes: e.estudiantes,
      "Personal Escolar": e.personal_escolar,
      CCT: e.cct,
      Dirección: e.direccion,
      Categorías: Array.isArray(e.categoria) ? e.categoria.join(", ") : e.categoria,
      "URL Maps": e.ubicacion,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(escuelasData), "Escuelas");
    XLSX.writeFile(wb, "escuelas_mi_escuela_primero.xlsx");
    showToast("Archivo exportado correctamente");
  }

  const totalEstudiantes = escuelas.reduce((s, e) => s + (parseInt(e.estudiantes) || 0), 0);
  const totalPersonal = escuelas.reduce((s, e) => s + (parseInt(e.personal_escolar) || 0), 0);
  const municipios = [...new Set(escuelas.map((e) => e.municipio))].length;

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">Gestión de Escuelas</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-60"
          >
            {importing ? "Importando..." : "Importar Excel"}
          </button>
          <button
            onClick={handleExportar}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Exportar Excel
          </button>
          <button
            onClick={() => setModalEscuela({ open: true, escuela: null })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            + Nueva Escuela
          </button>
        </div>
      </div>

      {/* Import error */}
      {importError && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span><strong>Error al importar:</strong> {importError}</span>
          <button onClick={() => setImportError(null)} className="font-bold text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Format hint */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        <strong>Formato Excel para importar</strong> — columnas requeridas:{" "}
        <code className="rounded bg-amber-100 px-1">Escuela</code>,{" "}
        <code className="rounded bg-amber-100 px-1">Municipio</code>,{" "}
        <code className="rounded bg-amber-100 px-1">CCT</code>. Columnas opcionales reconocidas:{" "}
        <code className="rounded bg-amber-100 px-1">Plantel</code>,{" "}
        <code className="rounded bg-amber-100 px-1">Personal esco</code>,{" "}
        <code className="rounded bg-amber-100 px-1">Estudiantes</code>,{" "}
        <code className="rounded bg-amber-100 px-1">Nivel ed.</code>,{" "}
        <code className="rounded bg-amber-100 px-1">Modalidad</code>,{" "}
        <code className="rounded bg-amber-100 px-1">Turno</code>,{" "}
        <code className="rounded bg-amber-100 px-1">Sostenimiento</code>,{" "}
        <code className="rounded bg-amber-100 px-1">Dirección</code>,{" "}
        <code className="rounded bg-amber-100 px-1">Ubicación</code>.
      </div>

      {loadingEscuelas ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Cargando escuelas...
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => { setVistaGeneral(true); setEscuelaActiva(null); }}
              className={`flex-shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                vistaGeneral
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
              }`}
            >
              Vista General
            </button>
            {escuelas.map((e) => (
              <button
                key={e.id_escuela}
                onClick={() => { setEscuelaActiva(e); setVistaGeneral(false); }}
                className={`flex-shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  !vistaGeneral && escuelaActiva?.id_escuela === e.id_escuela
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                }`}
              >
                {e.nombre}
              </button>
            ))}
          </div>

          {/* Vista General */}
          {vistaGeneral && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Escuelas", value: escuelas.length },
                  { label: "Estudiantes", value: totalEstudiantes.toLocaleString() },
                  { label: "Personal docente", value: totalPersonal },
                  { label: "Municipios", value: municipios },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 text-center shadow-sm"
                  >
                    <p className="text-3xl font-extrabold text-emerald-700">{stat.value}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {escuelas.length === 0 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <p className="text-slate-500">No hay escuelas registradas.</p>
                  <button
                    onClick={() => setModalEscuela({ open: true, escuela: null })}
                    className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
                  >
                    + Agregar primera escuela
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          {["Nombre", "Municipio", "Nivel", "Modalidad", "Estudiantes", "Acciones"].map((h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {escuelas.map((e) => (
                          <tr key={e.id_escuela} className="transition hover:bg-slate-50">
                            <td className="px-4 py-3 font-semibold text-slate-800">{e.nombre}</td>
                            <td className="px-4 py-3 text-slate-600">{e.municipio}</td>
                            <td className="px-4 py-3 text-slate-600">{e.nivelEducativo}</td>
                            <td className="px-4 py-3 text-slate-500">{e.modalidad}</td>
                            <td className="px-4 py-3 text-slate-600">{e.estudiantes}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => { setEscuelaActiva(e); setVistaGeneral(false); }}
                                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                                >
                                  Ver
                                </button>
                                <button
                                  onClick={() => setModalEscuela({ open: true, escuela: e })}
                                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleEliminarEscuela(e)}
                                  className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* School detail */}
          {!vistaGeneral && escuelaActiva && (
            <div className="flex flex-col gap-6">
              {/* Info card */}
              <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {escuelaActiva.nivelEducativo} · {escuelaActiva.modalidad}
                    </span>
                    <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                      {escuelaActiva.nombre}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {escuelaActiva.municipio}
                      {escuelaActiva.cct && <> · CCT: <strong className="text-slate-700">{escuelaActiva.cct}</strong></>}
                    </p>
                    {escuelaActiva.direccion && (
                      <p className="mt-0.5 text-sm text-slate-500">{escuelaActiva.direccion}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                      <span>
                        <strong className="text-slate-800">{escuelaActiva.estudiantes}</strong> estudiantes
                      </span>
                      <span>
                        <strong className="text-slate-800">{escuelaActiva.personal_escolar}</strong> personal
                      </span>
                      <span>
                        Turno <strong className="text-slate-800">{escuelaActiva.turno}</strong>
                      </span>
                      <span>
                        <strong className="text-slate-800">{escuelaActiva.sostenimiento}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setModalEscuela({ open: true, escuela: escuelaActiva })}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      Editar escuela
                    </button>
                    <button
                      onClick={() => handleEliminarEscuela(escuelaActiva)}
                      className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setModalNecesidad({ open: true, necesidad: null })}
                      className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                    >
                      + Nueva necesidad
                    </button>
                  </div>
                </div>
              </div>

              {/* Needs table */}
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <h4 className="text-base font-bold text-slate-800">Necesidades</h4>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {necesidades.length} {necesidades.length === 1 ? "necesidad" : "necesidades"}
                  </span>
                </div>

                {loadingNecesidades ? (
                  <div className="p-10 text-center text-sm text-slate-500">Cargando necesidades...</div>
                ) : necesidades.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-sm text-slate-500">Esta escuela no tiene necesidades registradas.</p>
                    <button
                      onClick={() => setModalNecesidad({ open: true, necesidad: null })}
                      className="mt-3 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
                    >
                      + Agregar primera necesidad
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          {["Título", "Categoría", "Prioridad", "Monto requerido", "Progreso", "Estado", "Acciones"].map(
                            (h) => (
                              <th
                                key={h}
                                className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {necesidades.map((n) => {
                          const pct =
                            n.monto_requerido > 0
                              ? Math.min(100, Math.round((n.monto_recaudado / n.monto_requerido) * 100))
                              : 0;
                          return (
                            <tr key={n.id_necesidad} className="transition hover:bg-slate-50">
                              <td className="px-4 py-3">
                                <p className="font-semibold text-slate-800">{n.titulo}</p>
                                {n.descripcion && (
                                  <p className="mt-0.5 max-w-[200px] truncate text-xs text-slate-500" title={n.descripcion}>
                                    {n.descripcion}
                                  </p>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                  {CAT_LABELS[n.categoria] || n.categoria}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                    PRIORIDAD_CLS[n.prioridad] || "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {n.prioridad}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-medium text-slate-700">
                                ${Number(n.monto_requerido).toLocaleString()}
                              </td>
                              <td className="min-w-[140px] px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                      className="h-full rounded-full bg-emerald-500 transition-all"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="w-9 text-right text-xs font-semibold text-slate-600">{pct}%</span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-400">
                                  ${Number(n.monto_recaudado).toLocaleString()} recaudado
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                    ESTADO_CLS[n.estado] || "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {n.estado}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => setModalNecesidad({ open: true, necesidad: n })}
                                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleEliminarNecesidad(n)}
                                    className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ModalEscuela
        open={modalEscuela.open}
        escuela={modalEscuela.escuela}
        onClose={() => setModalEscuela({ open: false, escuela: null })}
        onSuccess={async () => {
          const editedId = modalEscuela.escuela?.id_escuela;
          setModalEscuela({ open: false, escuela: null });
          showToast(editedId ? "Escuela actualizada correctamente" : "Escuela creada correctamente");
          const data = await cargarEscuelas();
          if (data && editedId && escuelaActiva?.id_escuela === editedId) {
            const updated = data.find((e) => e.id_escuela === editedId);
            if (updated) setEscuelaActiva(updated);
          }
        }}
      />

      <ModalNecesidad
        open={modalNecesidad.open}
        necesidad={modalNecesidad.necesidad}
        id_escuela={escuelaActiva?.id_escuela}
        onClose={() => setModalNecesidad({ open: false, necesidad: null })}
        onSuccess={() => {
          setModalNecesidad({ open: false, necesidad: null });
          showToast(modalNecesidad.necesidad ? "Necesidad actualizada" : "Necesidad creada");
          if (escuelaActiva) cargarNecesidades(escuelaActiva.id_escuela);
        }}
      />

      <ConfirmDialog
        open={confirm.open}
        message={confirm.message}
        onConfirm={() => {
          confirm.onConfirm?.();
          setConfirm({ open: false, message: "", onConfirm: null });
        }}
        onCancel={() => setConfirm({ open: false, message: "", onConfirm: null })}
      />
    </div>
  );
}

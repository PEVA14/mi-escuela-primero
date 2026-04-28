import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  importarNecesidades,
  getNecesidades,
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

// Mapeo de columnas del Excel → campos internos (hoja "Datos de las escuelas")
const COL_MAP_ESCUELAS = {
  Escuela: "nombre",
  Plantel: "plantel",
  Municipio: "municipio",
  "Personal esco": "personal_escolar",
  "Personal escolar": "personal_escolar",
  Estudiantes: "estudiantes",
  "Nivel ed.": "nivelEducativo",
  "Nivel educativo": "nivelEducativo",
  CCT: "cct",
  Modalidad: "modalidad",
  Turno: "turno",
  Sostenimiento: "sostenimiento",
  Dirección: "direccion",
  Ubicación: "ubicacion",
};

// Mapeo de columnas del Excel → campos internos (hoja "Necesidades")
const COL_MAP_NECESIDADES = {
  Municipio: "municipio",
  Escuela: "nombre_escuela",
  Categoría: "categoria",
  Subcategoría: "subcategoria",
  Propuesta: "titulo",
  Cantidad: "monto_requerido",
  Unidad: "unidad",
  Estado: "estado_raw",
  Detalles: "descripcion",
};

// "Cubierto" → "Completada", etc.
const ESTADO_MAP = {
  cubierto: "Completada",
  "aun no cubierto": "Pendiente",
  "en proceso": "En progreso",
  "en progreso": "En progreso",
  pendiente: "Pendiente",
  completada: "Completada",
};

function normalizarFilaEscuela(fila) {
  const out = {};
  for (const [col, val] of Object.entries(fila)) {
    const key = COL_MAP_ESCUELAS[col.trim()];
    if (key) out[key] = val;
  }
  return out;
}

function normalizarFilaNecesidad(fila) {
  const out = {};
  for (const [col, val] of Object.entries(fila)) {
    const key = COL_MAP_NECESIDADES[col.trim()];
    if (key) out[key] = val;
  }
  if (out.estado_raw) {
    out.estado =
      ESTADO_MAP[String(out.estado_raw).toLowerCase().trim()] || "Pendiente";
    delete out.estado_raw;
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

  const [modalEscuela, setModalEscuela] = useState({
    open: false,
    escuela: null,
  });
  const [modalNecesidad, setModalNecesidad] = useState({
    open: false,
    necesidad: null,
  });
  const [confirm, setConfirm] = useState({
    open: false,
    message: "",
    onConfirm: null,
  });

  const [importError, setImportError] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    cargarEscuelas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (escuelaActiva) {
      cargarNecesidades(escuelaActiva.id_escuela);
    } else {
      setNecesidades([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    pedirConfirm(
      `¿Eliminar "${e.nombre}"? Esta acción no se puede deshacer.`,
      async () => {
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
      },
    );
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

      const messages = [];

      // ── Hoja "Datos de las escuelas" (header en fila 5 → range: 4) ──
      const sheetEscuelas = wb.Sheets["Datos de las escuelas"];
      if (sheetEscuelas) {
        const raw = XLSX.utils.sheet_to_json(sheetEscuelas, { range: 4 });
        const datosEscuelas = raw
          .map(normalizarFilaEscuela)
          .filter((r) => r.nombre && r.municipio && r.cct);
        if (datosEscuelas.length) {
          const res = await importarEscuelas(datosEscuelas);
          if (res.data.insertadas)
            messages.push(`${res.data.insertadas} escuela(s) nueva(s)`);
          if (res.data.actualizadas)
            messages.push(`${res.data.actualizadas} escuela(s) actualizada(s)`);
          if (res.data.errores?.length)
            messages.push(`${res.data.errores.length} error(es) en escuelas`);
        }
      }

      // ── Hoja "Necesidades" (header en fila 4 → range: 3) ──
      // The backend handles plantel-sharing: if the matched school has a plantel,
      // the need is applied to every school that shares it in the same municipio.
      const sheetNecesidades = wb.Sheets["Necesidades"];
      if (sheetNecesidades) {
        const raw = XLSX.utils.sheet_to_json(sheetNecesidades, { range: 3 });
        const datos = raw
          .map(normalizarFilaNecesidad)
          .filter((r) => r.titulo && r.nombre_escuela);
        if (datos.length) {
          const res = await importarNecesidades(datos);
          const {
            insertadas = 0,
            actualizadas = 0,
            errores: necErr = [],
          } = res.data;
          if (insertadas) messages.push(`${insertadas} necesidad(es) nueva(s)`);
          if (actualizadas)
            messages.push(`${actualizadas} necesidad(es) actualizada(s)`);
          if (!insertadas && !actualizadas)
            messages.push("Necesidades: sin cambios");
          if (necErr.length) {
            messages.push(`${necErr.length} sin vincular`);
            console.warn("Necesidades sin vincular:", necErr);
          }
        }
      }

      if (!messages.length)
        throw new Error("No se encontraron hojas reconocidas o datos válidos");
      showToast(messages.join(" · "));
      cargarEscuelas();
    } catch (err) {
      setImportError(
        err.response?.data?.mensaje ||
          err.message ||
          "Error al importar el archivo",
      );
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  async function handleExportar() {
    if (!escuelas.length) {
      showToast("No hay datos para exportar", "error");
      return;
    }
    try {
      const wb = XLSX.utils.book_new();

      // ── Hoja "Datos de las escuelas" (encabezado en fila 5, igual que el original) ──
      const escuelasRows = [
        ["Mi Escuela Primero — Datos de las escuelas"],
        [],
        [],
        [],
        [
          "#",
          "Municipio",
          "Plantel",
          "Escuela",
          "Personal escolar",
          "Estudiantes",
          "Nivel ed.",
          "CCT",
          "Modalidad",
          "Turno",
          "Sostenimiento",
          "Dirección",
          "Ubicación",
        ],
        ...escuelas.map((e, i) => [
          i + 1,
          e.municipio,
          e.plantel,
          e.nombre,
          e.personal_escolar,
          e.estudiantes,
          e.nivelEducativo,
          e.cct,
          e.modalidad,
          e.turno,
          e.sostenimiento,
          e.direccion,
          e.ubicacion,
        ]),
      ];
      const wsEscuelas = XLSX.utils.aoa_to_sheet(escuelasRows);
      XLSX.utils.book_append_sheet(wb, wsEscuelas, "Datos de las escuelas");

      // ── Hoja "Necesidades" (encabezado en fila 4, igual que el original) ──
      // Collapse needs shared by every sibling of a plantel into a single
      // plantel-keyed row so re-import via the plantel-expansion code
      // reproduces the same DB state without duplicating rows.
      const resNec = await getNecesidades();
      const necesidades = resNec.data || [];

      const escInfoById = new Map(
        escuelas.map((e) => [
          e.id_escuela,
          { plantel: e.plantel || "", municipio: e.municipio || "" },
        ]),
      );
      const siblingCount = new Map(); // "municipio|plantel" → # schools in that plantel
      for (const e of escuelas) {
        if (!e.plantel) continue;
        const k = `${e.municipio}|${e.plantel}`;
        siblingCount.set(k, (siblingCount.get(k) || 0) + 1);
      }

      const keyOf = (info, n) =>
        JSON.stringify([
          info.municipio,
          info.plantel,
          n.titulo || "",
          n.categoria || "",
          n.subcategoria || "",
          n.monto_requerido ?? "",
          n.unidad || "",
          n.estado || "",
          n.descripcion || "",
        ]);

      const groups = new Map();
      for (const n of necesidades) {
        const info = escInfoById.get(n.id_escuela);
        if (!info) continue;
        const k = keyOf(info, n);
        if (!groups.has(k))
          groups.set(k, { info, sample: n, schoolIds: new Set(), items: [] });
        const g = groups.get(k);
        g.schoolIds.add(n.id_escuela);
        g.items.push(n);
      }

      const necesidadDataRows = [];
      for (const g of groups.values()) {
        const sibKey = `${g.info.municipio}|${g.info.plantel}`;
        const total = g.info.plantel ? siblingCount.get(sibKey) || 1 : 1;
        const shareAcrossAllSiblings =
          g.info.plantel && total > 1 && g.schoolIds.size === total;
        if (shareAcrossAllSiblings) {
          necesidadDataRows.push([
            g.info.municipio,
            g.info.plantel,
            g.sample.categoria,
            g.sample.subcategoria,
            g.sample.titulo,
            g.sample.monto_requerido,
            g.sample.unidad,
            g.sample.estado,
            g.sample.descripcion || "",
          ]);
        } else {
          for (const item of g.items) {
            necesidadDataRows.push([
              item.municipio,
              item.nombre_escuela,
              item.categoria,
              item.subcategoria,
              item.titulo,
              item.monto_requerido,
              item.unidad,
              item.estado,
              item.descripcion || "",
            ]);
          }
        }
      }

      const necesidadesRows = [
        ["Mi Escuela Primero — Necesidades"],
        [],
        [],
        [
          "Municipio",
          "Escuela",
          "Categoría",
          "Subcategoría",
          "Propuesta",
          "Cantidad",
          "Unidad",
          "Estado",
          "Detalles",
        ],
        ...necesidadDataRows,
      ];
      const wsNecesidades = XLSX.utils.aoa_to_sheet(necesidadesRows);
      XLSX.utils.book_append_sheet(wb, wsNecesidades, "Necesidades");

      XLSX.writeFile(wb, "mi_escuela_primero.xlsx");
      showToast("Archivo exportado correctamente");
    } catch {
      showToast("Error al exportar", "error");
    }
  }

  const totalEstudiantes = escuelas.reduce(
    (s, e) => s + (parseInt(e.estudiantes) || 0),
    0,
  );
  const totalPersonal = escuelas.reduce(
    (s, e) => s + (parseInt(e.personal_escolar) || 0),
    0,
  );
  const municipios = [...new Set(escuelas.map((e) => e.municipio))].length;

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">
          Gestión de Escuelas
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleImport}
          />
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
          <span>
            <strong>Error al importar:</strong> {importError}
          </span>
          <button
            onClick={() => setImportError(null)}
            className="font-bold text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Format hint */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 space-y-1">
        <p>
          <strong>Formato Excel para importar</strong> — se leen dos hojas
          automáticamente:
        </p>
        <p>
          <strong>Hoja "Datos de las escuelas"</strong> (encabezado en fila 5) —
          requeridas: <code className="rounded bg-amber-100 px-1">Escuela</code>
          , <code className="rounded bg-amber-100 px-1">Municipio</code>,{" "}
          <code className="rounded bg-amber-100 px-1">CCT</code>.
        </p>
        <p>
          <strong>Hoja "Necesidades"</strong> (encabezado en fila 4) —
          requeridas: <code className="rounded bg-amber-100 px-1">Escuela</code>
          , <code className="rounded bg-amber-100 px-1">Propuesta</code>.
          Opcionales:{" "}
          <code className="rounded bg-amber-100 px-1">Categoría</code>,{" "}
          <code className="rounded bg-amber-100 px-1">Subcategoría</code>,{" "}
          <code className="rounded bg-amber-100 px-1">Cantidad</code>,{" "}
          <code className="rounded bg-amber-100 px-1">Estado</code>,{" "}
          <code className="rounded bg-amber-100 px-1">Detalles</code>.
        </p>
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
              onClick={() => {
                setVistaGeneral(true);
                setEscuelaActiva(null);
              }}
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
                onClick={() => {
                  setEscuelaActiva(e);
                  setVistaGeneral(false);
                }}
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
                  {
                    label: "Estudiantes",
                    value: totalEstudiantes.toLocaleString(),
                  },
                  { label: "Personal docente", value: totalPersonal },
                  { label: "Municipios", value: municipios },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 text-center shadow-sm"
                  >
                    <p className="text-3xl font-extrabold text-emerald-700">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {escuelas.length === 0 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <p className="text-slate-500">No hay escuelas registradas.</p>
                  <button
                    onClick={() =>
                      setModalEscuela({ open: true, escuela: null })
                    }
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
                          {[
                            "Nombre",
                            "Municipio",
                            "Nivel",
                            "Modalidad",
                            "Estudiantes",
                            "Acciones",
                          ].map((h) => (
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
                          <tr
                            key={e.id_escuela}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              {e.nombre}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {e.municipio}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {e.nivelEducativo}
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                              {e.modalidad}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {e.estudiantes}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => {
                                    setEscuelaActiva(e);
                                    setVistaGeneral(false);
                                  }}
                                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                                >
                                  Ver
                                </button>
                                <button
                                  onClick={() =>
                                    setModalEscuela({ open: true, escuela: e })
                                  }
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
                      {escuelaActiva.cct && (
                        <>
                          {" "}
                          · CCT:{" "}
                          <strong className="text-slate-700">
                            {escuelaActiva.cct}
                          </strong>
                        </>
                      )}
                    </p>
                    {escuelaActiva.direccion && (
                      <p className="mt-0.5 text-sm text-slate-500">
                        {escuelaActiva.direccion}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                      <span>
                        <strong className="text-slate-800">
                          {escuelaActiva.estudiantes}
                        </strong>{" "}
                        estudiantes
                      </span>
                      <span>
                        <strong className="text-slate-800">
                          {escuelaActiva.personal_escolar}
                        </strong>{" "}
                        personal
                      </span>
                      <span>
                        Turno{" "}
                        <strong className="text-slate-800">
                          {escuelaActiva.turno}
                        </strong>
                      </span>
                      <span>
                        <strong className="text-slate-800">
                          {escuelaActiva.sostenimiento}
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setModalEscuela({ open: true, escuela: escuelaActiva })
                      }
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
                      onClick={() =>
                        setModalNecesidad({ open: true, necesidad: null })
                      }
                      className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                    >
                      + Nueva necesidad
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo gallery */}
              {escuelaActiva.fotos && escuelaActiva.fotos.length > 0 && (
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 text-base font-bold text-slate-800">
                    Fotos
                    <span className="ml-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      {escuelaActiva.fotos.length}
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {escuelaActiva.fotos.map((foto) => (
                      <a
                        key={foto.id_foto}
                        href={foto.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:border-emerald-300 hover:shadow-md"
                      >
                        <img
                          src={foto.url}
                          alt="Foto de la escuela"
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    Haz clic en una foto para verla a tamaño completo · Para
                    agregar o eliminar fotos usa "Editar escuela"
                  </p>
                </div>
              )}

              {/* Needs table */}
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <h4 className="text-base font-bold text-slate-800">
                    Necesidades
                  </h4>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {necesidades.length}{" "}
                    {necesidades.length === 1 ? "necesidad" : "necesidades"}
                  </span>
                </div>

                {loadingNecesidades ? (
                  <div className="p-10 text-center text-sm text-slate-500">
                    Cargando necesidades...
                  </div>
                ) : necesidades.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-sm text-slate-500">
                      Esta escuela no tiene necesidades registradas.
                    </p>
                    <button
                      onClick={() =>
                        setModalNecesidad({ open: true, necesidad: null })
                      }
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
                          {[
                            "Título",
                            "Categoría",
                            "Prioridad",
                            "Monto requerido",
                            "Progreso",
                            "Estado",
                            "Acciones",
                          ].map((h) => (
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
                        {necesidades.map((n) => {
                          const pct =
                            n.monto_requerido > 0
                              ? Math.min(
                                  100,
                                  Math.round(
                                    (n.monto_recaudado / n.monto_requerido) *
                                      100,
                                  ),
                                )
                              : 0;
                          return (
                            <tr
                              key={n.id_necesidad}
                              className="transition hover:bg-slate-50"
                            >
                              <td className="px-4 py-3">
                                <p className="font-semibold text-slate-800">
                                  {n.titulo}
                                </p>
                                {n.descripcion && (
                                  <p
                                    className="mt-0.5 max-w-[200px] truncate text-xs text-slate-500"
                                    title={n.descripcion}
                                  >
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
                                    PRIORIDAD_CLS[n.prioridad] ||
                                    "bg-slate-100 text-slate-600"
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
                                  <span className="w-9 text-right text-xs font-semibold text-slate-600">
                                    {pct}%
                                  </span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-400">
                                  ${Number(n.monto_recaudado).toLocaleString()}{" "}
                                  recaudado
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                    ESTADO_CLS[n.estado] ||
                                    "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {n.estado}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() =>
                                      setModalNecesidad({
                                        open: true,
                                        necesidad: n,
                                      })
                                    }
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
          showToast(
            editedId
              ? "Escuela actualizada correctamente"
              : "Escuela creada correctamente",
          );
          const data = await cargarEscuelas();
          // Refresh escuelaActiva so the photo gallery updates immediately after edit
          if (data && editedId) {
            const updated = data.find((e) => e.id_escuela === editedId);
            if (updated) {
              setEscuelaActiva(updated);
              setVistaGeneral(false);
            }
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
          showToast(
            modalNecesidad.necesidad
              ? "Necesidad actualizada"
              : "Necesidad creada",
          );
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
        onCancel={() =>
          setConfirm({ open: false, message: "", onConfirm: null })
        }
      />
    </div>
  );
}

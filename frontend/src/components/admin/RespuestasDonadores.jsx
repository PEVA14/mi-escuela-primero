import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { getRespuestas } from "../../services/api";

const INSTANCIA_LABELS = {
  empresa: "Empresa",
  osc: "OSC",
  institucion_educativa: "Institución educativa",
  gobierno_municipal: "Gobierno municipal",
  sin_instancia: "Sin instancia",
  otro: "Otro",
};

export default function RespuestasDonadores({ showToast }) {
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [tab, setTab] = useState("especificas"); // "especificas" | "generales"

  async function cargarRespuestas() {
    setLoading(true);
    try {
      const res = await getRespuestas();
      setRespuestas(res.data);
    } catch {
      showToast("Error al cargar respuestas", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarRespuestas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const especificas = respuestas.filter((r) => r.id_escuela);
  const generales = respuestas.filter((r) => !r.id_escuela);
  const activas = tab === "especificas" ? especificas : generales;

  const filtradas = activas.filter(
    (r) =>
      !filtro ||
      r.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      r.correo?.toLowerCase().includes(filtro.toLowerCase()) ||
      r.empresa?.toLowerCase().includes(filtro.toLowerCase()) ||
      r.nombre_escuela?.toLowerCase().includes(filtro.toLowerCase()),
  );

  function handleExportar() {
    if (!filtradas.length) {
      showToast("No hay datos para exportar", "error");
      return;
    }

    const wb = XLSX.utils.book_new();

    if (tab === "especificas") {
      const data = filtradas.map((r) => ({
        Nombre: r.nombre,
        Correo: r.correo || "",
        Teléfono: r.telefono || "",
        Empresa: r.empresa || "",
        Escuela: r.nombre_escuela || "",
        "Tipo de apoyo": r.tipo_apoyo || "",
        Cantidad: r.cantidad || "",
        Detalles: r.detalles || "",
        Mensaje: r.mensaje || "",
        Fecha: r.fecha || "",
      }));
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data),
        "Específicas",
      );
    } else {
      const data = filtradas.map((r) => ({
        Nombre: r.nombre,
        Correo: r.correo || "",
        Teléfono: r.telefono || "",
        Instancia: INSTANCIA_LABELS[r.instancia] || r.instancia || "",
        Empresa: r.empresa || "",
        Municipio: r.municipio || "",
        Mensaje: r.mensaje || "",
        Fecha: r.fecha || "",
      }));
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(data),
        "Generales",
      );
    }

    XLSX.writeFile(wb, `respuestas_${tab}.xlsx`);
    showToast("Exportación completada");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Respuestas de Donadores
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Contactos recibidos desde los formularios del sitio
          </p>
        </div>
        <button
          onClick={handleExportar}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
        >
          Exportar Excel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 w-fit">
        <button
          onClick={() => setTab("especificas")}
          className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
            tab === "especificas"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Escuela específica
          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
            {especificas.length}
          </span>
        </button>
        <button
          onClick={() => setTab("generales")}
          className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
            tab === "generales"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          General
          <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600">
            {generales.length}
          </span>
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar por nombre, correo, empresa o escuela..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      />

      {loading ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Cargando respuestas...
        </div>
      ) : filtradas.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500">
            {filtro
              ? "No se encontraron respuestas con ese criterio."
              : `No hay respuestas ${tab === "especificas" ? "vinculadas a una escuela" : "generales"} aún.`}
          </p>
        </div>
      ) : tab === "especificas" ? (
        <TablaEspecificas filas={filtradas} filtro={filtro} />
      ) : (
        <TablaGenerales filas={filtradas} filtro={filtro} />
      )}
    </div>
  );
}

function TablaEspecificas({ filas, filtro }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <p className="text-sm font-semibold text-slate-500">
          {filas.length} {filas.length === 1 ? "respuesta" : "respuestas"}
          {filtro && ` · filtrando por "${filtro}"`}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {[
                "Nombre",
                "Correo",
                "Teléfono",
                "Empresa",
                "Escuela",
                "Tipo de apoyo",
                "Detalles",
                "Mensaje",
                "Fecha",
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
            {filas.map((r) => (
              <tr key={r.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {r.nombre}
                </td>
                <td className="px-4 py-3 text-slate-600">{r.correo || "—"}</td>
                <td className="px-4 py-3 text-slate-500">
                  {r.telefono || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">{r.empresa || "—"}</td>
                <td className="px-4 py-3 text-slate-600">
                  {r.nombre_escuela ? (
                    <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {r.nombre_escuela}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.tipo_apoyo ? (
                    <span className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {r.tipo_apoyo}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td
                  className="max-w-[200px] px-4 py-3 text-slate-500"
                  title={r.detalles}
                >
                  <span className="line-clamp-2">{r.detalles || "—"}</span>
                </td>
                <td
                  className="max-w-[180px] px-4 py-3 text-slate-500"
                  title={r.mensaje}
                >
                  <span className="line-clamp-2">{r.mensaje || "—"}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {r.fecha
                    ? new Date(r.fecha).toLocaleDateString("es-MX")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TablaGenerales({ filas, filtro }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <p className="text-sm font-semibold text-slate-500">
          {filas.length} {filas.length === 1 ? "respuesta" : "respuestas"}
          {filtro && ` · filtrando por "${filtro}"`}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {[
                "Nombre",
                "Correo",
                "Teléfono",
                "Tipo de instancia",
                "Empresa / Org.",
                "Municipio",
                "Mensaje",
                "Fecha",
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
            {filas.map((r) => (
              <tr key={r.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {r.nombre}
                </td>
                <td className="px-4 py-3 text-slate-600">{r.correo || "—"}</td>
                <td className="px-4 py-3 text-slate-500">
                  {r.telefono || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {r.instancia ? (
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {INSTANCIA_LABELS[r.instancia] || r.instancia}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{r.empresa || "—"}</td>
                <td className="px-4 py-3 text-slate-500">
                  {r.municipio || "—"}
                </td>
                <td
                  className="max-w-[200px] px-4 py-3 text-slate-500"
                  title={r.mensaje}
                >
                  <span className="line-clamp-2">{r.mensaje || "—"}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {r.fecha
                    ? new Date(r.fecha).toLocaleDateString("es-MX")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

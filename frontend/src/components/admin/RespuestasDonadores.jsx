import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { getRespuestas } from "../../services/api";

const TIPO_LABELS = {
  material: "Material",
  formacion: "Formación",
  salud: "Salud",
  infraestructura: "Infraestructura",
  economico: "Económico",
  otro: "Otro",
};

export default function RespuestasDonadores({ showToast }) {
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    cargarRespuestas();
  }, []);

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

  function handleExportar() {
    if (!respuestas.length) {
      showToast("No hay datos para exportar", "error");
      return;
    }
    const wb = XLSX.utils.book_new();
    const data = respuestas.map((r) => ({
      Nombre: r.nombre,
      Correo: r.correo,
      Teléfono: r.telefono || "",
      Empresa: r.empresa || "",
      "Escuela relacionada": r.nombre_escuela || "",
      "Tipo de apoyo": TIPO_LABELS[r.tipo_apoyo] || r.tipo_apoyo || "",
      Mensaje: r.mensaje || "",
      Fecha: r.fecha || "",
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Respuestas");
    XLSX.writeFile(wb, "respuestas_donadores.xlsx");
    showToast("Exportación completada");
  }

  const filtradas = respuestas.filter(
    (r) =>
      !filtro ||
      r.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      r.correo?.toLowerCase().includes(filtro.toLowerCase()) ||
      r.empresa?.toLowerCase().includes(filtro.toLowerCase()) ||
      r.nombre_escuela?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Respuestas de Donadores</h2>
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
              : "No hay respuestas registradas aún. Aparecerán aquí cuando alguien llene un formulario del sitio."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <p className="text-sm font-semibold text-slate-500">
              {filtradas.length} {filtradas.length === 1 ? "respuesta" : "respuestas"}
              {filtro && ` · filtrando por "${filtro}"`}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {["Nombre", "Correo", "Teléfono", "Empresa", "Escuela", "Tipo de apoyo", "Fecha", "Mensaje"].map(
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
                {filtradas.map((r) => (
                  <tr key={r.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{r.nombre}</td>
                    <td className="px-4 py-3 text-slate-600">{r.correo}</td>
                    <td className="px-4 py-3 text-slate-500">{r.telefono || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{r.empresa || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{r.nombre_escuela || "—"}</td>
                    <td className="px-4 py-3">
                      {r.tipo_apoyo ? (
                        <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {TIPO_LABELS[r.tipo_apoyo] || r.tipo_apoyo}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {r.fecha ? new Date(r.fecha).toLocaleDateString("es-MX") : "—"}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-slate-500" title={r.mensaje}>
                      {r.mensaje || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

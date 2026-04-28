import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEscuelaById, updateEscuela, deleteEscuela } from "../services/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { validateFormBeforeSubmit } from "../utils/formValidation";

export default function EditarEscuela() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [escuela, setEscuela] = useState({
    nombre: "",
    plantel: "",
    municipio: "",
    direccion: "",
    cct: "",
    personal_escolar: "",
    estudiantes: "",
    nivelEducativo: "",
    modalidad: "",
    turno: "",
    sostenimiento: "",
    categoria: "",
  });

  const [loading, setLoading] = useState(true);
  const [invalidFields, setInvalidFields] = useState([]);
  const warningText = "Por favor llena este espacio";
  const inputCls = (fieldName) =>
    `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
      invalidFields.includes(fieldName)
        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
    }`;

  // proteger ruta (solo admin)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión como administrador");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cargar datos
  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await getEscuelaById(id);

        setEscuela(res.data);
      } catch (e) {
        console.error("Error al obtener la escuela", e);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [id]);

  function handleChange(e) {
    setInvalidFields((prev) => prev.filter((item) => item !== e.target.name));

    setEscuela({
      ...escuela,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    if (!validateFormBeforeSubmit(e, null, setInvalidFields)) return;

    e.preventDefault();

    try {
      await updateEscuela(id, escuela);

      alert("Escuela actualizada correctamente");

      navigate(`/escuelas/${id}`);
    } catch {
      alert("Error al actualizar");
    }
  }

  async function handleDelete() {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar esta escuela?",
    );

    if (!confirmar) return;

    try {
      await deleteEscuela(id);
      alert("Escuela eliminada correctamente");
      navigate("/escuelas");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la escuela");
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <main className="px-6 py-10 md:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-600">
              Cargando datos de la escuela...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <main className="px-6 py-8 md:px-10 lg:px-14 lg:py-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
                  Panel de edición
                </span>
                <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl">
                  Editar Escuela
                </h1>
                <p className="mt-2 text-base leading-7 text-slate-600 md:text-lg">
                  Actualiza la información de la escuela y guarda los cambios
                  cuando termines.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/escuelas/${id}`)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Volver a detalles
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Nombre
                </label>
                <input
                  className={inputCls("nombre")}
                  name="nombre"
                  value={escuela.nombre}
                  onChange={handleChange}
                  required
                />
                {invalidFields.includes("nombre") && (
                  <p className="text-xs font-medium text-red-600">
                    {warningText}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Plantel
                </label>
                <input
                  className={inputCls("plantel")}
                  name="plantel"
                  value={escuela.plantel}
                  onChange={handleChange}
                  required
                />
                {invalidFields.includes("plantel") && (
                  <p className="text-xs font-medium text-red-600">
                    {warningText}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Municipio
                </label>
                <input
                  className={inputCls("municipio")}
                  name="municipio"
                  value={escuela.municipio}
                  onChange={handleChange}
                  required
                />
                {invalidFields.includes("municipio") && (
                  <p className="text-xs font-medium text-red-600">
                    {warningText}
                  </p>
                )}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Dirección
                </label>
                <input
                  className={inputCls("direccion")}
                  name="direccion"
                  value={escuela.direccion}
                  onChange={handleChange}
                  required
                />
                {invalidFields.includes("direccion") && (
                  <p className="text-xs font-medium text-red-600">
                    {warningText}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  CCT
                </label>
                <input
                  className={inputCls("cct")}
                  name="cct"
                  value={escuela.cct}
                  onChange={handleChange}
                  required
                />
                {invalidFields.includes("cct") && (
                  <p className="text-xs font-medium text-red-600">
                    {warningText}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Estudiantes
                </label>
                <input
                  className={inputCls("nivelEducativo")}
                  name="estudiantes"
                  value={escuela.estudiantes}
                  onChange={handleChange}
                />
                {invalidFields.includes("nivelEducativo") && (
                  <p className="text-xs font-medium text-red-600">
                    {warningText}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Personal Escolar
                </label>
                <input
                  className={inputCls("categoria")}
                  name="personal_escolar"
                  value={escuela.personal_escolar}
                  onChange={handleChange}
                />
                {invalidFields.includes("categoria") && (
                  <p className="text-xs font-medium text-red-600">
                    {warningText}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Nivel Educativo
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  name="nivelEducativo"
                  value={escuela.nivelEducativo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Modalidad
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  name="modalidad"
                  value={escuela.modalidad}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Turno
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  name="turno"
                  value={escuela.turno}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Sostenimiento
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  name="sostenimiento"
                  value={escuela.sostenimiento}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Categoría
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  name="categoria"
                  value={escuela.categoria}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mt-2 flex flex-col gap-3 md:col-span-2 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-3.5 text-sm font-semibold text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-100"
                >
                  Eliminar escuela
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

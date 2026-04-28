import { useState } from "react";
import { agregarEscuela } from "../services/api"; 
import { useNavigate } from "react-router-dom";
import { validateFormBeforeSubmit } from "../utils/formValidation";

export default function AgregarEscuela() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        plantel: "",
        municipio: "",
        direccion: "",
        ubicacion: "",
        cct: "",
        personal_escolar: 0,
        estudiantes: 0,
        nivelEducativo: "",
        modalidad: "",
        turno: "",
        sostenimiento: "",
        categoria: ""
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const warningText = "Por favor llena este espacio";
    const inputCls = (fieldName) =>
        `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
            invalidFields.includes(fieldName)
                ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        }`;

    const clearFieldError = (fieldName) => {
        setInvalidFields((prev) => prev.filter((item) => item !== fieldName));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        clearFieldError(name);
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        if (!validateFormBeforeSubmit(e, null, setInvalidFields)) return;
        e.preventDefault();
        try {
            await agregarEscuela(formData);
            alert("Escuela registrada con éxito");
            navigate("/escuelas");
        } catch (error) {
            console.error(error);
            alert("Error al guardar los datos");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-10 lg:px-14 lg:py-10">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
                <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm md:p-9">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
                                Panel de registro
                            </span>
                            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl">
                                Registrar Nueva Escuela
                            </h1>
                            <p className="mt-2 text-base leading-7 text-slate-600 md:text-lg">
                                Captura la información principal de la escuela para agregarla al sistema.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/escuelas")}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                        >
                            Volver al catálogo
                        </button>
                    </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="grid gap-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Nombre de la Escuela</label>
                            <input
                                className={inputCls("nombre")}
                                name="nombre"
                                placeholder="Nombre de la Escuela"
                                onChange={handleChange}
                                required
                            />
                            {invalidFields.includes("nombre") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Plantel</label>
                            <input
                                className={inputCls("plantel")}
                                name="plantel"
                                placeholder="Plantel"
                                onChange={handleChange}
                                required
                            />
                            {invalidFields.includes("plantel") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">CCT</label>
                            <input
                                className={inputCls("cct")}
                                name="cct"
                                placeholder="CCT (Clave de Centro de Trabajo)"
                                onChange={handleChange}
                                required
                            />
                            {invalidFields.includes("cct") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Municipio</label>
                            <input
                                className={inputCls("municipio")}
                                name="municipio"
                                placeholder="Municipio"
                                onChange={handleChange}
                                required
                            />
                            {invalidFields.includes("municipio") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Ubicación</label>
                            <input
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                name="ubicacion"
                                placeholder="Coordenadas (Lat, Long)"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Dirección Completa</label>
                            <input
                                className={inputCls("direccion")}
                                name="direccion"
                                placeholder="Dirección Completa"
                                onChange={handleChange}
                                required
                            />
                            {invalidFields.includes("direccion") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Personal Escolar</label>
                            <input
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                name="personal_escolar"
                                type="number"
                                placeholder="Cantidad de personal"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Estudiantes</label>
                            <input
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                name="estudiantes"
                                type="number"
                                placeholder="Cantidad de estudiantes"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Nivel Educativo</label>
                            <select
                                className={inputCls("nivelEducativo")}
                                name="nivelEducativo"
                                onChange={handleChange}
                                required
                            >
                                <option value="">Nivel Educativo</option>
                                <option value="Preescolar">Preescolar</option>
                                <option value="Primaria">Primaria</option>
                                <option value="Secundaria">Secundaria</option>
                                <option value="Media Superior">Media Superior</option>
                                <option value="Superior">Superior</option>
                                <option value="Especial">Especial</option>
                            </select>
                            {invalidFields.includes("nivelEducativo") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Modalidad</label>
                            <input
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                name="modalidad"
                                placeholder="Modalidad (Escolarizada, Técnica...)"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Turno</label>
                            <select
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                name="turno"
                                onChange={handleChange}
                            >
                                <option value="">Turno</option>
                                <option value="Matutino">Matutino</option>
                                <option value="Vespertino">Vespertino</option>
                                <option value="Nocturno">Nocturno</option>
                                <option value="Mixto">Mixto</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Sostenimiento</label>
                            <input
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                name="sostenimiento"
                                placeholder="Sostenimiento (Público/Privado)"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Categoría</label>
                            <select
                                className={inputCls("categoria")}
                                name="categoria"
                                onChange={handleChange}
                                required
                            >
                                <option value="">Categoría</option>
                                <option value="Material">Material</option>
                                <option value="Infraestructura">Infraestructura</option>
                                <option value="Formacion">Formación</option>
                                <option value="Salud">Salud</option>
                            </select>
                            {invalidFields.includes("categoria") && <p className="text-xs font-medium text-red-600">{warningText}</p>}
                        </div>

                        <div className="mt-2 flex md:col-span-2 md:justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                            >
                                Guardar Escuela en el Sistema
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import Tarjeta from "./Tarjeta";

export default function Buscador({escuelas}){
    const [searchInp, setSearchInp] = useState("");
    const [levelInp, setLevInp] = useState("");

    // Derived from the actual data — no hardcoding needed.
    // When the DB has new levels they appear here automatically.
    const niveles = [...new Set(
        escuelas.map(e => e.nivelEducativo).filter(Boolean)
    )].sort();
    const [categInp, setCategInp] = useState("");
    const [munInp, setMunInp] = useState("");


    function handleChange(event) {
        const { name, value } = event.target;

        if (name === 'search') setSearchInp(value.toLowerCase());
        if (name === 'level') setLevInp(value.toLowerCase());
        if (name === 'categoria') setCategInp(value.toLowerCase());
        if (name === 'municipio') setMunInp(value.toLowerCase());

    };

    const filteredSchools = escuelas.filter((school) => {
        const schoolName = school.nombre?.toLowerCase() || "";
        const schoolLevel = school.nivelEducativo?.toLowerCase() || "";
        const schoolCateg = Array.isArray(school.categoria) ? school.categoria : [];;
        const schoolMun = school.municipio?.toLowerCase() || "";


        const mathchesName = schoolName.includes(searchInp);
        const mathchesLevel = !levelInp || schoolLevel === levelInp;
        const matchesCateg = !categInp || schoolCateg.some((cat) => cat.toLowerCase() === categInp);
        const matchesMun = !munInp || schoolMun === munInp;

        return mathchesName && mathchesLevel && matchesCateg && matchesMun;

    });

    console.log("Buscador escuelas:", escuelas);

    return (
        <>
            <form
                action=""
                id="filter"
                className="mb-8 grid grid-cols-1 gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4"
            >
                <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    type="text"
                    name="search"
                    placeholder="Buscar escuela"
                    value={searchInp}
                    onChange={handleChange}
                />

                <select
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    name="level"
                    id="lvel"
                    value={levelInp}
                    onChange={handleChange}
                >
                    <option value="">Todas las escolaridades</option>
                    {niveles.map(nivel => (
                        <option key={nivel} value={nivel.toLowerCase()}>{nivel}</option>
                    ))}
                </select>

                <select
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    name="categoria"
                    id="categoria"
                    value={categInp}
                    onChange={handleChange}
                >
                    <option value="">Todas las categorías</option>
                    <option value="material">Material</option>
                    <option value="infraestructura">Infraestructura</option>
                    <option value="formacion">Formación</option>
                    <option value="salud">Salud</option>
                </select>

                <select
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    name="municipio"
                    id="municipio"
                    value={munInp}
                    onChange={handleChange}
                >
                    <option value="">Todos los municipios</option>
                    <option value="arandas">Arandas</option>
                    <option value="san pedro tlaquepaque">San Pedro Tlaquepaque</option>
                    <option value="san juan de los lagos">San Juan de los Lagos</option>
                    <option value="zapopan">Zapopan</option>
                </select>
            </form>

            {filteredSchools.length > 0 ? (
                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredSchools.map((escuela) => (
                        <Tarjeta key={escuela.id_escuela} escuela={escuela} />
                    ))}
                </div>
            ) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                    <h3 className="text-lg font-semibold text-slate-700">No se encontraron escuelas</h3>
                    <p className="mt-2 text-sm text-slate-500">Prueba ajustando los filtros para ver más resultados.</p>
                </div>
            )}
        </>
    )
}
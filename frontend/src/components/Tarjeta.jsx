import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import locationIcon from "../assets/location_icon.png"

const CAT_COLORS = {
  infraestructura: "bg-blue-500",
  material:        "bg-amber-400",
  formacion:       "bg-purple-500",
  salud:           "bg-rose-500",
};

export default function Tarjeta({ escuela }) {
    const navigate = useNavigate();
    const [fotoIndex, setFotoIndex] = useState(0);

    function manejarClick(event) {
        event.preventDefault();
        event.stopPropagation();
        navigate(`/escuelas/${escuela?.id_escuela ?? escuela?.id}`);
    }

    const categorias = Array.isArray(escuela.categoria)
        ? escuela.categoria.filter(Boolean)
        : [];

    const fotos = Array.isArray(escuela.fotos) && escuela.fotos.length > 0
        ? escuela.fotos
        : (escuela.foto_url ? [escuela.foto_url] : []);
    const current = fotos.length ? fotoIndex % fotos.length : 0;

    function stop(e) {
        e.preventDefault();
        e.stopPropagation();
    }


    return (
        <article className="h-full w-full">
            <div
                className="flex h-full min-h-[580px] w-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
                {/* Image / placeholder */}
                <div className="relative h-52 border-b border-slate-200 bg-gradient-to-br from-emerald-100 via-white to-emerald-50">
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-emerald-900/10 to-transparent" />
                    <div className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        {escuela.nivelEducativo || "Escuela"}
                    </div>
                    {fotos.length > 0 ? (
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                key={fotos[current]}
                                className="h-full w-full object-cover"
                                src={fotos[current]}
                                alt={`${escuela.nombre} — foto ${current + 1}`}
                            />

                            {fotos.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            stop(e);
                                            setFotoIndex((i) => (i - 1 + fotos.length) % fotos.length);
                                        }}
                                        aria-label="Foto anterior"
                                        className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-base font-bold text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            stop(e);
                                            setFotoIndex((i) => (i + 1) % fotos.length);
                                        }}
                                        aria-label="Siguiente foto"
                                        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-base font-bold text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
                                    >
                                        ›
                                    </button>

                                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2 py-1 backdrop-blur">
                                        {fotos.map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={(e) => {
                                                    stop(e);
                                                    setFotoIndex(i);
                                                }}
                                                aria-label={`Ir a foto ${i + 1}`}
                                                className={`h-1.5 rounded-full transition-all ${
                                                    i === current ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-black text-emerald-200 select-none">
                                {escuela.nombre?.[0]?.toUpperCase() ?? "E"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex h-full flex-1 flex-col p-6">
                    <div className="space-y-2">
                        <h1 className="text-[1.05rem] font-bold leading-snug text-slate-900 sm:text-[1.15rem]">
                            {escuela.nombre}
                        </h1>
                        <address className="not-italic">
                            <span className="flex items-center gap-2 text-sm text-slate-600">
                                <img className="h-4 w-4 object-contain opacity-80" src={locationIcon} alt="" />
                                <span>{escuela.municipio}</span>
                            </span>
                        </address>
                    </div>

                    {/* Category badges */}
                    {categorias.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {categorias.map(cat => (
                                <span
                                    key={cat}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ${CAT_COLORS[cat.toLowerCase()] ?? "bg-slate-400"}`}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="mt-4 flex gap-4 text-sm text-slate-600">
                        {escuela.estudiantes > 0 && (
                            <span><strong className="text-slate-800">{escuela.estudiantes}</strong> estudiantes</span>
                        )}
                        {escuela.modalidad && (
                            <span className="truncate text-slate-500">{escuela.modalidad}</span>
                        )}
                    </div>


                    <button
                        className="mt-auto w-full rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                        onClick={manejarClick}
                    >
                        Ver Detalles
                    </button>
                </div>
            </div>
        </article>
    );
}

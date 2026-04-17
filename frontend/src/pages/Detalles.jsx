import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEscuelaById, getNecesidadesByEscuela } from "../services/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PopUp from "../components/PopUp";
import PopUpDonativos from "../components/PopUpDonativos";
import locationIcon from "../assets/location_icon.png";
import schoolIcon from "../assets/school_icon_32px.png";

const ESTADO_CLS = {
    "Pendiente":    "border-slate-200 bg-white text-slate-700",
    "En progreso":  "border-blue-200 bg-blue-50 text-blue-700",
    "Completada":   "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function Detalles() {
    const [escuela, setEscuela] = useState(null);
    const [necesidades, setNecesidades] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [showContactPopup, setShowContactPopup] = useState(false);
    const [fotoIndex, setFotoIndex] = useState(0);

    useEffect(() => {
        setFotoIndex(0);
    }, [id]);

    useEffect(() => {
        async function load() {
            try {
                const res = await getEscuelaById(id);
                setEscuela(res.data);
                const necRes = await getNecesidadesByEscuela(id);
                setNecesidades(necRes.data || []);
            } catch (e) {
                console.log(e);
            }
        }
        load();
    }, [id]);

    function getMeaningfulPart(direccion) {
        if (!direccion) return "";
        const invalid = ["desconocido", "s/n", "sin número", "sin numero"];
        const parts = direccion.split(",").map(p => p.trim())
            .filter(p => p !== "" && !invalid.includes(p.toLowerCase()));
        return parts[0] || direccion;
    }

    const totalNeeds = necesidades.length;

    return (
        <div className="min-h-screen bg-slate-50">
            <NavBar />

            <main className="px-6 py-8 md:px-10 lg:px-14 lg:py-10">
                <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            onClick={() => navigate("/escuelas")}
                            className="inline-flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
                        >
                            <span className="text-lg">←</span>
                            <span>Volver al Catálogo</span>
                        </button>
                    </div>

                    <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
                        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm md:p-9">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-5xl">
                                        {escuela?.nombre || "Cargando..."}
                                    </h1>
                                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-600">
                                        <div className="flex items-center gap-2.5 text-lg">
                                            <img className="h-5 w-5 object-contain opacity-80" src={locationIcon} alt="" />
                                            <span>{`${getMeaningfulPart(escuela?.direccion)}${escuela?.direccion ? ", " : ""}${escuela?.municipio}, Jal.`}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-lg">
                                            <img className="h-5 w-5 object-contain opacity-80" src={schoolIcon} alt="" />
                                            <span>{escuela?.nivelEducativo}</span>
                                        </div>
                                    </div>
                                    {escuela?.cct && (
                                        <p className="mt-3 text-sm text-slate-400">CCT: {escuela.cct}</p>
                                    )}
                                </div>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                                    {`${totalNeeds} ${totalNeeds === 1 ? "necesidad" : "necesidades"}`}
                                </span>
                            </div>
                        </div>

                        <aside className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">
                            <h2 className="text-2xl font-bold text-slate-900">Resumen General</h2>

                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <div className="grid grid-cols-[1fr_auto] gap-y-4 text-lg">
                                    <span className="text-slate-500">Necesidades activas:</span>
                                    <span className="font-semibold text-slate-900">{totalNeeds}</span>

                                    <span className="text-slate-500">Municipio:</span>
                                    <span className="font-semibold text-slate-900">{escuela?.municipio}</span>

                                    <span className="text-slate-500">Nivel:</span>
                                    <span className="font-semibold text-slate-900">{escuela?.nivelEducativo}</span>

                                    {escuela?.modalidad && <>
                                        <span className="text-slate-500">Modalidad:</span>
                                        <span className="font-semibold text-slate-900">{escuela.modalidad}</span>
                                    </>}

                                    {escuela?.turno && <>
                                        <span className="text-slate-500">Turno:</span>
                                        <span className="font-semibold text-slate-900">{escuela.turno}</span>
                                    </>}

                                    {escuela?.estudiantes > 0 && <>
                                        <span className="text-slate-500">Estudiantes:</span>
                                        <span className="font-semibold text-slate-900">{escuela.estudiantes}</span>
                                    </>}

                                    {escuela?.personal_escolar > 0 && <>
                                        <span className="text-slate-500">Personal:</span>
                                        <span className="font-semibold text-slate-900">{escuela.personal_escolar}</span>
                                    </>}
                                </div>
                            </div>
                        </aside>
                    </section>

                    {/* Photo placeholder */}
                    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        <h2 className="text-center text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl">
                            Conoce Nuestras Instalaciones
                        </h2>

                        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#f8fafc_55%,#ffffff_100%)]">
                            {escuela?.fotos?.length > 0 ? (
                                <div className="relative h-[340px] w-full overflow-hidden bg-slate-100 md:h-[480px]">
                                    <img
                                        key={escuela.fotos[fotoIndex % escuela.fotos.length]}
                                        src={escuela.fotos[fotoIndex % escuela.fotos.length]}
                                        alt={`${escuela.nombre} — foto ${(fotoIndex % escuela.fotos.length) + 1}`}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />

                                    {escuela.fotos.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFotoIndex((i) =>
                                                        (i - 1 + escuela.fotos.length) % escuela.fotos.length
                                                    )
                                                }
                                                aria-label="Foto anterior"
                                                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl font-bold text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
                                            >
                                                ‹
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFotoIndex((i) => (i + 1) % escuela.fotos.length)
                                                }
                                                aria-label="Siguiente foto"
                                                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl font-bold text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
                                            >
                                                ›
                                            </button>

                                            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur">
                                                {escuela.fotos.map((_, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setFotoIndex(i)}
                                                        aria-label={`Ir a foto ${i + 1}`}
                                                        className={`h-2 rounded-full transition-all ${
                                                            i === fotoIndex % escuela.fotos.length
                                                                ? "w-6 bg-white"
                                                                : "w-2 bg-white/60 hover:bg-white/90"
                                                        }`}
                                                    />
                                                ))}
                                            </div>

                                            <div className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                                                {(fotoIndex % escuela.fotos.length) + 1} / {escuela.fotos.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex h-[340px] items-center justify-center px-6 text-center md:h-[420px]">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700/80">
                                            Mi Escuela Primero
                                        </p>
                                        <p className="mt-4 text-xl text-slate-500 md:text-2xl">
                                            Espacio reservado para imágenes de la escuela
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">{escuela?.nombre}</h3>
                                    <p className="mt-1 text-base text-slate-500">{`${totalNeeds} necesidad${totalNeeds === 1 ? "" : "es"} activa${totalNeeds === 1 ? "" : "s"}`}</p>
                                </div>
                                <button
                                    onClick={() => setShowPopup(true)}
                                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                                >
                                    Apoyar esta Escuela
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Needs */}
                    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl">
                            Necesidades Específicas
                        </h2>

                        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
                            <div className="space-y-6">
                                {necesidades.length === 0 ? (
                                    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                                        Esta escuela no tiene necesidades registradas.
                                    </div>
                                ) : (
                                    necesidades.map((n, i) => {
                                        const cantidad = Number(n.monto_requerido) || 0;
                                        return (
                                            <article key={n.id_necesidad} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 md:p-8">
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">#{i + 1}</span>
                                                        {n.subcategoria && (
                                                            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                                                                {n.subcategoria}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {n.categoria && (
                                                        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                                                            {n.categoria}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-slate-900 md:text-3xl">
                                                    {n.titulo}
                                                </h3>

                                                {n.descripcion && n.descripcion !== n.titulo && (
                                                    <p className="mt-4 text-lg leading-9 text-slate-600">{n.descripcion}</p>
                                                )}

                                                {cantidad > 0 && (
                                                    <div className="mt-6 flex items-center gap-2">
                                                        <span className="text-slate-500 text-lg">Cantidad requerida:</span>
                                                        <span className="font-extrabold text-slate-900 text-lg">
                                                            {cantidad}{n.unidad ? ` ${n.unidad}` : ""}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                                                    {n.estado && (
                                                        <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${ESTADO_CLS[n.estado] ?? "border-slate-200 bg-white text-slate-700"}`}>
                                                            {n.estado}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => setShowPopup(true)}
                                                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                                                    >
                                                        Apoyar
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })
                                )}
                            </div>

                            <div className="space-y-8">
                                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
                                        <img className="h-6 w-6 object-contain" src={locationIcon} alt="" />
                                        <h3 className="text-2xl font-bold text-slate-900">Ubicación de la Escuela</h3>
                                    </div>

                                    {(escuela?.direccion || escuela?.nombre) ? (
                                        <div className="h-[320px] overflow-hidden">
                                            <iframe
                                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${encodeURIComponent(
                                                    [
                                                        getMeaningfulPart(escuela?.direccion) || escuela?.nombre,
                                                        escuela?.municipio,
                                                        "Jalisco, México"
                                                    ].filter(Boolean).join(", ")
                                                )}`}
                                                className="h-full w-full border-0"
                                                title="Mapa"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-[320px] items-center justify-center bg-[linear-gradient(135deg,#e2e8f0_0%,#f8fafc_100%)] text-center">
                                            <div>
                                                <p className="text-lg font-semibold text-slate-600">Mapa de la escuela</p>
                                                <p className="mt-2 text-slate-500">Ubicación no disponible</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t border-slate-200 px-6 py-5 text-lg text-slate-700">
                                        <span className="font-bold text-slate-900">Dirección:</span>{" "}
                                        {`${getMeaningfulPart(escuela?.direccion)}${escuela?.direccion ? ", " : ""}${escuela?.municipio}, Jal.`}
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm md:p-8">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-start gap-5">
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                                                <img className="h-8 w-8 object-contain" src={schoolIcon} alt="" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-3xl font-bold tracking-[-0.03em] text-slate-900">
                                                    ¿Necesitas más información?
                                                </h3>
                                                <p className="mt-2 text-lg leading-8 text-slate-600">
                                                    Nuestro equipo está disponible para resolver cualquier duda sobre esta escuela o sus necesidades.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-center text-sm font-semibold leading-6 text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                                            onClick={() => setShowContactPopup(true)}
                                        >
                                            Quiero que se Comuniquen Conmigo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 lg:px-14">
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{escuela?.nombre}</p>
                        <p className="mt-1 text-base text-slate-500">{`${totalNeeds} necesidad${totalNeeds === 1 ? "" : "es"} activa${totalNeeds === 1 ? "" : "s"}`}</p>
                    </div>
                    <button
                        onClick={() => setShowPopup(true)}
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                    >
                        Apoyar esta Escuela
                    </button>
                </div>
            </div>

            {showPopup && <PopUp closePopup={() => setShowPopup(false)} escuela={escuela} />}
            {showContactPopup && <PopUpDonativos closePopup={() => setShowContactPopup(false)} escuela={escuela} />}
            <Footer />
        </div>
    );
}

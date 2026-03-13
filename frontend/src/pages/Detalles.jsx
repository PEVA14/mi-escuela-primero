import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getEscuelaById } from "../services/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PopUp from "../components/PopUp";
import locationIcon from "../assets/location_icon.png";
import calendarIcon from "../assets/calendar_icon.png";
import schoolIcon from "../assets/school_icon_32px.png";

export default function Detalles() {
    const [escuela, setEscuela] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const res = await getEscuelaById(id);
                console.log(res.data);
                setEscuela(res.data);
            } catch (e) {
                console.log(e);
            }
        }
        load();
    }, [id]);

    function redirect() {
        navigate("/escuelas");
    }

    const [showPopup, setShowPopup] = useState(false);

    function popup() {
        setShowPopup(true);
    }

    function closePopup() {
        setShowPopup(false);
    }

    function getMeaningfulPart(direccion) {
        if (!direccion) return "";

        const invalidParts = ["desconocido", "s/n", "sin número", "sin numero"];

        const parts = direccion
            .split(",")
            .map((part) => part.trim())
            .filter((part) => part !== "" && !invalidParts.includes(part.toLowerCase()));

        return parts[0] || direccion;
    }

    const totalNeeds = Array.isArray(escuela?.categoria)
        ? escuela.categoria.length
        : escuela?.categoria
          ? 1
          : 0;

    const firstCategory = Array.isArray(escuela?.categoria)
        ? escuela.categoria[0]
        : escuela?.categoria || "Infraestructura";

    return (
        <div className="min-h-screen bg-slate-50">
            <NavBar />

            <main className="px-6 py-8 md:px-10 lg:px-14 lg:py-10">
                <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-10">
                    <button
                        onClick={redirect}
                        className="inline-flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
                    >
                        <span className="text-lg">←</span>
                        <span>Volver al Catálogo</span>
                    </button>

                    <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
                        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm md:p-9">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-5xl">
                                        {escuela?.nombre || "Cargando escuela..."}
                                    </h1>

                                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-600">
                                        <div className="flex items-center gap-2.5 text-lg">
                                            <img className="h-5 w-5 object-contain opacity-80" src={locationIcon} alt="location.png" />
                                            <span>{`${getMeaningfulPart(escuela?.direccion)}, ${escuela?.municipio}, Jal.`}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-lg">
                                            <img className="h-5 w-5 object-contain opacity-80" src={schoolIcon} alt="escuela.png" />
                                            <span>{escuela?.nivelEducativo}</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center gap-2.5 text-base text-slate-500 md:text-lg">
                                        <img className="h-5 w-5 object-contain opacity-70" src={calendarIcon} alt="calendar.png" />
                                        <span>Última actualización: 11 de marzo de 2026</span>
                                    </div>
                                </div>

                                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                                    {`${totalNeeds} ${totalNeeds === 1 ? "necesidad" : "necesidades"}`}
                                </span>
                            </div>
                        </div>

                        <aside className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">
                            <h2 className="text-2xl font-bold text-slate-900">Resumen General</h2>

                            <div className="mt-8 flex items-center justify-between gap-6 text-lg">
                                <div>
                                    <p className="text-slate-500">Recaudado:</p>
                                    <p className="font-extrabold text-slate-900">$130,000</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500">Meta:</p>
                                    <p className="font-extrabold text-slate-900">$645,000</p>
                                </div>
                            </div>

                            <div className="mt-4 h-3 overflow-hidden rounded-full bg-emerald-100">
                                <div className="h-full w-[20%] rounded-full bg-emerald-600"></div>
                            </div>

                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <div className="grid grid-cols-[1fr_auto] gap-y-4 text-lg">
                                    <span className="text-slate-500">Necesidades activas:</span>
                                    <span className="font-semibold text-slate-900">{totalNeeds}</span>

                                    <span className="text-slate-500">Ubicación:</span>
                                    <span className="font-semibold text-slate-900">{escuela?.municipio}</span>

                                    <span className="text-slate-500">Nivel:</span>
                                    <span className="font-semibold text-slate-900">{escuela?.nivelEducativo}</span>
                                </div>
                            </div>
                        </aside>
                    </section>

                    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        <h2 className="text-center text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl">
                            Conoce Nuestras Instalaciones
                        </h2>

                        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#f8fafc_55%,#ffffff_100%)]">
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

                            <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">{escuela?.nombre}</h3>
                                    <p className="mt-1 text-base text-slate-500">{`${totalNeeds} necesidad${totalNeeds === 1 ? "" : "es"} activa${totalNeeds === 1 ? "" : "s"}`}</p>
                                </div>

                                <button
                                    onClick={popup}
                                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                                >
                                    Apoyar esta Escuela
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                        <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl">
                            Necesidades Específicas
                        </h2>

                        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
                            <div className="space-y-6">
                                <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 md:p-8">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">#1</span>
                                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                                                Media
                                            </span>
                                        </div>

                                        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                                            {firstCategory}
                                        </span>
                                    </div>

                                    <h3 className="mt-6 text-3xl font-bold tracking-[-0.03em] text-slate-900">
                                        Baños y sanitarios en mal estado
                                    </h3>

                                    <p className="mt-6 text-lg leading-9 text-slate-600">
                                        Los baños de la escuela requieren remodelación urgente, incluyendo nuevos inodoros, lavabos, espejos y sistema de drenaje para garantizar condiciones higiénicas adecuadas.
                                    </p>

                                    <div className="mt-8 flex items-center justify-between gap-6 text-lg">
                                        <div>
                                            <p className="text-slate-500">Recaudado:</p>
                                            <p className="font-extrabold text-slate-900">$50,000</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-500">Meta:</p>
                                            <p className="font-extrabold text-slate-900">$280,000</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-emerald-100">
                                        <div className="h-full w-[18%] rounded-full bg-emerald-600"></div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-lg">
                                        <span className="font-bold text-emerald-700">18% completado</span>
                                        <span className="text-slate-500">Faltan $230,000</span>
                                    </div>

                                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                                        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                                            Pendiente
                                        </span>

                                        <button
                                            onClick={popup}
                                            className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                                        >
                                            Apoyar
                                        </button>
                                    </div>
                                </article>

                                <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 md:p-8">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">#2</span>
                                            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                                                Alta
                                            </span>
                                        </div>

                                        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                                            Mobiliario
                                        </span>
                                    </div>

                                    <h3 className="mt-6 text-3xl font-bold tracking-[-0.03em] text-slate-900">
                                        Pupitres y escritorios para aulas
                                    </h3>

                                    <p className="mt-6 text-lg leading-9 text-slate-600">
                                        La escuela necesita renovar pupitres, escritorios y sillas para mejorar las condiciones de aprendizaje y asegurar que cada alumno cuente con mobiliario digno y funcional.
                                    </p>

                                    <div className="mt-8 flex items-center justify-between gap-6 text-lg">
                                        <div>
                                            <p className="text-slate-500">Recaudado:</p>
                                            <p className="font-extrabold text-slate-900">$95,000</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-500">Meta:</p>
                                            <p className="font-extrabold text-slate-900">$180,000</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-emerald-100">
                                        <div className="h-full w-[53%] rounded-full bg-emerald-600"></div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-lg">
                                        <span className="font-bold text-emerald-700">53% completado</span>
                                        <span className="text-slate-500">Faltan $85,000</span>
                                    </div>

                                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                                        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                                            En progreso
                                        </span>

                                        <button
                                            onClick={popup}
                                            className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                                        >
                                            Apoyar
                                        </button>
                                    </div>
                                </article>
                            </div>

                            <div className="space-y-8">
                                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
                                        <img className="h-6 w-6 object-contain" src={locationIcon} alt="location.png" />
                                        <h3 className="text-2xl font-bold text-slate-900">Ubicación de la Escuela</h3>
                                    </div>

                                    <div className="flex h-[320px] items-center justify-center bg-[linear-gradient(135deg,#e2e8f0_0%,#f8fafc_100%)] text-center">
                                        <div>
                                            <p className="text-lg font-semibold text-slate-600">Mapa de la escuela</p>
                                            <p className="mt-2 text-slate-500">Aquí irá la integración del mapa</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 px-6 py-5 text-lg text-slate-700">
                                        <span className="font-bold text-slate-900">Dirección:</span>{" "}
                                        {`${getMeaningfulPart(escuela?.direccion)}, ${escuela?.municipio}, Jal.`}
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm md:p-8">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-start gap-5">
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                                                <img className="h-8 w-8 object-contain" src={schoolIcon} alt="escuela.png" />
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
                                            onClick={popup}
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
                        onClick={popup}
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                    >
                        Apoyar esta Escuela
                    </button>
                </div>
            </div>

            {showPopup && <PopUp closePopup={closePopup} escuela={escuela} />}
            <Footer />
        </div>
    );
}
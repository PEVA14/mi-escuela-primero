import { useNavigate } from 'react-router-dom';
import locationIcon from "../assets/location_icon.png"
import calendarIcon from "../assets/calendar_icon.png"
import Badge from './Badge';

export default function Tarjeta( {escuela}) {
    const navigate = useNavigate();

    function manejarClick() {
        navigate(`/escuelas/${escuela.id_escuela}`);
    }
    console.log(escuela.categoria);

   return (
        <article className="h-full w-full">
            <div
                key={escuela.id_escuela}
                className="flex h-full min-h-[680px] w-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
                <div className="relative h-60 border-b border-slate-200 bg-gradient-to-br from-emerald-100 via-white to-emerald-50">
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-emerald-900/10 to-transparent"></div>
                    <div className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        {escuela.nivelEducativo || "Escuela"}
                    </div>
                    <div className="flex h-full items-center justify-center px-6 text-center">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-700/80">Mi Escuela Primero</p>
                            <p className="mt-3 text-sm text-slate-500">Espacio reservado para imagen</p>
                        </div>
                    </div>
        <div>
                <div key={escuela.id_escuela} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h1>{escuela.nombre} </h1>
                    {
                    escuela.categoria.map(es => {
                        return <Badge content={es}/>
                    })}
                    <address>
                        <span> 
                            <img src={locationIcon} alt=""/> {escuela.municipio}
                        </span>
                    </address>

                    <button onClick={manejarClick}> Ver Detalles </button>
                    <small> <img src={calendarIcon} alt=""/> Actualizado: 11 de marzo de 2026</small>
                </div>

                <div className="flex h-full flex-1 flex-col p-6">
                    <div className="space-y-2.5">
                        <h1 className="text-[1.05rem] font-bold leading-snug text-slate-900 sm:text-[1.15rem]">
                            {escuela.nombre}
                        </h1>

                        <address className="not-italic">
                            <span className="flex items-center gap-2 text-base text-slate-600">
                                <img className="h-4 w-4 object-contain opacity-80" src={locationIcon} alt="" />
                                <span>{escuela.municipio}</span>
                            </span>
                        </address>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-white shadow-sm">Infraestructura</span>
                        <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-white shadow-sm">Tecnología</span>
                        <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-white shadow-sm">Mobiliario</span>
                    </div>

                    <div className="mt-5 space-y-2.5 text-slate-700">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">Necesidad principal:</p>
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                Urgente
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600">
                            Apoyo prioritario para fortalecer las condiciones del plantel.
                        </p>
                    </div>

                    <div className="mt-5 space-y-2.5">
                        <div className="h-2.5 overflow-hidden rounded-full bg-emerald-100">
                            <div className="h-full w-[18%] rounded-full bg-emerald-600"></div>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                            <span className="font-semibold text-emerald-700">18% completado</span>
                            <span className="text-slate-500">Meta pendiente</span>
                        </div>
                    </div>

                    <div className="mt-5 mb-4 flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                        <img className="h-4 w-4 object-contain opacity-70" src={calendarIcon} alt="" />
                        <small>Actualizado: 11 de marzo de 2026</small>
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

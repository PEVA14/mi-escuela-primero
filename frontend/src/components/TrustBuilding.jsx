import transparenci from "../assets/login_password_icon.png";

export default function TrustBuilding() {
    return (
        <section
            id="trust-building"
            className="bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#ecfdf5_52%,#f0fdf4_100%)] px-6 py-20 text-slate-900"
        >
            <div className="mx-auto w-full max-w-[1280px]">
                <div className="mx-auto mb-11 max-w-[860px] text-center">
                    <span className="mb-5 inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-[0.92rem] font-bold text-emerald-700 shadow-sm">
                        Confianza y transparencia
                    </span>
                    <h2 className="m-0 text-[clamp(2rem,4.8vw,4.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-900">
                        Resultados claros, seguimiento real y procesos confiables
                    </h2>
                    <p className="mx-auto mt-6 max-w-[760px] text-[clamp(1rem,1.6vw,1.3rem)] leading-[1.7] text-slate-600">
                        Construimos confianza con métricas visibles, seguimiento puntual y transparencia en cada etapa del apoyo a las escuelas.
                    </p>
                </div>

                <div className="grid items-start gap-6 rounded-[30px] border border-white/40 bg-white/95 p-8 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.16)] md:grid-cols-[120px_minmax(0,1fr)] md:p-8">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-b from-emerald-100 to-emerald-200 md:mx-0">
                        <img className="h-8 w-8 object-contain" src={transparenci} alt="Compromiso con la transparencia" />
                    </div>

                    <div className="text-center md:text-left">
                        <span className="mb-3 inline-block text-[0.92rem] font-extrabold uppercase tracking-[0.08em] text-emerald-600">
                            Compromiso con la transparencia
                        </span>
                        <h3 className="m-0 text-[clamp(1.5rem,2vw,2.1rem)] font-extrabold leading-[1.15] text-slate-900">
                            Cada aportación puede rastrearse y comprobarse
                        </h3>
                        <p className="mt-4 text-base leading-8 text-slate-600">
                            En Mi Escuela Primero, nos tomamos muy en serio la confianza que depositás en nosotros. Cada donación es rastreada y verificada, y proporcionamos informes detallados sobre el impacto de cada contribución. Trabajamos directamente con las escuelas para asegurar que los recursos lleguen donde realmente se necesitan.
                        </p>

                        <ul className="mt-6 grid list-none grid-cols-1 gap-x-6 gap-y-4 p-0 md:grid-cols-2">
                            <li className="relative pl-6 text-[0.98rem] leading-[1.55] text-slate-800 before:absolute before:left-0 before:top-2 before:h-2.5 before:w-2.5 before:rounded-full before:bg-emerald-500 before:shadow-[0_0_0_6px_rgba(16,185,129,0.14)]">
                                Verificación directa de todas las necesidades escolares
                            </li>
                            <li className="relative pl-6 text-[0.98rem] leading-[1.55] text-slate-800 before:absolute before:left-0 before:top-2 before:h-2.5 before:w-2.5 before:rounded-full before:bg-emerald-500 before:shadow-[0_0_0_6px_rgba(16,185,129,0.14)]">
                                Seguimiento personalizado de cada proyecto
                            </li>
                            <li className="relative pl-6 text-[0.98rem] leading-[1.55] text-slate-800 before:absolute before:left-0 before:top-2 before:h-2.5 before:w-2.5 before:rounded-full before:bg-emerald-500 before:shadow-[0_0_0_6px_rgba(16,185,129,0.14)]">
                                Reportes de impacto con evidencia fotográfica
                            </li>
                            <li className="relative pl-6 text-[0.98rem] leading-[1.55] text-slate-800 before:absolute before:left-0 before:top-2 before:h-2.5 before:w-2.5 before:rounded-full before:bg-emerald-500 before:shadow-[0_0_0_6px_rgba(16,185,129,0.14)]">
                                Protección de datos según normativa mexicana
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
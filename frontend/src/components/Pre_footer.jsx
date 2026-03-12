import { useNavigate } from "react-router-dom";
import love_icon from "../assets/love_icon_32px.png";
import check from "../assets/check-mark-3281_64.png";

export default function Pre_footer() {
    const navigate = useNavigate();

    return (
        <section
            id="prefooter"
            className="bg-white px-6 py-16 md:px-10 lg:px-14 lg:py-20"
        >
            <div className="mx-auto w-full max-w-[1280px]">
                <div className="overflow-hidden rounded-[32px] border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#f8fafc_55%,#ffffff_100%)] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                    <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-12 text-center md:px-10 md:py-16">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
                            <img className="h-8 w-8 object-contain" src={love_icon} alt="love icon.png" />
                        </div>

                        <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl lg:text-5xl">
                            ¿Listo para hacer la diferencia?
                        </h2>

                        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                            Únete a nuestra red de aliados comprometidos con la educación. Cada aportación cuenta y cada escuela importa.
                        </p>

                        <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-slate-700 shadow-sm">
                                <img className="h-5 w-5 object-contain" src={check} alt="checkmark.png" />
                                <span className="text-sm font-semibold md:text-base">100% verificado</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-slate-700 shadow-sm">
                                <img className="h-5 w-5 object-contain" src={check} alt="checkmark.png" />
                                <span className="text-sm font-semibold md:text-base">Impacto verificado</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-4 text-slate-700 shadow-sm">
                                <img className="h-5 w-5 object-contain" src={check} alt="checkmark.png" />
                                <span className="text-sm font-semibold md:text-base">Fácil y rápido</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                className="rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                                onClick={() => navigate('/escuelas')}
                            >
                                Comenzar ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
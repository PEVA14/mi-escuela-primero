import { useNavigate } from 'react-router-dom';
import logo from "../assets/logoMEP.png";

export default function NavBar(){
    const navigate = useNavigate();

    return(
        <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 px-5 py-3 backdrop-blur-md md:px-8 lg:px-12">
            <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                    className="flex w-fit items-center gap-3 rounded-2xl bg-white text-left transition hover:opacity-90"
                    onClick={() => navigate('/')}
                    type="button"
                >
                    <img className="h-12 w-auto object-contain md:h-14" src={logo} alt="Mi Escuela Primero Logo.png" />
                    <div className="hidden sm:block">
                        <p className="text-base font-bold tracking-[-0.03em] text-slate-900">Mi Escuela Primero</p>
                        <p className="text-sm text-slate-500">Apoyo escolar con impacto real</p>
                    </div>
                </button>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <button
                        className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
                        onClick={() => navigate('/')}
                        type="button"
                    >
                        Inicio
                    </button>
                    <button
                        className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
                        onClick={() => navigate('/escuelas')}
                        type="button"
                    >
                        Explorar Escuelas
                    </button>
                    <button
                        className="rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                        onClick={() => navigate('/#movexp')}
                        type="button"
                    >
                        Como funciona
                    </button>
                    {/* <button className="navbar__button" onClick={() => navigate('')}>Contacto</button> */}
                </div>
            </div>
        </nav>
    )
}
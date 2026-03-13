import {useNavigate} from 'react-router-dom';
import school from '../assets/school_icon_32px.png';
import heart from '../assets/love_icon_32px.png';
import people from '../assets/people_icon_64px.png';


export default function Lobby(){
    const navigate = useNavigate();

    return(
        <section
            id="lobby"
            className="bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,#059669_0%,#059669_52%,#047857_100%)] px-6 py-16 md:px-10 lg:px-14 lg:py-20"
        >
            <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10">
                <div className="mx-auto max-w-4xl text-center">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-sm font-semibold text-emerald-50 shadow-sm backdrop-blur-md">
                        Impacto educativo con transparencia
                    </span>
                    <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
                        Conecta necesidades reales con oportunidades de impacto
                    </h1>
                    <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-emerald-50/90 md:text-lg">
                        Plataforma que une escuelas con necesidades específicas y donadores comprometidos. Transparente, fácil y con resultados medibles.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button
                        className="w-full rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800 sm:w-auto"
                        onClick={()=>navigate('/escuelas')}
                    >
                        Explorar Escuelas
                    </button>
                    <button
                        className="w-full rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 sm:w-auto"
                        onClick={()=>navigate('/#movexp')}
                    >
                        Como funciona
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="flex flex-col items-center rounded-[28px] border border-white/15 bg-white/10 px-6 py-8 text-center shadow-[0_18px_45px_rgba(4,120,87,0.2)] backdrop-blur-md">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                            <img className="h-8 w-8 object-contain" src={school} alt="escuela vector.png"/>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">99</h2>
                        <p className="mt-2 text-sm font-medium text-emerald-50/90">Escuelas registradas</p>
                    </div>
                    <div className="flex flex-col items-center rounded-[28px] border border-white/15 bg-white/10 px-6 py-8 text-center shadow-[0_18px_45px_rgba(4,120,87,0.2)] backdrop-blur-md">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                            <img className="h-8 w-8 object-contain" src={heart} alt="corazon vector.png"/>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">99</h2>
                        <p className="mt-2 text-sm font-medium text-emerald-50/90">Necesidades activas</p>
                    </div>
                    <div className="flex flex-col items-center rounded-[28px] border border-white/15 bg-white/10 px-6 py-8 text-center shadow-[0_18px_45px_rgba(4,120,87,0.2)] backdrop-blur-md">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                            <img className="h-8 w-8 object-contain" src={people} alt="gente vector.png"/>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">99</h2>
                        <p className="mt-2 text-sm font-medium text-emerald-50/90">Comunidades alcanzadas</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
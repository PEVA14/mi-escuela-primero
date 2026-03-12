import { redirect, useNavigate } from "react-router-dom";
import location from "../assets/location_icon.png"
import ListaTarjeta from "./ListaTarjeta.jsx"


export default function MuestraCatalogo(){
    const navigate = useNavigate();

    return(
        <section
            id="catalogSample"
            className="bg-slate-50 px-6 py-16 md:px-10 lg:px-14 lg:py-20"
        >
            <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                        <img className="h-4 w-4 object-contain" src={location} alt="location.png" />
                        <span>Impacto local</span>
                    </div>
                    <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl lg:text-5xl">
                        Escuelas que Necesitan Tu Apoyo
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                        Estas son algunas de las escuelas que actualmente necesitan apoyo. Cada una tiene necesidades específicas y verificadas.
                    </p>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-7 lg:p-8">
                    <ListaTarjeta mostrarBuscador={false} limite={3}/>

                    <div className="mt-8 flex justify-center">
                        <button
                            className="rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                            onClick={()=>navigate('/escuelas')}
                        >
                            Ver Todas Las Escuelas
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
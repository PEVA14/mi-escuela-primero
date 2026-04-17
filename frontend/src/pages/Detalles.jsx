import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEscuelaById, getNecesidadesByEscuela } from "../services/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PopUp from "../components/PopUp";
import PopUpDonativos from "../components/PopUpDonativos";
import locationIcon from "../assets/location_icon.png";
import schoolIcon from "../assets/school_icon_32px.png";

// --- CONFIGURACIÓN DE LEAFLET ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix para el icono de marcador en React
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente para que el mapa se mueva cuando cambien las coordenadas
function ActualizarCentroMapa({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView(coords, 16);
        }
    }, [coords, map]);
    return null;
}

const ESTADO_CLS = {
    "Pendiente":    "border-slate-200 bg-white text-slate-700",
    "En progreso":  "border-blue-200 bg-blue-50 text-blue-700",
    "Completada":   "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function Detalles() {
    const [escuela, setEscuela] = useState(null);
    const [necesidades, setNecesidades] = useState([]);
    const [coords, setCoords] = useState([20.6597, -103.3496]); // Guadalajara por defecto
    const { id } = useParams();
    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [showContactPopup, setShowContactPopup] = useState(false);
    const [fotoIndex, setFotoIndex] = useState(0);

    // Carga inicial de datos
    useEffect(() => {
        async function load() {
            try {
                const res = await getEscuelaById(id);
                setEscuela(res.data);
                const necRes = await getNecesidadesByEscuela(id);
                setNecesidades(necRes.data || []);
            } catch (e) {
                console.log("Error cargando escuela:", e);
            }
        }
        load();
    }, [id]);

    // Buscador de coordenadas (Geocoding) basado en la dirección de la BD
    useEffect(() => {
        async function buscarCoordenadas() {
            if (escuela?.direccion) {
                const direccionLimpia = getMeaningfulPart(escuela.direccion);
                const query = `${direccionLimpia}, ${escuela.municipio}, Jalisco, Mexico`;
                
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
                    );
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    }
                } catch (error) {
                    console.error("Error buscando ubicación:", error);
                }
            }
        }
        buscarCoordenadas();
    }, [escuela]);

    function getMeaningfulPart(direccion) {
        if (!direccion) return "";
        const invalid = ["desconocido", "s/n", "sin número", "sin numero", "sin nombre conocido"];
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
                        </div>

                        <aside className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">
                            <h2 className="text-2xl font-bold text-slate-900">Resumen General</h2>
                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <div className="grid grid-cols-[1fr_auto] gap-y-4 text-lg">
                                    <span className="text-slate-500">Municipio:</span>
                                    <span className="font-semibold text-slate-900">{escuela?.municipio}</span>
                                    <span className="text-slate-500">Nivel:</span>
                                    <span className="font-semibold text-slate-900">{escuela?.nivelEducativo}</span>
                                    <span className="text-slate-500">Turno:</span>
                                    <span className="font-semibold text-slate-900">{escuela?.turno}</span>
                                </div>
                            </div>
                        </aside>
                    </section>

                    <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
                        {/* Columna Necesidades */}
                        <div className="rounded-[32px] border border-slate-200 bg-white p-8">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Necesidades</h2>
                            {necesidades.map((n, i) => (
                                <div key={i} className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h3 className="font-bold text-lg">{n.titulo}</h3>
                                    <p className="text-slate-600">{n.descripcion}</p>
                                </div>
                            ))}
                        </div>

                        {/* Columna del Mapa Interactiva */}
                        <div className="space-y-8">
                            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
                                    <img className="h-6 w-6 object-contain" src={locationIcon} alt="" />
                                    <h3 className="text-2xl font-bold text-slate-900">Ubicación</h3>
                                </div>

                                <div className="h-[320px] w-full z-0">
                                    <MapContainer 
                                        center={coords} 
                                        zoom={15} 
                                        style={{ height: '100%', width: '100%' }}
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <ActualizarCentroMapa coords={coords} />
                                        <Marker position={coords}>
                                            <Popup>
                                                {escuela?.nombre}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>

                                <div className="px-6 py-5 text-slate-700 border-t border-slate-100">
                                    <p className="text-sm font-semibold text-slate-900">Dirección registrada:</p>
                                    <p className="text-sm">{escuela?.direccion}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            
            {showPopup && <PopUp closePopup={() => setShowPopup(false)} escuela={escuela} />}
            {showContactPopup && <PopUpDonativos closePopup={() => setShowContactPopup(false)} escuela={escuela} />}
            <Footer />
        </div>
    );
}
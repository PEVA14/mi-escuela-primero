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
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix para el icono de marcador en React
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
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
  Pendiente: "border-slate-200 bg-white text-slate-700",
  "En progreso": "border-blue-200 bg-blue-50 text-blue-700",
  Completada: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function Detalles() {
  const [escuela, setEscuela] = useState(null);
  const [necesidades, setNecesidades] = useState([]);
  const [coords, setCoords] = useState([20.6597, -103.3496]); // Guadalajara por defecto
  const [hasCoords, setHasCoords] = useState(false);
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

  function getMeaningfulPart(direccion) {
    if (!direccion) return "";
    const invalid = [
      "desconocido",
      "s/n",
      "sin número",
      "sin numero",
      "sin nombre conocido",
    ];
    const parts = direccion
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "" && !invalid.includes(p.toLowerCase()));
    return parts[0] || direccion;
  }

  // Buscador de coordenadas (Geocoding) basado en la dirección de la BD
  useEffect(() => {
    async function buscarCoordenadas() {
      if (escuela?.direccion) {
        const direccionLimpia = getMeaningfulPart(escuela.direccion);
        const query = `${direccionLimpia}, ${escuela.municipio}, Jalisco, Mexico`;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
          );
          const data = await response.json();
          if (data && data.length > 0) {
            setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            setHasCoords(true);
          }
        } catch (error) {
          console.error("Error buscando ubicación:", error);
        }
      }
    }
    buscarCoordenadas();
  }, [escuela]);

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
                  <img
                    className="h-5 w-5 object-contain opacity-80"
                    src={locationIcon}
                    alt=""
                  />
                  <span>{`${getMeaningfulPart(escuela?.direccion)}${escuela?.direccion ? ", " : ""}${escuela?.municipio}, Jal.`}</span>
                </div>
                <div className="flex items-center gap-2.5 text-lg">
                  <img
                    className="h-5 w-5 object-contain opacity-80"
                    src={schoolIcon}
                    alt=""
                  />
                  <span>{escuela?.nivelEducativo}</span>
                </div>
              </div>
            </div>

            <aside className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Resumen General
              </h2>
              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="grid grid-cols-[1fr_auto] gap-y-4 text-lg">
                  <span className="text-slate-500">Municipio:</span>
                  <span className="font-semibold text-slate-900">
                    {escuela?.municipio}
                  </span>
                  <span className="text-slate-500">Nivel:</span>
                  <span className="font-semibold text-slate-900">
                    {escuela?.nivelEducativo}
                  </span>
                  <span className="text-slate-500">Turno:</span>
                  <span className="font-semibold text-slate-900">
                    {escuela?.turno}
                  </span>
                </div>
              </div>
            </aside>
          </section>

          {/* Carrusel de fotos */}
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-center text-3xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Conoce Nuestras Instalaciones
            </h2>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#f8fafc_55%,#ffffff_100%)]">
              {escuela?.fotos?.length > 0 ? (
                <div className="relative h-[340px] w-full overflow-hidden bg-slate-100 md:h-[480px]">
                  <img
                    key={
                      escuela.fotos[fotoIndex % escuela.fotos.length]?.id_foto
                    }
                    src={escuela.fotos[fotoIndex % escuela.fotos.length]?.url}
                    alt={`${escuela.nombre} — foto ${(fotoIndex % escuela.fotos.length) + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {escuela.fotos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setFotoIndex(
                            (i) =>
                              (i - 1 + escuela.fotos.length) %
                              escuela.fotos.length,
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
                        {(fotoIndex % escuela.fotos.length) + 1} /{" "}
                        {escuela.fotos.length}
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
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
            {/* Columna Necesidades */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-3xl font-extrabold text-slate-900">
                  Necesidades
                  <span className="ml-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 align-middle text-sm font-semibold text-slate-700">
                    {totalNeeds}
                  </span>
                </h2>
                <button
                  onClick={() => setShowPopup(true)}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-800"
                >
                  Apoyar esta Escuela
                </button>
              </div>

              {totalNeeds === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center text-slate-500">
                  Esta escuela aún no tiene necesidades registradas.
                </p>
              ) : (
                <div className="space-y-4">
                  {necesidades.map((n) => (
                    <article
                      key={n.id_necesidad}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-slate-900">
                          {n.titulo}
                        </h3>
                        {n.estado && (
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              ESTADO_CLS[n.estado] ??
                              "border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            {n.estado}
                          </span>
                        )}
                      </div>

                      {(n.categoria || n.subcategoria) && (
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                          {n.categoria && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                              {n.categoria}
                            </span>
                          )}
                          {n.subcategoria && (
                            <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">
                              {n.subcategoria}
                            </span>
                          )}
                        </div>
                      )}

                      {n.descripcion && (
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {n.descripcion}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        {n.monto_requerido > 0 && (
                          <span className="text-sm text-slate-700">
                            <strong className="text-slate-900">
                              {n.monto_requerido}
                            </strong>
                            {n.unidad ? ` ${n.unidad}` : ""}
                          </span>
                        )}
                        <button
                          onClick={() => setShowPopup(true)}
                          className="ml-auto inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          Apoyar esta necesidad
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Columna del Mapa Interactiva */}
            <div className="space-y-8">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
                  <img
                    className="h-6 w-6 object-contain"
                    src={locationIcon}
                    alt=""
                  />
                  <h3 className="text-2xl font-bold text-slate-900">
                    Ubicación
                  </h3>
                </div>

                <div className="h-[320px] w-full z-0">
                  {hasCoords ? (
                    <MapContainer
                      center={coords}
                      zoom={15}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <ActualizarCentroMapa coords={coords} />
                      <Marker position={coords}>
                        <Popup>{escuela?.nombre}</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                      <div className="text-center">
                        <p className="text-4xl mb-2">📍</p>
                        <p className="text-sm font-medium">Ubicación no disponible</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-5 text-slate-700 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">
                    Dirección registrada:
                  </p>
                  <p className="text-sm">{escuela?.direccion}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showPopup && (
        <PopUp closePopup={() => setShowPopup(false)} escuela={escuela} />
      )}
      {showContactPopup && (
        <PopUpDonativos
          closePopup={() => setShowContactPopup(false)}
          escuela={escuela}
        />
      )}
      <Footer />
    </div>
  );
}

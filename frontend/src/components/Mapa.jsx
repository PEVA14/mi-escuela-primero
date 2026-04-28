import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./fix-leaflet-icon"; // Importa la solución del paso anterior

const MapaEscuela = ({ lat, lng, nombreEscuela }) => {
  // Coordenadas por defecto si no hay datos (ej. Guadalajara)
  const position = [lat || 20.6597, lng || -103.3496];

  return (
    <div style={{ height: "400px", width: "100%", marginBottom: "20px" }}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{nombreEscuela}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapaEscuela;

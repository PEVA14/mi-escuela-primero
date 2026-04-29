import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./fix-leaflet-icon"; // Importa la solución del paso anterior

const MapaEscuela = ({ lat, lng, nombreEscuela }) => {
  // Si no hay coordenadas decirlo
  if (lat == null || lng == null) {
    return (
      <div
        style={{
          height: "400px",
          width: "100%",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          color: "#666",
        }}
      >
        Sin ubicación
      </div>
    );
  }
  const position = [lat, lng];

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

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getStats() {
  return api.get("/stats");
}

export function getEscuelas() {
  return api.get("/escuelas");
}

export function getEscuelaById(id) {
  return api.get(`/escuelas/${id}`);
}

export function login(datos) {
  return api.post("/login", datos);
}

export function agregarEscuela(datos) {
  return api.post("/escuelas", datos, getAuthHeaders());
}

export function updateEscuela(id, datos) {
  return api.put(`/escuelas/${id}`, datos, getAuthHeaders());
}

export function deleteEscuela(id) {
  return api.delete(`/escuelas/${id}`, getAuthHeaders());
}

export function getNecesidades() {
  return api.get("/necesidades");
}

export function getNecesidadesByEscuela(id_escuela) {
  return api.get(`/necesidades/escuela/${id_escuela}`);
}

export function crearNecesidad(datos) {
  return api.post("/necesidades", datos, getAuthHeaders());
}

export function updateNecesidad(id, datos) {
  return api.put(`/necesidades/${id}`, datos, getAuthHeaders());
}

export function deleteNecesidad(id) {
  return api.delete(`/necesidades/${id}`, getAuthHeaders());
}

export function getRespuestas() {
  return api.get("/respuestas", getAuthHeaders());
}

export function crearRespuesta(datos) {
  return api.post("/respuestas", datos);
}

export function uploadFotos(id_escuela, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("fotos", file));
  const token = localStorage.getItem("token");
  return api.post(`/escuelas/${id_escuela}/fotos`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteFoto(id_foto) {
  return api.delete(`/fotos/${id_foto}`, getAuthHeaders());
}

export function importarEscuelas(datos) {
  return api.post("/importar/escuelas", { escuelas: datos }, getAuthHeaders());
}

export function importarNecesidades(datos) {
  return api.post(
    "/importar/necesidades",
    { necesidades: datos },
    getAuthHeaders(),
  );
}

export default api;

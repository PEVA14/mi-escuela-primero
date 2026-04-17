import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

export function getEscuelas() {
  return api.get("/escuelas");
}

export function getEscuelaById(id) {
  return api.get(`/escuelas/${id}`);
}

export function login(datos){
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

// --- Necesidades ---
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

// --- Respuestas de donadores ---
export function getRespuestas() {
  return api.get("/respuestas", getAuthHeaders());
}

export function crearRespuesta(datos) {
  return api.post("/respuestas", datos);
}

// --- Importar Excel (envía JSON parseado desde frontend) ---
export function importarEscuelas(datos) {
  return api.post("/importar/escuelas", { escuelas: datos }, getAuthHeaders());
}

export function importarNecesidades(datos) {
  return api.post("/importar/necesidades", { necesidades: datos }, getAuthHeaders());
}

export default api;
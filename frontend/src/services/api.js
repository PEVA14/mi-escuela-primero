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

export function getStats() {
  return api.get("/stats");
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

// --- Fotos (subida de archivos) ---

/*
 * uploadFotos
 * Sends one or more File objects from the browser to the backend.
 *
 * Why FormData?
 * Files are binary — they can't travel inside a JSON body.  FormData tells
 * the browser to encode the request as multipart/form-data, which is the
 * standard format for file uploads.  Each File is appended under the field
 * name "fotos", which is the name multer listens for on the server.
 *
 * We deliberately do NOT set Content-Type manually.  When axios sees a
 * FormData body it sets Content-Type: multipart/form-data; boundary=…
 * automatically, including the boundary string that separates each file.
 * If we set it manually we'd break that boundary and the server would
 * fail to parse the files.
 */
export function uploadFotos(id_escuela, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('fotos', file));
  const token = localStorage.getItem('token');
  return api.post(`/escuelas/${id_escuela}/fotos`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Deletes a single photo by its database ID.
export function deleteFoto(id_foto) {
  return api.delete(`/fotos/${id_foto}`, getAuthHeaders());
}

// --- Importar Excel (envía JSON parseado desde frontend) ---
export function importarEscuelas(datos) {
  return api.post("/importar/escuelas", { escuelas: datos }, getAuthHeaders());
}

export function importarNecesidades(datos) {
  return api.post("/importar/necesidades", { necesidades: datos }, getAuthHeaders());
}

export default api;
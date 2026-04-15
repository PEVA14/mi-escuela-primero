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

export default api;
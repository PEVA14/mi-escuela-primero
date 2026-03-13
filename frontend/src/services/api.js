import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

export function getEscuelas() {
    return api.get("/escuelas");
}

export function getEscuelaById(id) {
    return api.get(`/escuelas/${id}`);
};

export function login(datos){
    return api.post('/login', datos)
}

export default api;






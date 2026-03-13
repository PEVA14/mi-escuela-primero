import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEscuelaById, updateEscuela } from "../services/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function EditarEscuela() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [escuela, setEscuela] = useState({
    nombre: "", plantel: "", municipio: "", direccion: "", cct: "",
    personal_escolar: "", estudiantes: "", nivelEducativo: "",
    modalidad: "", turno: "", sostenimiento: "",categoria:""
  });

  const [loading, setLoading] = useState(true); //

 
  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await getEscuelaById(id);
        setEscuela(res.data); // Llenamos el formulario con datos reales
      } catch (e) {
        console.error("Error al obtener la escuela", e);
      } finally {
        setLoading(false); // Ya terminó, mostramos el form
      }
    }
    cargarDatos();
  }, [id]);

  function handleChange(e) {
    setEscuela({
      ...escuela,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      /*const token = localStorage.getItem("token");*/
      await updateEscuela(id, escuela, token);
      alert("Escuela actualizada correctamente");
      navigate(`/detalles/${id}`);
    } catch (err) {
      alert("Error al actualizar");
    }
  }


  if (loading) return <p>Cargando datos de la escuela...</p>;

  return (
    <div>

      <NavBar/>

      <div className="editContainer">

        <h1>Editar Escuela</h1>

        <form onSubmit={handleSubmit}>

          <label>Nombre</label>
          <input
            name="nombre"
            value={escuela.nombre}
            onChange={handleChange}
          />

          <label>Plantel</label>
          <input
            name="plantel"
            value={escuela.plantel}
            onChange={handleChange}
          />

          <label>Municipio</label>
          <input
            name="municipio"
            value={escuela.municipio}
            onChange={handleChange}
          />

          <label>Dirección</label>
          <input
            name="direccion"
            value={escuela.direccion}
            onChange={handleChange}
          />

          <label>CCT</label>
          <input
            name="cct"
            value={escuela.cct}
            onChange={handleChange}
          />

          <label>Estudiantes</label>
          <input
            name="estudiantes"
            value={escuela.estudiantes}
            onChange={handleChange}
          />

          <label>Personal Escolar</label>
          <input
            name="personal_escolar"
            value={escuela.personal_escolar}
            onChange={handleChange}
          />

          <label>Nivel Educativo</label>
          <input
            name="nivelEducativo"
            value={escuela.nivelEducativo}
            onChange={handleChange}
          />

          <label>Modalidad</label>
          <input
            name="modalidad"
            value={escuela.modalidad}
            onChange={handleChange}
          />

          <label>Turno</label>
          <input
            name="turno"
            value={escuela.turno}
            onChange={handleChange}
          />

          <label>Sostenimiento</label>
          <input
            name="sostenimiento"
            value={escuela.sostenimiento}
            onChange={handleChange}
          />

          <button type="submit">
            Guardar cambios
          </button>

        </form>

      </div>

      <Footer/>

    </div>
  );
}
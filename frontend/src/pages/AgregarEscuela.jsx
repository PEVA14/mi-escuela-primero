import { useState } from "react";
import { agregarEscuela } from "../services/api"; 
import { useNavigate } from "react-router-dom";

export default function AgregarEscuela() {
    const navigate = useNavigate();
        const [formData, setFormData] = useState({
        nombre: "",
        plantel: "",
        municipio: "",
        direccion: "",
        ubicacion: "",
        cct: "",
        personal_escolar: 0,
        estudiantes: 0,
        nivelEducativo: "",
        modalidad: "",
        turno: "",
        sostenimiento: "",
        categoria: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await agregarEscuela(formData);
            alert("Escuela registrada con éxito");
            navigate("/escuelas");
        } catch (error) {
            console.error(error);
            alert("Error al guardar los datos");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Registrar Nueva Escuela</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                
                <input name="nombre" placeholder="Nombre de la Escuela" onChange={handleChange} required />
                <input name="plantel" placeholder="Plantel" onChange={handleChange} required />
                <input name="cct" placeholder="CCT (Clave de Centro de Trabajo)" onChange={handleChange} required />

                <input name="municipio" placeholder="Municipio" onChange={handleChange} required />
                <input name="direccion" placeholder="Dirección Completa" onChange={handleChange} required />
                <input name="ubicacion" placeholder="Coordenadas (Lat, Long)" onChange={handleChange} />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <label> Personal:
                        <input name="personal_escolar" type="number" onChange={handleChange} />
                    </label>
                    <label> Estudiantes:
                        <input name="estudiantes" type="number" onChange={handleChange} />
                    </label>
                </div>

                <select name="nivelEducativo" onChange={handleChange} required>
                    <option value="">Nivel Educativo</option>
                    <option value="Preescolar">Preescolar</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                    <option value="Media Superior">Media Superior</option>
                    <option value="Superior">Superior</option>
                    <option value="Especial">Especial</option>
                </select>

                <input name="modalidad" placeholder="Modalidad (Escolarizada, Técnica...)" onChange={handleChange} />
                
                <select name="turno" onChange={handleChange}>
                    <option value="">Turno</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Nocturno">Nocturno</option>
                    <option value="Mixto">Mixto</option>
                </select>

                <input name="sostenimiento" placeholder="Sostenimiento (Público/Privado)" onChange={handleChange} />
                
                <select name="categoria" onChange={handleChange} required>
                    <option value="">Categoría</option>
                    <option value="Material">Material</option>
                    <option value="Infraestructura">Infraestructura</option>
                    <option value="Formacion">Formación</option>
                    <option value="Salud">Salud</option>
                </select>

                <button type="submit">
                    Guardar Escuela en el Sistema
                </button>
            </form>
        </div>
    );
}
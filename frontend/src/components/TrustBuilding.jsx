import donation from "../assets/donation_icon_32px.png";
import project_completed from "../assets/projects_finish_icon_32px.png";
import transparenci from "../assets/transparenci_icon_32px.png";
import './TrustBuilding.css'

export default function TrustBuilding(){
    return(
        <section id = "TrustBuilding">
            <div id = "metrics">
                <div class = "metrics-conteiner">
                    <div class = "imageHolder">
                        <img src={donation} alt = "donacion vector.png"/>
                    </div>
                    <p class = "metric-info">$12M</p>
                    <p>En donaciones canalizadas</p>
                </div>
                <div class = "metrics-conteiner">
                    <div class = "imageHolder">
                        <img src={project_completed} alt = "projects complited vector.png"/>
                    </div>
                    <p class = "metric-info">85%</p>
                    <p>Proyectos completados</p>
                </div>
                <div class = "metrics-conteiner">
                    <div class = "imageHolder">
                        <img src={transparenci} alt = "trasnparenci.png"/>
                    </div>
                    <p class = "metric-info">100%</p>
                    <p>Transparencia garantizada</p>
                </div>
            </div>
            <div id="TransparenciCompromise">
                <div class = "imageHolder">
                    <img src={transparenci} alt = "trasnparenci.png"/>
                </div>
                <div class = "TransparenciText">
                    <p id = "microTitle"><strong>Compromiso con la Transparencia</strong></p>
                    <p>En Mi Escuela Primero, nos tomamos muy en serio la confianza que depositás en nosotros. Cada donación es rastreada y verificada, y proporcionamos informes detallados sobre el impacto de cada contribución. Trabajamos directamente con las escuelas para asegurar que los recursos lleguen donde realmente se necesitan.</p>
                    <ul>
                        <li>Verificación directa de todas las necesidades escolares</li>
                        <li>Seguimiento personalizado de cada proyecto</li>
                        <li>Reportes de impacto con evidencia fotográfica</li>
                        <li>Protección de datos según normativa mexicana</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}
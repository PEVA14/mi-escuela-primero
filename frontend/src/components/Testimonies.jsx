import { useNavigate } from "react-router-dom";
import quotes from '../assets/quotes.png';
import pfp_icon from '../assets/pfp_icon.png';

export default function Testimonies(){
    const navigate = useNavigate();

    return(
        <section id="testimonies">
                <div id="introduction">
                    <h2 className="subtitle"> Testimonios de Aliados </h2>
                    <p>Conoce las experiences de quienes ya han apoyado nuestras escuelas y han visto el impacto real de su contribución</p>
                </div>
                <div id="testimony-cards">
                    <div className="testimony">
                        <img src={quotes} className="quotes-icon" alt="acotaciones.png"></img>
                        <p className="quote">"Gracias a esta plataforma pudimos identificar fácilmente escuelas que necesitaban apoyo en nuestra región. El proceso fue transparente y pudimos ver el impacto directo de nuestra contribución."</p>
                        <img src={pfp_icon} className="profile-pic" alt="profile picture.png"></img>
                        <h5 className="username">María González</h5>
                        <p className="job-position">Directora de Responsabilidad Social, Grupo Industrial del Norte</p>
                    </div>
                    <div className="testimony">
                        <img src={quotes} className="quotes-icon" alt="acotaciones.png"></img>
                        <p className="quote">"La claridad en la información y el seguimiento constante nos dio la confianza para apoyar a múltiples escuelas. Es una herramienta invaluable para conectar necesidades reales con quienes quieren ayudar."</p>
                        <img src={pfp_icon} className="profile-pic" alt="profile picture.png"></img>
                        <h5 className="username">Roberto Martínez</h5>
                        <p className="job-position">Fundación Educando Juntos</p>
                    </div>
                    <div className="testimony">
                        <img src={quotes} className="quotes-icon" alt="acotaciones.png"></img>
                        <p className="quote">"Como emprendedora, siempre quise retribuir a mi comunidad. Esta plataforma me permitió encontrar proyectos específicos donde mi apoyo realmente hace la diferencia."</p>
                        <img src={pfp_icon} className="profile-pic" alt="profile picture.png"></img>
                        <h5 className="username">Ana Sofía Ruiz</h5>
                        <p className="job-position">Empresaria independiente</p>
                    </div>
                </div>
        </section>
    )
}
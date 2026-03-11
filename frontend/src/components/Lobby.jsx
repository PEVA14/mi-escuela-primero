import {useNavigate} from 'react-router-dom';
import school from '../assets/school_icon_32px.png';
import heart from '../assets/love_icon_32px.png';
import people from '../assets/people_icon_64px.png';


export default function Lobby(){
    const navigate = useNavigate();

    return(
        <section id="lobby">
            <div id="texto_inicio">
                <h1><strong> Conecta necesidades reales con oportunidades de impacto </strong></h1>
                <p>Plataforma que une escuelas con necesidades específicas y donadores comprometidos. Transparente, fácil y con resultados medibles.</p>
            </div>
            <div>
                <button onClick={()=>navigate('/escuelas')}>Explorar Escuelas</button>
                {/* <button onClick={()=>navigate('')}></button> */}
            </div>
            <div>
                <div class="caracteristicas">
                    <img src={school} alt="escuela vector.png"/>
                    <h2>99{/*cantidad de escuelas */}</h2>
                    <p>Escuelas registradas</p>
                </div>
                <div class="caracteristicas">
                    <img src={heart} alt="corazon vector.png"/>
                    <h2>99{/*necesidades activas */}</h2>
                    <p>Necesidades activas</p>
                </div>
                <div class="caracteristicas">
                    <img src={people} alt="gente vector.png"/>
                    <h2>99{/*comunidades alcanzadas*/}</h2>
                    <p>Comunidades Alcanzadas</p>
                </div>
            </div>
        </section>
    )
}
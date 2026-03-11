import { useNavigate } from "react-router-dom";
import love_icon from "../assets/love_icon_32px.png";
import check from "../assets/check-mark-3281_64.png";

export default function Pre_footer(){
    const navigate = useNavigate();

    return(
        <section id="prefooter">
            <div id="prefooot">
                <div className="backphoto">
                    <div className="convincer">
                        <img src={love_icon} alt="love icon.png"></img>
                        <h1>¿Listo para Hacer la Diferencia?</h1>
                        <p>Únete a nuestra red de aliados comprometidos con la educación.</p>
                        <p>Cada aportación cuenta y cada escuela importa.</p>
                        <div className="convincing-point">
                            <img src={check} alt="chechmark.png"></img>
                            <h5>100% verificado</h5>
                        </div>
                        <div className="convincing-point">
                            <img src={check} alt="chechmark.png"></img>
                            <h5>Impacto Verificado</h5>
                        </div>
                        <div className="convincing-point">
                            <img src={check} alt="chechmark.png"></img>
                            <h5>Fácil y rápido</h5>
                        </div>
                        <div className="buttonset">
                        <button onClick={()=>navigate('/escuelas')}>Comenzar ahora</button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
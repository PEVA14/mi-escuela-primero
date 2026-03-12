export default function PopUp({ closePopup, escuela }){
    return (
        <div className="popupOverlay">
            <div className="popupBox">
                <button className="closePopup" onClick={closePopup}>X</button>
                <h2>{`Apoyar a ${escuela?.nombre}`}</h2>
                <h4>Completa el formulario y nuestro equipo te contactará para coordinar el apoyo.</h4>
                <form className="popupForm">
                    <label>Nombre Completo</label>
                    <input type="text" placeholder="Tu nombre" required/>

                    <label>Correo Electrónico</label>
                    <input type="text" placeholder="mi.correo@empresa.com" required/>
                    
                    <label>{`Empresa u Organización (opcional)`}</label>
                    <input type="text" placeholder="Nombre de tu empresa u organización"/>

                    <label>{`Necesidad de Interés (opcional)`}</label>
                    <select name="necesidad" id="necesidad">
                        <option value="">{`Apoyar en general (sin preferencia)`}</option>
                        <option value="1">{`Baños y sanitarios en mal estado`}</option>
                        <option value="2">{`2...`}</option>
                        <option value="3">{`3...`}</option>
                        <option value="4">{`4...`}</option>
                    </select>

                    <label>{`Mensaje Adicional (opcional)`}</label>
                    <input type="text" placeholder="Cuentanos más sobre tu interés en apoyar..."/>
                    <div className="disclosure">
                        <p>Protección de datos: Tus datos se manejarán conforme a nuestro Aviso de Privacidad y únicamente se utilizarán para coordinar el apoyo con las escuelas.</p>
                    </div>
                    <button type="submit">Enviar Interés</button>
                </form>
            </div>
        </div>
    )
}
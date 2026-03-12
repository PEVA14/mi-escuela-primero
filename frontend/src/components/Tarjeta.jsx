import { useNavigate } from 'react-router-dom';
import locationIcon from "../assets/location_icon.png"
import calendarIcon from "../assets/calendar_icon.png"
import Badge from './Badge';

export default function Tarjeta( {escuela}) {
    const navigate = useNavigate();

    function manejarClick() {
        navigate(`/escuelas/${escuela.id_escuela}`);
    }
    console.log(escuela.categoria);

   return (
        <div>
                <div key={escuela.id_escuela} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h1>{escuela.nombre} </h1>
                    {
                    escuela.categoria.map(es => {
                        return <Badge content={es}/>
                    })}
                    <address>
                        <span> 
                            <img src={locationIcon} alt=""/> {escuela.municipio}
                        </span>
                    </address>

                    <button onClick={manejarClick}> Ver Detalles </button>
                    <small> <img src={calendarIcon} alt=""/> Actualizado: 11 de marzo de 2026</small>
                </div>
        </div>
    );

}

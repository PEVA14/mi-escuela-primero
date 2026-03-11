import { useNavigate } from 'react-router-dom';

export default function Tarjeta( {escuela}) {
    const navigate = useNavigate();

    function manejarClick() {
        navigate(`/escuelas/${escuela.id_escuela}`);
    }

   return (
        <div>
                <div key={escuela.id_escuela} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h1>{escuela.nombre} </h1>
                    <p>{escuela.municipio} - {escuela.nivelEducativo}</p>

                    <button onClick={manejarClick}> Ver Detalles </button>
                </div>
        </div>
    );

}

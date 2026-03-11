import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { getEscuelaById } from "../services/api";
import NavBar from "../components/NavBar";

export default function Detalles() {
    const [escuela, setEscuela] = useState(null);
    const { id } = useParams(); 
    const navigate = useNavigate();

    useEffect( ()=> {
        async function load() {
            try{
                const res = await getEscuelaById(id);
                console.log(res.data)
                setEscuela(res.data);
            } catch(e) {
                 console.log(e);
            }
        } load();
        }, [id])

    
    function redirect(){
        navigate('/escuelas')
    }

    return (
        <div>
            <NavBar/>
            <h1>{escuela?.nombre}</h1> 
            <h2>{escuela?.turno}</h2>
            <button onClick={redirect}> Back </button>
        </div>
    );
}
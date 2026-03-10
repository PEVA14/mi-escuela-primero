import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEscuelaById } from "../services/api";

export default function Detalles() {
    const [escuela, setEscuela] = useState(null);
    const { id } = useParams(); 
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

    return (
        <div>
            <h1>{escuela?.nombre}</h1> 
            <h2>{escuela?.turno}</h2>
        </div>
    );
}
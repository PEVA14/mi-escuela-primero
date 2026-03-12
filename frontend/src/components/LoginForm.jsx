import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/api";

export default function LoginForm() {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");

    const navigate = useNavigate();
    let authToken = null;

    async function handleSubmit(e){
        e.preventDefault()
        try {
            const res = await login({usuario: usuario, contraseña: contraseña });
            authToken = res.data.token;
            /*authToken = res.token; guardo el token que se gener*, así no ya que por axios el formato es data y adentro viene token*/
            localStorage.setItem("token",authToken);
            console.log(res.data);
            navigate("/escuelas"); 

        } catch {
            alert("The credentials are incorrect ")
        }
    }
    
return (
        <form onSubmit={handleSubmit}> 
            <label htmlFor="user"> Usuario </label>
            <input 
                id="user"
                name="user" 
                type="text" 
                value={usuario} 
                onChange={(e) => setUsuario(e.target.value)}
            />

            <label htmlFor="contra"> Contraseña </label>
            <input 
                id="contra"
                name="contra" 
                type="password" 
                value={contraseña} 
                onChange={(e) => setContraseña(e.target.value)}
            />

            <button type="submit"> Login </button>
        </form>
    );
}
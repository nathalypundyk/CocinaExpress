import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HTTPClient from "../../utils/HTTPClient"; // Importa la clase HTTPClient para manejar las solicitudes HTTP
import './login.css'; // Importa el archivo de estilos CSS para el formulario de inicio de sesión

const LoginForm = () => {
    // Define el estado para almacenar errores y los datos del formulario (email y contraseña)
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({ email: "", password: "" });

    const navigate = useNavigate(); // Hook para navegar entre rutas
    const httpClient = new HTTPClient(); // Crea una instancia de la clase HTTPClient para realizar solicitudes

    // Maneja los cambios en los campos del formulario
    const handleChange = (event) => {
        setData({
            ...data, // Mantén los valores actuales del estado
            [event.target.name]: event.target.value // Actualiza solo el campo que cambió
        });
    };

    // Función para validar los datos del formulario
    const validate = () => {
        let isValid = true; // Bandera para indicar si el formulario es válido
        let errors = {}; // Objeto para almacenar los mensajes de error

        // Valida la longitud de la contraseña
        if (data.password.length < 5) {
            errors.password = "La contraseña no puede tener menos de 5 caracteres";
            isValid = false; // Marca el formulario como no válido
        }

        setErrors(errors); // Actualiza el estado de errores
        return isValid; // Retorna si el formulario es válido o no
    };

    // Maneja el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario

        if (!validate()) {
            return; // Si la validación falla, no continúa con el envío
        }

        try {
            // Realiza la solicitud de inicio de sesión usando HTTPClient
            const response = await httpClient.login(data.email, data.password);

            // Si la solicitud es exitosa, navega a la página de inicio
            if (response.status === 200) {
                navigate("/home");
            } else {
                // Si hay un error en la respuesta, muestra un mensaje de error general
                setErrors({ general: "Error en la solicitud. Inténtalo de nuevo." });
            }
        } catch (error) {
            console.error("Error during login:", error);
            // Si hay un error en la conexión, muestra un mensaje de error general
            setErrors({ general: "Error en la conexión. Inténtalo de nuevo más tarde." });
        }
    };

    return (
        <div className="container">
            {/* Contenedor para la imagen */}
            <div className="image-placeholder">
                <img src="/imagenes/Cocinamor.png" alt="Cocina" className="image" />
            </div>
            {/* Contenedor para el formulario */}
            <div className="form-container">
                <div className="header">Cocina Express</div>
                <p className="subtext">Inicia sesión para guardar tus recetas favoritas.</p>
                {/* Formulario de inicio de sesión */}
                <form onSubmit={handleSubmit}>
                    {/* Campo para el email */}
                    <div className="row">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                            placeholder="Your email address"
                        />
                    </div>
                    {/* Campo para la contraseña */}
                    <div className="row">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            required
                            minLength={5} // La contraseña debe tener al menos 5 caracteres
                            placeholder="Enter your password"
                        />
                    </div>
                    {/* Muestra mensajes de error si existen */}
                    {errors.general && <p className="error">{errors.general}</p>}
                    {errors.password && <p className="error">{errors.password}</p>}
                    {/* Botón para enviar el formulario */}
                    <div>
                        <button type="submit">Iniciar Sesión</button>
                    </div>
                    {/* Enlace para ir a la página de registro */}
                    <p>¿No tienes una cuenta? <Link to="/register/">Regístrate aquí</Link></p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;




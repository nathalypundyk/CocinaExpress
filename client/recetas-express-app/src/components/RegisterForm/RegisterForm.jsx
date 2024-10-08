import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HTTPClient from "../../utils/HTTPClient"; // Importa la clase HTTPClient para manejar las solicitudes HTTP
import './Register.css'; // Importa el archivo de estilos CSS para el formulario de registro

const RegisterForm = (props) => {
    // Define el estado para almacenar los datos del formulario, los errores y el mensaje de éxito
    const [data, setData] = useState({ name: "", email: "", password: "", password2: "" });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

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
        let valErrors = {}; // Objeto para almacenar los mensajes de error

        // Valida si el nombre está vacío
        if (!data.name.trim()) {
            valErrors.name = "El nombre es obligatorio";
            isValid = false; // Marca el formulario como no válido
        }

        // Valida si el correo electrónico está vacío
        if (!data.email.trim()) {
            valErrors.email = "El correo electrónico es obligatorio";
            isValid = false;
        }

        // Valida si la contraseña tiene al menos 6 caracteres
        if (data.password.length <= 5) {
            valErrors.password = "La contraseña no puede tener menos de 5 caracteres";
            isValid = false;
        }

        // Valida si las contraseñas coinciden
        if (data.password !== data.password2) {
            valErrors.password2 = "Las contraseñas no coinciden";
            isValid = false;
        }

        setErrors(valErrors); // Actualiza el estado de errores
        return isValid; // Retorna si el formulario es válido o no
    };

    // Maneja el envío del formulario
const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
        return;
    }

    try {
        const response = await httpClient.register(data);
        if (response.status === 200) {
            console.log("Registro exitoso", response.data);
            setSuccessMessage("¡Registro exitoso! Redirigiendo al inicio de sesión...");
            
            // Actualiza el estado en el componente padre con los datos del usuario
            props.setUserData(response.data.user); // Asegúrate de que la respuesta contenga los datos del usuario
            
            setTimeout(() => {
                navigate("/login"); // Redirige al usuario después de 3 segundos
            }, 3000);
        } else {
            setErrors({ general: "Error en la solicitud. Inténtalo de nuevo." });
        }
    } catch (error) {
        console.error("Error durante el registro:", error);
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
                <p className="subtext">Regístrate para compartir tus recetas favoritas.</p>
                {/* Muestra el mensaje de éxito si existe */}
                {successMessage && <p className="success">{successMessage}</p>}
                {/* Formulario de registro */}
                <form onSubmit={handleSubmit}>
                    {/* Campo para el nombre */}
                    <div className="row">
                        <label htmlFor="name">Nombre</label>
                        <input
                            id="registerName"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            required
                        />
                        {/* Muestra el mensaje de error si existe */}
                        {errors.name && <small className="error">{errors.name}</small>}
                    </div>
                    {/* Campo para el email */}
                    <div className="row">
                        <label htmlFor="email">Email</label>
                        <input
                            id="registerEmail"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                        />
                        {/* Muestra el mensaje de error si existe */}
                        {errors.email && <small className="error">{errors.email}</small>}
                    </div>
                    {/* Campo para la contraseña */}
                    <div className="row">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="registerPassword"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            required
                            minLength={5} // La contraseña debe tener al menos 5 caracteres
                        />
                        {/* Muestra el mensaje de error si existe */}
                        {errors.password && <small className="error">{errors.password}</small>}
                    </div>
                    {/* Campo para confirmar la contraseña */}
                    <div className="row">
                        <label htmlFor="password2">Confirmar Contraseña</label>
                        <input
                            id="registerPassword2"
                            type="password"
                            name="password2"
                            value={data.password2}
                            onChange={handleChange}
                            required
                            minLength={5} // La contraseña debe tener al menos 5 caracteres
                        />
                        {/* Muestra el mensaje de error si existe */}
                        {errors.password2 && <small className="error">{errors.password2}</small>}
                    </div>
                    {/* Muestra el mensaje de error general si existe */}
                    {errors.general && <p className="error">{errors.general}</p>}
                    {/* Botón para enviar el formulario */}
                    <div>
                        <button type="submit">Crear Cuenta</button>
                    </div>
                    {/* Enlace para ir a la página de inicio de sesión */}
                    <p>¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link></p>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;



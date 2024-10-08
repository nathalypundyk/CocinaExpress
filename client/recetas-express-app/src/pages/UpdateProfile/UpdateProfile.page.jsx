import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import HTTPClient from '../../utils/HTTPClient.js';

// Importa el archivo de estilos CSS para el componente
import './UpdateProfile.css'; // Asegúrate de tener el archivo de estilos adecuado

const UpdateProfile = (props) => {
    // Estado para almacenar los datos del usuario
    const [userData, setUserData] = useState(props.userData || {});
    // Estado para almacenar el archivo de imagen de perfil seleccionado
    const [file, setFile] = useState(null);
    // Estado para manejar los errores de validación y del formulario
    const [errors, setErrors] = useState({});
    // Estado para indicar si la carga fue exitosa
    const [isUploaded, setIsUploaded] = useState(false);

    // Instancia del cliente HTTP para hacer solicitudes
    const client = new HTTPClient();
    // Obtiene el ID del usuario desde los datos del usuario
    const id = userData.userId || '';
    // Hook para la navegación
    const navigate = useNavigate();

    // Maneja el cambio en el input de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    }

    // Maneja el cambio en los campos del formulario
    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Valida los datos del formulario
        if (!validate()) {
            return;
        }

        // Crea un nuevo FormData para enviar los datos del formulario
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('bio', userData.bio);
        if (file) {
            formData.append('profileImage', file);
        }

        try {
            // Envía los datos al servidor para actualizar el perfil del usuario
            const res = await client.updateUser(id, formData);
            console.log(res);
            // Indica que la carga fue exitosa
            setIsUploaded(true);
            // Redirige a la página de inicio después de 2 segundos
            setTimeout(() => navigate("/home"), 2000);
        } catch (err) {
            // Maneja errores en el envío del formulario
            setErrors({ submit: 'Error al actualizar el perfil, por favor intente de nuevo.' });
            console.error("(frontend) Error al actualizar el perfil:", err);
        }
    }

    // Función para validar los datos del formulario
    const validate = () => {
        let flag = true;
        const newErrors = {};

        // Verifica si el nombre está vacío
        if (!userData.name) {
            newErrors.name = "El nombre es requerido";
            flag = false;
        }
        // Verifica si la biografía está vacía
        if (!userData.bio) {
            newErrors.bio = "La biografía es requerida";
            flag = false;
        }

        // Actualiza el estado de errores y devuelve el estado de validación
        setErrors(newErrors);
        return flag;
    }

    return (
        <div className="wrapper">
            <nav className="nav-bar">
                <Link to="/home">
                    <img src="/imagenes/cocinaExpress.png" alt="Cocina Express" className="logo" />
                </Link>
                {/*} <button onClick={() => navigate('/home')}>Volver al Home</button>*/}
            </nav>
            <div className="content">
                <div className="form-box">
                    <h1>Actualizar Perfil</h1>
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                        {/* Campo para el nombre del usuario */}
                        <label htmlFor="name">Nombre</label>
                        <input
                            name="name"
                            type="text"
                            value={userData.name || ''}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="error">{errors.name}</p>}

                        {/* Campo para seleccionar una imagen de perfil */}
                        <label htmlFor="profileImage">Selecciona una imagen de perfil</label>
                        <input
                            name="profileImage"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                        />
                        {userData.profileImage && (
                            <img
                                src={userData.profileImage}
                                alt="Imagen de perfil"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        )}

                        {/* Campo para la biografía del usuario */}
                        <label htmlFor="bio">Biografía</label>
                        <input
                            name="bio"
                            type="text"
                            value={userData.bio || ''}
                            onChange={handleChange}
                        />
                        {errors.bio && <p className="error">{errors.bio}</p>}
                        {errors.submit && <p className="error">{errors.submit}</p>}

                        {/* Botón para guardar los cambios */}
                        <button type="submit">Guardar Cambios</button>
                        {/* Mensaje de éxito al actualizar el perfil */}
                        {isUploaded && <p>El perfil se ha actualizado exitosamente</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateProfile;

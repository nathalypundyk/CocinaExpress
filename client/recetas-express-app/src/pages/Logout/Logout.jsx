import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Para sesiones
            await axios.post('/api/logout');
            
            // Para JWT (solo eliminar el token del cliente)
            localStorage.removeItem('token');

            // Redirigir a la página de inicio de sesión
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Cerrar sesión</button>
    );
};

export default Logout;

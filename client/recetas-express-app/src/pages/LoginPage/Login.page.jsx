import LoginForm from "../../components/LoginForm/LoginForm"; // Importa el componente LoginForm desde la carpeta especificada

// Componente funcional LoginPage que representa la página de inicio de sesión
const LoginPage = (props) => {
    return (
        <div>
            {/* Renderiza el componente LoginForm dentro de un contenedor div */}
            <LoginForm />
        </div>
    );
};

export default LoginPage; // Exporta el componente LoginPage para que pueda ser utilizado en otras partes de la aplicación

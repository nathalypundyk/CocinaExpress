import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './viewrecipe.css';
import HTTPClient from '../../utils/HTTPClient';
import { Link } from 'react-router-dom';

const ViewRecipe = () => {
    const { id } = useParams(); // Utiliza el ID de la receta desde los parámetros de la URL
    const [recipe, setRecipe] = useState(null);
    const navigate = useNavigate();
    const client = new HTTPClient();

    const handleDeletePost = async () => {
        try {
            await client.deletePost(id); // Cambia 'postId' por 'id' que es obtenido de useParams
            alert('El post ha sido eliminado con éxito.');
            navigate('/home'); // Redirigir al usuario después de eliminar el post
        } catch (error) {
            console.error('Error al eliminar el post:', error);
            alert('Hubo un error al eliminar el post.');
        }
    };

    useEffect(() => {
        fetch(`http://localhost:5000/posts/${id}`)
            .then(response => response.json())
            .then(data => setRecipe(data))
            .catch(error => console.error('Error al cargar la receta:', error));
    }, [id]);

    if (!recipe) {
        return <p>Cargando receta...</p>;
    }

    return (
        <div>
            <nav className="nav-bar">
                <Link to="/home">
                    <img src="/imagenes/cocinaExpress.png" alt="Cocina Express" className="logo" />
                </Link>
                <button onClick={() => navigate('/home')}>Volver al Home</button>
            </nav>

            <div className="recipe-detail">
                <h2>{recipe.titulo}</h2>
                <img src={recipe.filename} alt={recipe.titulo} />
                <p><strong>Ingredientes:</strong> {recipe.ingredientes}</p>
                <p><strong>Procedimiento:</strong> {recipe.procedimiento}</p>
                <p><strong>Porciones:</strong> {recipe.porciones}</p>
                <p><strong>Creado por:</strong> usted </p>
                <button onClick={handleDeletePost}>Eliminar Post</button>
            </div>
        </div>
    );
};

export default ViewRecipe;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MainHome/MainHome.css';
import Logout from '../../pages/Logout/Logout';

const PopularRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la red');
        }
        return response.json();
      })
      .then(data => {
        console.log('Datos de recetas:', data); // Verifica los datos en la consola
        setRecipes(data.posts); // Asegúrate de acceder a la propiedad `posts`
      })
      .catch(error => console.error('Error al cargar recetas:', error));
  }, []);

  const handleRecipeClick = (id) => {
    navigate(`/recetas/${id}`); // Redirige a la página de detalles de la receta
  };

  // Filtrar las recetas basadas en el término de búsqueda
  const filteredRecipes = recipes.filter(recipe =>
    recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header>
        <div className="nav-bar">
        <img src="/imagenes/cocinaExpress.png" alt="Cocina Express" className="logo" />
          <input
            type="text"
            placeholder="Buscar recetas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
          />
          <button onClick={() => navigate('/create-post')}>Crear Receta</button>
          <button onClick={() => navigate('/profile')}>Perfil</button>
        </div>
      </header>

      <section className="popular-recipes">
        <h2>Recetas rápidas y fáciles</h2>
        <div className="recipes">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              recipe.visibilidad === 'publico' ? (
                <div key={recipe._id} className="recipe" onClick={() => handleRecipeClick(recipe._id)}>
                  <img src={recipe.filename} alt={recipe.titulo} />
                  <h3>{recipe.titulo}</h3>
                </div>
              ) : null
            ))
          ) : (
            <p>No hay recetas disponibles</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PopularRecipes;

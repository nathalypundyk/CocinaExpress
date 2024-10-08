import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainHome.css';

const PopRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener las recetas populares
    fetch('http://localhost:5000/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la red');
        }
        return response.json();
      })
      .then(data => {
        setRecipes(data.posts);
        setLoading(false);
      })
      .catch(error => {
        setError('Error al cargar recetas: ' + error.message);
        setLoading(false);
      });
  }, []);

  const handleRecipeClick = (id) => {
    navigate(`/recetas/${id}`);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleLoginClick}>Iniciar sesión</button>
          <button onClick={handleRegisterClick}>Registrarme</button>
        </div>
      </header>

      <section className="popular-recipes">
        <h2>Recetas rápidas y fáciles</h2>
        <div className="recipes">
          {loading ? (
            <p>Cargando recetas...</p>
          ) : error ? (
            <p>{error}</p>
          ) : filteredRecipes.length > 0 ? (
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

export default PopRecipes;

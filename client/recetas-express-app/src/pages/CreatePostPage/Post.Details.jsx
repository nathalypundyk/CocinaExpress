import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Post.Details.css';

const RecipeDetails = () => {
  const { id } = useParams(); // Obtén el id de la receta desde los parámetros de la URL
  const [recipe, setRecipe] = useState(null);
  const [likes, setLikes] = useState(0); // Estado para los "me gusta"
  const [comments, setComments] = useState([]); // Estado para los comentarios
  const [newComment, setNewComment] = useState(''); // Estado para el nuevo comentario
  const [userName, setUserName] = useState(''); // Estado para el nombre del usuario actual
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los detalles de la receta por id
    fetch(`http://localhost:5000/posts/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la red');
        }
        return response.json();
      })
      .then(data => {
        setRecipe(data);
        setLikes(data.likes || 0);
        setComments(data.comments || []);
        // Obtener el nombre del usuario asociado con la receta
        fetch(`http://localhost:5000/user/${data.userId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error en la red');
            }
            return response.json();
          })
          .then(userData => {
            setUserName(userData.name); // Asegúrate de que `userData.name` sea el nombre del usuario
          })
          .catch(error => console.error('Error al cargar el usuario:', error));
      })
      .catch(error => console.error('Error al cargar la receta:', error));
  }, [id]);

  const handleLike = () => {
    setLikes(likes + 1);
    // Aquí podrías hacer una solicitud al backend para actualizar los likes en la base de datos
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    const commentData = {
      userId: userName, // Usa el nombre del usuario actual
      text: newComment,
    };

    // Aquí podrías hacer una solicitud al backend para guardar el comentario en la base de datos
    fetch(`http://localhost:5000/posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    })
      .then(response => response.json())
      .then(savedComment => {
        setComments([...comments, savedComment]); // Actualiza la lista de comentarios con el nuevo comentario
        setNewComment(''); // Limpia el campo de comentario
      })
      .catch(error => console.error('Error al enviar el comentario:', error));
  };

  if (!recipe) {
    return <p>Cargando receta...</p>;
  }

  return (
    <div className="recipe-details">
      <nav className="nav-bar">
        <Link to="/home">
          <img src="/imagenes/cocinaExpress.png" alt="Cocina Express" className="logo" />
        </Link>
      </nav>

      <div className="recipe-detail">
        <h2>{recipe.titulo}</h2>
        <img src={recipe.filename} alt={recipe.titulo} />
        <p><strong>Ingredientes:</strong> {recipe.ingredientes}</p>
        <p><strong>Procedimiento:</strong> {recipe.procedimiento}</p>
        <p><strong>Porciones:</strong> {recipe.porciones}</p>
        <p><strong>Creado por:</strong> {userName}</p> {/* Aquí mostramos el nombre del usuario */}

        {/* Sección de "Me gusta" */}
        <div className="likes-section">
          <button onClick={handleLike}>👍 Me gusta</button>
          <span>{likes} Me gusta(s)</span>
        </div>

        {/* Sección de comentarios */}
        <div className="comments-section">
          <h3>Comentarios</h3>
          <ul>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <li key={index}>
                  <strong>{comment.userId}:</strong> {comment.text}
                </li>
              ))
            ) : (
              <p>No hay comentarios disponibles</p>
            )}
          </ul>

          {/* Formulario para agregar un nuevo comentario */}
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              rows="3"
              required
            ></textarea>
            <button type="submit">Comentar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;

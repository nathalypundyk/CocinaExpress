import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import HTTPClient from '../../utils/HTTPClient';
import './Profile.css';

const ProfilePage = ({ userData: initialUserData, editable }) => {
    const [userData, setUserData] = useState(initialUserData || null);
    const [userRecipes, setUserRecipes] = useState([]);
    const [error, setError] = useState(null);
    const { userId } = useParams();
    const client = new HTTPClient();

    const formatRecipeName = (recipeName) => {
        const replaced = recipeName.replace("-", " ");
        return replaced.charAt(0).toUpperCase() + replaced.slice(1);
    };

    useEffect(() => {
        if (!initialUserData && userId) {
            client.getUserById(userId)
                .then(res => {
                    setUserData(res.data);
                    setError(null);
                })
                .catch(err => {
                    setUserData(null);
                    setError("No se encontró el usuario");
                });
        }
    }, [userId, initialUserData]);

    useEffect(() => {
        if (userData && userData.userId) {
            client.getUserRecipes(userData.userId)
                .then(res => {
                    setUserRecipes(res.data.recipes || []);
                    setError(null);
                })
                .catch(err => {
                    setUserRecipes([]);
                    setError("No se encontraron recetas del usuario");
                });
        }
    }, [userData]);

    return (
        <div className="wrapper">
            <nav className="nav-bar">
                <Link to="/home">
                    <img src="/imagenes/cocinaExpress.png" alt="Cocina Express" className="logo" />
                </Link>
            </nav>
            <div className="profile-content">
                {error ? (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                ) : userData ? (
                    <>
                        <div className="content-left">
                            <div className="banner">
                                <img className='banner-avatar' alt="profile" src={userData.profileImage || "../../../publi/imagenes/profile-photo-defdault.png"} />
                                <div className="banner-txt">
                                    <h1>{userData.name}</h1>
                                    <p>{userData.bio}</p>
                                </div>
                                {editable && <Link to={`/update/${userData.userId}`} className="edit-link">Editar</Link>}
                            </div>
                            <div className="recipes-container">
                                {userRecipes.length > 0 ? (
                                    userRecipes.map((recipe, index) => (
                                        <Link to={`/recipes/${recipe._id}`} key={index}>
                                            <img src={recipe.image} alt={recipe.name} className="recipe-pic" />
                                        </Link>
                                    ))
                                ) : (
                                    <p>No hay recetas disponibles.</p>
                                )}
                            </div>
                        </div>
                        <div className="content-right">
                            <h2>Mis Recetas</h2>
                            {userRecipes.length > 0 ? (
                                userRecipes.map((recipe, index) => (
                                    <p key={index}>{formatRecipeName(recipe.name)}</p>
                                ))
                            ) : (
                                <p>No hay recetas disponibles.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Cargando datos del perfil...</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

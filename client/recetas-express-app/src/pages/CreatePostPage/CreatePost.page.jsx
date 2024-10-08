import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HTTPClient from '../../utils/HTTPClient';
import '../../pages/CreatePostPage/CreatePost.page.css';

const CreatePost = (props) => {

    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!props.userData) {
    //         navigate('/login');
    //     }
    // }, [props.userData, navigate]);
    // const {userId} = props.userData.userId;
    const [post, setPost] = useState({
        userId: props.userData.userId,
        titulo: '',
        ingredientes: '',
        procedimiento: '',
        porciones: '',
        visibilidad: 'privado'
    });

    useEffect(() => {
        console.log('Props en CreatePostPage:', props);
        console.log('Estado inicial del post:', post);
        console.log('Datos del usuario en CreatePost:', props.userData);
    }, [props, post]);

    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [isUploaded, setIsUploaded] = useState(false);
    const client = new HTTPClient();
    

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Accede al primer archivo seleccionado
        setFile(file);
        console.log("Archivo seleccionado:", file);
    }

    const handleChange = (e) => {
        setPost({
            ...post,
            [e.target.name]: e.target.value
        });
    }

    // Validar otros campos
    const validate = () => {
        let flag = true;

        if (!file) {
            console.log("agrega una imagen");
            setErrors(prevErrors => ({ ...prevErrors, image: "Debes seleccionar una imagen" }));
            flag = false;
        }

        if (post.titulo.length < 5) {
            console.log("Titulo debe tener al menos 5 caracteres");
            setErrors(prevErrors => ({ ...prevErrors, titulo: "Titulo debe tener al menos 5 caracteres" }));
            flag = false;
        }

        if (post.porciones < 1) {
            setErrors(prevErrors => ({ ...prevErrors, porciones: "Las porciones deben ser mayores a 0" }));
            flag = false;
        }

        return flag;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validate()) return;
    
        const formData = new FormData();
        if (file) {
            formData.append('image', file);
        }
        formData.append('titulo', post.titulo);
        formData.append('ingredientes', post.ingredientes);
        formData.append('procedimiento', post.procedimiento);
        formData.append('porciones', post.porciones);
        formData.append('visibilidad', post.visibilidad);
        // formData.append('userId', post.userId); // Ensure userId is included
    
        try {
            const res = await client.createPost(formData);
            console.log("Post publicado con éxito", res);
            const id = res.data.postId;
            setIsUploaded(true);
            setTimeout(() => {
                navigate(`/recipe/${id}`);
            }, 2000);
        } catch (err) {
            console.error("ERROR:", err.response?.data || err.message);
        }
    };
    
    

    return (
        <div className="container">
            <div className="form-container">
                <h1>NUEVA RECETA</h1>
                <form encType="multipart/form-data">
                    <label htmlFor="titulo">Añade un titulo</label>
                    <input
                        name="titulo"
                        type="text"
                        value={post.titulo}
                        onChange={e => handleChange(e)}
                    />
                    {errors.titulo && <span className="error-msg">{errors.titulo}</span>}

                    <label htmlFor="image">Agrega una foto de la Receta</label>
                    <br />
                    <label htmlFor="image" className="upload-button">Seleccione una foto</label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={e => handleFileChange(e)}
                        className="hidden-input"
                    />
                    {errors.image && <span className="error-msg">{errors.image}</span>}
                    <br />
                    <label htmlFor="ingredientes">Ingredientes</label>
                    <textarea
                        name='ingredientes'
                        value={post.ingredientes}
                        onChange={e => handleChange(e)}
                        rows="1"
                        cols="50"
                    />
                    {/* {errors.ingredientes && <span className="error-msg">{errors.ingredientes}</span>} */}

                    <label htmlFor="procedimiento">Procedimiento</label>
                    <textarea
                        name="procedimiento"
                        value={post.procedimiento}
                        onChange={e => handleChange(e)}
                        rows="2"
                        cols="50"
                    />
                    {/* {errors.procedimiento && <span className="error-msg">{errors.procedimiento}</span>} */}

                    <label htmlFor="porciones">Porciones</label>
                    <input
                        name="porciones"
                        type="number"
                        value={post.porciones}
                        onChange={e => handleChange(e)}
                    />
                    {errors.porciones && <span className="error-msg">{errors.porciones}</span>}

                    <label htmlFor="visibilidad">Visibilidad</label>
                    <div>
                        <select
                            name="visibilidad"
                            value={post.visibilidad}
                            onChange={e => handleChange(e)}
                        >
                            <option value="privado">Privado</option>
                            <option value="publico">Público</option>
                        </select>
                    </div>
                    <br />

                    <button type="submit" onClick={e => handleSubmit(e)}>Crear Receta</button>
                    {isUploaded && <p>Se ha subido la publicación exitosamente</p>}
                </form>
            </div>
        </div>
    );
}

export default CreatePost;

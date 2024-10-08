import axios from "axios"; // Importa la biblioteca axios para hacer solicitudes HTTP

// Clase que encapsula las solicitudes HTTP usando axios
class HTTPClient {
    constructor() {
        // Crea una instancia de axios con configuración predeterminada
        this.instance = axios.create({
            baseURL: "http://localhost:5000", // Establece la URL base para todas las solicitudes
            withCredentials: true // Permite que las solicitudes incluyan cookies y otras credenciales
        });
    }

    /**** LOGIN Y REGISTRO ****/

    // Método para hacer una solicitud POST al endpoint de login
    login(email, password) {
        return this.instance.post("/login", {
            email, // Envía el correo electrónico como parte del cuerpo de la solicitud
            password // Envía la contraseña como parte del cuerpo de la solicitud
        });
    }

    // Método para hacer una solicitud POST al endpoint de registro
    register(data) {
        return this.instance.post("/register", data); // Envía los datos del formulario de registro como parte del cuerpo de la solicitud
    }

    // Método para obtener los datos del perfil del usuario (asumiendo que la ruta /profile está protegida y requiere autenticación)
    getUserData() {
        return this.instance.get("/profile");
    }

    // Método para obtener los datos de un usuario por su ID
    async getUserById(userId) {
        if (!userId) {
            throw new Error("userId es requerido"); // Lanza un error si no se proporciona un userId
        }
        return axios.get(`/user/${userId}`); // Hace una solicitud GET al endpoint para obtener los datos del usuario
    }

    // Método para obtener las recetas de un usuario por su ID
    getUserRecipes(userId) {
        return this.instance.get(`/recipes/user/${userId}`); // Hace una solicitud GET al endpoint para obtener las recetas del usuario
    }

    // Método para actualizar los datos de un usuario
    updateUser(id, formData) {
        return axios.put(`/user/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Establece el tipo de contenido para enviar datos de formulario con archivos
            },
        });
    }

    /**** POSTS ****/

    // Método para crear una nueva publicación
    createPost(data) {
        const formData = new FormData(); // Crea un nuevo objeto FormData para enviar datos con archivos
        formData.append('image', data.image);
        formData.append('titulo', data.titulo);
        formData.append('ingredientes', data.ingredientes);
        formData.append('procedimiento', data.procedimiento);
        formData.append('porciones', data.porciones);
        formData.append('visibilidad', data.visibilidad);
        formData.append('userId', data.userId);
        formData.append('comments', data.comments);
        console.log(formData);
        return this.instance.post("/posts/new", data); // Envía los datos de la nueva publicación al endpoint
    }

    // Método para editar una publicación existente
    editPost(id, data) {
        return this.instance.put(`/posts/${id}/edit`, data); // Envía los datos actualizados al endpoint para editar la publicación
    }
    
    deletePost(postId) {
        return this.instance.delete(`/posts/${postId}`);
    }

    // Método para guardar un comentario en una publicación
    saveComment(id, data) {
        console.log("en http client", data);
        return this.instance.post(`/posts/${id}/comment`, data); // Envía el comentario al endpoint para agregarlo a la publicación
    }

    // Método para obtener publicaciones paginadas
    getPagePosts(page) {
        return this.instance.get(`/posts?page=${page}`); // Hace una solicitud GET al endpoint para obtener publicaciones en una página específica
    }

    // Método para obtener una publicación por su ID
    getPostById(id) {
        return this.instance.get(`/posts/${id}`); // Hace una solicitud GET al endpoint para obtener los datos de una publicación por su ID
    }

    // Método para obtener las publicaciones de un usuario por su ID
    getUserPosts(userId) {
        return this.instance.get(`/posts/user/${userId}`); // Hace una solicitud GET al endpoint para obtener las publicaciones de un usuario específico
    }
}

export default HTTPClient; // Exporta la clase HTTPClient para que pueda ser utilizada en otras partes de la aplicación

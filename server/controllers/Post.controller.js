const { Post } = require('../models/Post.model');
const { Comment } = require('../models/Post.model');
const mongoose = require("mongoose");

exports.savePost = async (req, res) => {
    console.log("DENTRO DE CREATEPOST");
    console.log("Archivo recibido:", req.file);
    console.log("Cuerpo de la solicitud:", req.body);
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ningún archivo' });
        }

        // Crear un nuevo post con los datos recibidos
        const newPost = new Post({
            userId: req.body.userId,
            titulo: req.body.titulo,
            ingredientes: req.body.ingredientes,
            procedimiento: req.body.procedimiento,
            porciones: req.body.porciones,
            visibilidad: req.body.visibilidad,
            filename: `http://localhost:5000/api/static/${req.file.filename}`,
        });

        console.log("Post a guardar:", newPost);

        // Guardar el post en la base de datos
        await newPost.save();
        res.status(201).json({ message: 'Post creado en la DB', postId: newPost._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el post' });
    }
}

// Controlador para incrementar los likes de un post
exports.incrementLikes = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        // Incrementar el número de likes
        post.likes += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar likes', error });
    }
};


exports.saveComment = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId);

        // Crear un nuevo comentario
        const newComment = new Comment({
            userId: userId,
            text: req.body.text
        });

        // Guardar el comentario en la base de datos
        await newComment.save();

        // Asociar el comentario al post correspondiente
        await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: newComment._id }
        });

        res.status(201).json({ message: 'Comentario creado y guardado en la DB', commentId: newComment._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el comentario' });
    }
}

exports.editPost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ post: updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el post' });
    }
}

exports.deletePost = async (req, res) => {
    const { id } = req.params; // Obtener el ID del post desde los parámetros de la solicitud

    try {
        const deletedPost = await Post.findByIdAndDelete(id); // Buscar y eliminar el post por ID

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        res.status(200).json({ message: 'Post eliminado con éxito' }); // Responder con éxito si se eliminó
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el post' }); // Manejar errores
    }
};

exports.getPagePosts = async (req, res) => {
    console.log("DENTRO DE GETPAGEPOST");
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const skip = (page - 1) * pageSize;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);

        res.json({ posts, currentPage: page });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las publicaciones' });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 });

        res.json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las publicaciones del usuario' });
    }
}

// exports.getPostById = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const post = await Post.findById(id);

//         res.json({ post });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error al obtener la publicación' });
//     }
// }
exports.getPostById = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la publicación' });
    }
};

exports.getCommentById = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findById(id);

        res.json({ comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el comentario' });
    }
}



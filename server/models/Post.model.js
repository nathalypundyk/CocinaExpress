const mongoose = require("mongoose");
const { Schema } = mongoose;
const { User } = require("./user");

const CommentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    text: {
        type: String,
        required: true
    }
});

const PostSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    titulo: {
        type: String,
        required: true
    },
    ingredientes: {
        type: String,
        required: true
    },
    procedimiento: {
        type: String,
        required: true
    },
    porciones: {
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String
    },
    visibilidad: {
        type: String,
        enum: ['publico', 'privado'],
        default: 'privado'  // Valor predeterminado privado
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {timestamps: true});

const Post = mongoose.model("Post", PostSchema);
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = { 
    Post,
    Comment
};

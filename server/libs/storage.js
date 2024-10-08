const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Obtener la extensión del archivo original
        const ext = file.originalname.split('.').pop();
        // Concatenar la extensión al nombre del archivo
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
    }
})
const upload = multer({ storage: storage });
module.exports = upload;
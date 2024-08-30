const multer = require('multer');
const uuid = require('uuid/v1');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        console.log("error in uploading image")
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        console.log(isValid)
        console.log(file.mimetype)
        console.log(MIME_TYPE_MAP)
        let error = isValid ? null : new Error('Invalid mime type!');
        console.log(error)
        cb(error, isValid);
    }
});

module.exports = fileUpload;
import __dirname from "./index.js";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = `${__dirname}/../public/uploads/`;

    // Determinar la subcarpeta según el fieldname
    if (file.fieldname === "image") {
      uploadPath = `${__dirname}/../public/uploads/pets`;
    } else if (file.fieldname === "documents") {
      uploadPath = `${__dirname}/../public/uploads/documents`;
    }

    // Crear la carpeta si no existe
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;

const multer = require("multer");

const ValidationException = require("../error/ValidationException");


// static filter images
const multerImageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)) {
    return cb(
      new ValidationException([
        {
          msg: "Please upload an image 'png','jpg','jpeg','webp' formats ",
          param: "image",
        },
      ])
    );
  }
  cb(null, true);
};



const videoStorage = multer.diskStorage({
  destination: "uploads/video",

  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-")+"."+file.mimetype.split('/')[1]
    );
  },
});

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 1000 * 1024 * 1024 },
});

const productStorage = multer.diskStorage({
  destination: "uploads/product",
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + decode_utf8(file.originalname)
    );
  },
});

const uploadProduct = multer({
  storage: productStorage,
  
});


const galleryStorage = multer.diskStorage({
  destination: "uploads/gallery",
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + decode_utf8(file.originalname.replace(/ [s]*/g, "_"))
    );
  },
});

const uploadGallery = multer({
  storage: galleryStorage,
});

module.exports = {
  uploadGallery,
  uploadVideo,
  uploadProduct,
};

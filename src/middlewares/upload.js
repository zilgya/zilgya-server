const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Zilgya - Project",
  },
});

const limit = {
  fileSize: 4e6, // 4mb
};

const imageFilter = (req, file, cb) => {
  const extName = path.extname(file.originalname);
  const allowedExt = /jpg|jpeg|png|JPG|JPEG|PNG/;
  if (!allowedExt.test(extName))
    return cb(new Error("Image should be .jpg, .jpeg, or .png"), false);
  cb(null, true);
};

const imageUpload = multer({
  storage: cloudStorage,
  limits: limit,
  fileFilter: imageFilter,
});

module.exports = imageUpload;

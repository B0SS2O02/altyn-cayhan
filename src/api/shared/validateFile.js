let errors = [];
const MimeType = (files = []) => {
  const validateMimeType = {
    image: {
      test: function (originalname) {
        return /\.(png|jpg|jpeg|webp)$/.test(originalname);
      },
      validate: "png,jpg,jpeg,webp",
    },
    video: {
      test: function (originalname) {
        return /\.(mp4|3gp|mkv|mpeg)$/.test(originalname);
      },
      validate: "mp4,3gp,mkv,mpeg",
    },
  };

  files.forEach((element, index) => {
    const err = {};
    if (!validateMimeType[element.fieldname].test(element.originalname)) {
      err.param = element.fieldname;
      err.msg = `${element.fieldname} must be ${
        validateMimeType[element.fieldname].validate
      } formats`;
      errors.push(err);
    }
  });
};

const EmptyField = (files = []) => {
  if (files.length !== 2) {
    let TRUE_FILE_FIELDNAME;
    const validate = `field should not be empty`;
    files.forEach((element) => {
      if (element.fieldname === "image" || element.fieldname === "video") {
        TRUE_FILE_FIELDNAME = element.fieldname;
      }
    });
    ["image", "video"].forEach((element) => {
      if (TRUE_FILE_FIELDNAME !== element) {
        errors.push({
          param: element,
          msg: `${element} ${validate}`,
        });
      }
    });
  }
};


const fullValidateFile = (files) => {
  errors = [];
  MimeType(files);
  EmptyField(files);
  return errors;
};

const validateMimeType = (files) => {
  errors = [];
  MimeType(files);
  return errors;
};

module.exports = { fullValidateFile, validateMimeType };

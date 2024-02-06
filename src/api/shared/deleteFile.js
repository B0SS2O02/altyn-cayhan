const fs = require("fs");

exports.deleteFile = async (filename) => {
  fs.unlinkSync(filename, (err) => {
    if (err) throw err;
  });
};

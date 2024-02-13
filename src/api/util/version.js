const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "version.json");

fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFileSync(filePath, JSON.stringify({ version: 0 }), (err) => {
      console.log("Version access error", err);
    });
  }
});

const getVersion = () => {
  return JSON.parse(
    fs.readFileSync(filePath, (err) => {
      console.log("Version read error", err);
    })
  );
};

const upVersion = () => {
  const { version } = getVersion();
  fs.writeFileSync(
    filePath,
    JSON.stringify({ version: version + 1 }),
    (err) => {
      console.log("Version access error", err);
    }
  );
};

module.exports = { getVersion, upVersion };

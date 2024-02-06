const path = require("path");
const fs = require("fs").promises;
const buff = Buffer.alloc(100);
const header = Buffer.from("mvhd");

module.exports = async function getVideoLength(filename,dir) {
  const file = await fs.open(path.join("uploads", dir, filename));
  const { buffer } = await file.read(buff, 0, 100, 0);

  await file.close();

  const start = buffer.indexOf(header) + 16;
  const timeScale = buffer.readUInt32BE(start);
  const duration = buffer.readUInt32BE(start + 4);

  return Math.floor((duration / timeScale) * 1000) / 1000;
};

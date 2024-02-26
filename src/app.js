const express = require("express");
const app = express();
const path = require("path");
const ADMIN_VIEW_SOURCE = require("./admin_view/app");
const API = require("./api/app");

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(
  "/node_modules",
  express.static(path.join(__dirname, "..", "node_modules"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "admin_view", "assets"))
);

app.use(function (req, res, next) {
  console.log(req.method, req.hostname, req.baseUrl, req.url);
  next();
});
//-----------------------------  cors ---------------------
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//---------------------------- end of cors ----------------
app.use(function (req, res, next) {
  console.log(req.method, req.hostname, req.baseUrl, req.url);
  next();
});

app.engine(".html", require("ejs").__express);
app.set("views", path.join(__dirname, "admin_view", "views"));
app.set("view engine", "html");

app.use(express.json());

app.use("/admin", ADMIN_VIEW_SOURCE);
app.use("/api/v1", API);

app.get("/", async (req, res, next) => {
  res.render("main.html");
});

module.exports = app;

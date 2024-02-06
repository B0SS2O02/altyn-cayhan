const express = require("express");
const app = express();
const AdminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authorization = require("./middleware/authorization");
app.use(express.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(cookieParser());

app.engine(".html", require("ejs").__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use(authRoutes);
app.use(authorization);
app.use(AdminRoutes);

// app.use((err, req, res, next) => {
//     res.render("admin/pages/error.html")
// })

module.exports = app;

const axios = require("axios");

exports.getLogin = async (req, res, next) => {
  res.render("auth/login.html", {
    path: "/admin/login",
    lang: 'tm'
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      req.body,
      {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.data;
    if (!data || !data.login) return res.redirect("/admin/login");
    res.cookie("user", data.user);
    res.cookie("token", data.token);
    res.cookie("lang", 'tm')
    res.redirect("/admin");
  } catch (err) {
    console.log(err)
    next(err);
  }
};

exports.postLogout = (req, res, next) => {
  res.clearCookie("token");
  res.redirect("/admin/login");
};

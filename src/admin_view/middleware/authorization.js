const axios = require("axios");
module.exports = async (req, res, next) => {
  if (!req.cookies || Object.keys(req.cookies).length == 0) {
    return res.redirect("/admin/login");
  }
  //  next(new ErrorException("Authentication failed"));
  try {
    const response = await axios.post(
      "http://localhost:8880/api/v1/auth/token/verify",
      JSON.stringify({ token: req.cookies.token }),
      {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    if (!data || !data.success) {
      return res.redirect("/admin/login");
    }
    res.locals.user = req.cookies.user || {
      name: 'food admin',
      role: 'admin'
    };
    res.locals.lang = req.cookies.lang || 'tm'
  } catch (err) {
    next(err);
  }
  next();
};

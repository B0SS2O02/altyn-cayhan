const express = require("express");
const router = express.Router();
const authService = require("./authService");
const { body, validationResult } = require("express-validator");
const ValidationException = require("../error/ValidationException");

router.get("/users", async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.send(users);
  } catch (err) {
    next(err);
  }
});

router.get("/user/:id", async (req, res, next) => {
  try {
    const user = await authService.findUserById(req.params.id);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.get("/user-active/:id", async (req, res, next) => {
  try {
    await authService.userActivate(req.params.id);
    res.send();
  } catch (err) {
    next(err);
  }
});

router.post(
  "/auth",
  [
    body("login").notEmpty().withMessage("login should not be empty"),
    body("password").notEmpty().withMessage("password should not be empty"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationException(errors.array()));
      }
      await authService.save(req.body);
      res.send({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

router.put("/auth/:id", async (req, res, next) => {
  try {
    await authService.updateUser(req.body, req.params.id);
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/auth/:id", async (req, res, next) => {
  try {
    await authService.deleteUser(req.body, req.params.id);
    res.send();
  } catch (err) {
    next(err);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const auth = await authService.compare(req.body);
    if (!auth || !auth.login) return res.send({ login: false });
    if (auth && auth.login) {
      const token = await authService.generateToken(
        auth.user.id,
        auth.user.login
      );
      return res.send({
        login: true,
        user: {
          name: auth.user.fullName,
          role: auth.user.role,
        },
        token: token,
      });
    }
  } catch (err) {
    next(err);
  }
});
router.post("/auth/token/verify", async (req, res, next) => {
  try {
    if (!req.body || !req.body.token) return res.send({ success: false });
    const verify = await authService.decodeToken(req.body.token);
    res.send({ success: verify });
  } catch (err) {
    next(err);
  }
});
router.post("/auth/user/role", async (req, res, next) => {
  try {
    const role = authService.findUser;
    res.send({ success: role });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

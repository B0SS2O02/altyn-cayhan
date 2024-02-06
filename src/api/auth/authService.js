const NotFoundException = require("../error/NotFoundException");
const Auth = require("./auth");
const jwt = require("jsonwebtoken");

const config = require("config");
const keyConfig = config.get("key");

const save = async (body) => {
  return await Auth.create(body);
};

const findUserById = async (id) => {
  const user = await Auth.findByPk(id);
  if (!user) throw new NotFoundException();
  return user;
};

const updateUser = async (body, id) => {
  const user = await findUserById(id);
  await user.update(body);
};

const deleteUser = async (body, id) => {
  const user = await findUserById(id);
  await user.destroy();
};

const generateToken = async (id, login) => {
  const data = {
    id: id,
    login: login,
  };
  return jwt.sign(data, keyConfig.JWT_SECRET_KEY);
};

const decodeToken = async (token) => {
  const decodedData = jwt.verify(
    token,
    keyConfig.JWT_SECRET_KEY,
    function (err, decoded) {
      if (err) {
        return false;
      }
      return decoded;
    }
  );
  if (!decodedData) return false;
  const user = await Auth.findOne({
    where: {
      id: decodedData.id,
      login: decodedData.login,
    },
  });
  if (!user) return false;
  else return true;
};

const compare = async (body) => {
  const user = await Auth.findOne({
    where: {
      login: body.login,
      password: body.password,
    },
  });

  if (!user || !user.active)
    return {
      login: false,
    };

  if (user.role !== "admin" && user.role !== "shop")
    return {
      login: false,
    };
  return {
    login: true,
    user: user,
  };
};

const getAllUsers = async () => {
  const users = await Auth.findAll();
  return users;
};

const userActivate = async (id) => {
  const user = await findUserById(id);
  user.active = !user.active;
  await user.save();
};

module.exports = {
  save,
  updateUser,
  deleteUser,
  compare,
  findUserById,
  decodeToken,
  generateToken,
  getAllUsers,
  userActivate,
};

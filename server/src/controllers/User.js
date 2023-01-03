const { createUser, findUser } = require("../services/User");
const { CreateErrorClass } = require("../utils/error");

const createUserHandler = async (req, res, next) => {
  try {
    const body = req.body;
    const db_user = await findUser({ email: body.email });

    if (db_user) {
      next(CreateErrorClass(500, "failure", "User already Present"));
    }
    const user = await createUser(body);
    const user_obj = user.toObject();
    delete user_obj.password;
    console.log(user_obj);
    res.status(200).json({ status: "success", data: user_obj });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUserHandler,
};

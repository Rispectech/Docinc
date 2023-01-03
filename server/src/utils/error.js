class ErrorClass extends Error {
  constructor(status, type, msg) {
    super(msg);
    this.status = status;
    this.type = type;
  }
}

const CreateErrorClass = (status, type = "failure", msg) => {
  return new ErrorClass(status, type, msg);
};

const ErrorRoutes = (req, res) => {
  return res.status(404).send("Route not found");
};

const ErrorHandler = (error, req, res, next) => {
  console.log(error);
  if (error instanceof ErrorClass)
    return res.status(error.status).json({ status: error.type, msg: error.message });
  return res.status(500).json({ type: "Undefined", msg: "Something went wrong ..." });
};

module.exports = { CreateErrorClass, ErrorRoutes, ErrorHandler };

const createError = require("http-errors");
const { validationResult } = require("express-validator");

/**
 * @returns {import("express").RequestHandler}
 */
function notFoundHander() {
  return function (req, res, next) {
    const err = createError(404, "resource not found");
    next(err);
  };
}

/**
 * @returns {import("express").ErrorRequestHandler}
 */
function errorLogger() {
  return function (err, req, res, next) {
    console.error(err.stack);
    next(err);
  };
}

/**
 * @returns {import("express").ErrorRequestHandler}
 */
function errorHandler() {
  //eslint-disable-next-line no-unused-vars
  return function (err, req, res, next) {
    let message = "Something went wrong";
    let status_code = 500;
    if (err.statusCode) {
      status_code = err.statusCode;
      message = err.message;
    }
    res.status(status_code).json({
      message,
      status_code,
    });
  };
}

/**
 * @returns {import('express').RequestHandler}
 */
function validate() {
  return function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      const message = `${error.param} ${error.msg}`;
      const err = createError(400, message);
      next(err);
    }
    next();
  };
}

module.exports = {
  notFoundHander,
  errorLogger,
  errorHandler,
  validate,
};

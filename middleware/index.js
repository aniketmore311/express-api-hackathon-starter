const createError = require("http-errors");
const { validationResult } = require("express-validator");
const { getConfig } = require("../config/configService");
const jwt = require("jsonwebtoken");
const SECRET_KEY = getConfig("SECRET_KEY");

function authenticate() {
  return function (req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
      const error = createError(401, "Authorization header is required");
      next(error);
      return;
    }
    const splits = header.split(" ");
    if (splits[0] !== "Bearer" && splits[0] !== "bearer") {
      const error = createError(
        401,
        "Authorization header must start with Bearer"
      );
      next(error);
      return;
    }
    if (splits.length < 2) {
      const error = createError(
        401,
        "Authorization header must contain a token"
      );
      next(error);
      return;
    }

    try {
      const tokenDecoded = jwt.verify(splits[1], SECRET_KEY);
      req.user = tokenDecoded;
    } catch (err) {
      const error = createError(401, "Invalid token");
      next(error);
      return;
    }
    next();
  };
}

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
      const message = `${error.msg}`;
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
  authenticate,
};

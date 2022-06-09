/**
 * @param {AsyncHandler} asyncHandler
 * @returns {import("express").RequestHandler}
 */
function catchAsync(asyncHandler) {
  return function (req, res, next) {
    asyncHandler(req, res, next).catch(next);
  };
}

module.exports = {
  catchAsync,
};

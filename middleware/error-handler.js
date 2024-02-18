const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors/custom-api');

const errorHandlerMiddleware = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'Something went wrong try again later';
    res.status(error.statusCode).json({ message: error.message , success:false,})
}
module.exports = errorHandlerMiddleware
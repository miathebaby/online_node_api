module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const validation = err.validation || null;

    return res.status(statusCode).json({
        error: {
            status_code: statusCode,
            message: message,
            validation: validation,
        }
        
    });
};
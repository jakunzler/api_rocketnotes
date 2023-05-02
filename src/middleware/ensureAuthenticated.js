const { verify } = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new AppError("JWT token is missing", 401);
    };

    const [, token] = authHeader.split(" ");

    try {

        const decodedToken = verify(token, authConfig.jwt.secret);

        const { sub: user_id } = decodedToken;

        request.user = {
            id: Number(user_id)
        };

        return next();

    } catch {

        throw new AppError("Invalid JWT token", 401);

    };


}
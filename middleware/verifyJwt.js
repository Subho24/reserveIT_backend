const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({message: 'No access token found'});
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({message: 'Invalid access token'}); //invalid token
            req.body = {user_name: decoded.user, companyId: decoded.companyId};
            next();
        }
    );
}

module.exports = verifyJWT
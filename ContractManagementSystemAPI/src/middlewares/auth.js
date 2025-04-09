const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

export const authMiddleware = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized - No token provided" });
    let rawToken = authHeader.split(" ");
    if (rawToken.length <= 1) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    let token = rawToken[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    try {
        jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
            if (err) res.status(403).json({ message: "Forbidden - Invalid token" });
            req.user = payload;
            next();
        });
    } catch (error) {
        return res.status(403).json({ message: "Forbidden - Invalid token" });
    }
};
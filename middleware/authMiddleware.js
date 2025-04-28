const jwt = require('jsonwebtoken');

const authenticateJWT = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};


const authAdmin = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = authenticateJWT(token)
        if (decoded.role != 'admin')
            return res.status(403).json({ message: 'You are not an admin' });

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
}


const authStudent = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = authenticateJWT(token)
        if (decoded.role != 'student')
            return res.status(403).json({ message: 'You are not a student' });

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
}

const authTeacher = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = authenticateJWT(token)
        if (decoded.role != 'teacher')
            return res.status(403).json({ message: 'You are not a teacher' });

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
}


module.exports = { authAdmin, authStudent, authTeacher };


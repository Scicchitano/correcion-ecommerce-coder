

async function isAdmin(req, res, next) {
    console.log("req.session.user", req.session.user);
    // Verifica si hay una sesión de usuario
    if (!req.session.user) {
        return res.status(401).json({ status: 'error', error: 'No session found' });
    }
    if (req.session.user.role !== "admin") {
        return res.status(403).json({ status: 'error', error: 'Unauthorized' });
    }

    next();
};

module.exports = isAdmin;

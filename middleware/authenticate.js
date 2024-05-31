const jwt = require('jsonwebtoken');
// const secretKey = '201cc125e2635e2f4a6ab0ecbc7235b93a6beb2c49da65ffa7b630777f3c9032f135d3e46f577ee84a9aaf1c94810c0e65615b6098fdd2718e0fd3c2d902183a'

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };

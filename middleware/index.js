const jwt = require('jsonwebtoken');

const {ProyectController} = require('../models/proyect')

middleware = {
    isLoggedIn: function(req, res, next) {
        let token = req.headers.authorization;
        token = token.replace('Bearer ', '');

        jwt.verify(token, 'secret', (err, user) => {
            if(err) {
                res.statusMessage = 'Invalid Token';
                return res.status(401).send();
            }

            req.token = token;
            next();
        })
    }
}

module.exports = middleware;
const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const jsonParser = bodyParser.json();
const router = express.Router();

const {UserController} = require('../models/user');
const ServerError = require('../error');

router.post('/login', jsonParser, (req, res) => {
    let {email, password} = req.body;

    if (email == undefined || password == undefined) {
        res.statusMessage = "No email or password provided";
        return res.status(406).send();
    }

    UserController.getByEmail(email)
        .then(user => {
            if (user == null) {
                throw new ServerError(404, "User not found");
            }

            if (user.password !== password) {
                throw new ServerError(401, "Invalid password");
            }

            let data = {
                id: user._id
            }

            let token = jwt.sign(data, 'secret', {
                expiresIn: 60 * 60
            });

            return res.status(200).json({token: token, id: user._id});
        })
        .catch(error => {
            if (error.code === 404) {
                res.statusMessage = error.message;
                return res.status(404).send();
            } else if (error.code === 401) {
                res.statusMessage = error.message;
                return res.status(401).send();
            }
        })
}); 

module.exports = router;
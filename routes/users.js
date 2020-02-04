const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();
const jsonParser = bodyParser.json();

const {UserController} = require('../models/user');
const ServerError = require('../error');

router.get('/all', jsonParser, (req, res) => {
    UserController.getAll()
        .then(users => {
            return res.status(200).json(users);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = 'DB error';
            return res.status(500).send();
        });
});

router.get('/email/:e', jsonParser, (req, res) => {
    const email = req.params.e;

    if(!email) {
        res.statusMessage = 'No email given in request';
        res.status(406).send();
    }

    UserController.getByEmail(email)
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = 'DB error';
            return res.status(500).send();
        });
});

router.get('/:id', jsonParser, (req, res) => {
    const id = req.params.id;

    if (id == undefined) {
        res.statusMessage = "No id given";
        return res.status(406).send();
    }

    UserController.getById(id)
        .then(user => {
            if (!user) {
                throw new ServerError(404, "ID not found");
            }
            return res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "User not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "DB error";
                return res.status(500).send();
            }
        });
});

router.post('/create', jsonParser, (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName || !email || !password) {
        res.statusMessage = 'Missing parameters for user creation';
        res.status(406).send();
    }

    UserController.getByEmail(email)
        .then(user => {
            if(user != null) {
                throw new ServerError(409);
            }

            let newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                bio: '',
                pendingInvites: []
            }

            return UserController.create(newUser);
        })
        .then(nUser => {
            return res.status(201).json(nUser);
        })
        .catch(error => {
            console.log(error);
            if(error.code === 409) {
                res.statusMessage = 'Given email already in use';
                return res.status(409).send();
            } else {
                res.statusMessage = 'DB error';
                return res.status(500).send();
            }
        });
});

router.put('/update/:id', jsonParser, async (req, res) => {
    const id = req.params.id;

    if(!id) {
        res.statusMessage = 'No id was given to update';
        return res.status(406).send();
    }

    UserController.getById(id)
        .then(user => {
            if(!user) {
                throw new ServerError(404, 'ID not found');
            }

            const {firstName, lastName, bio, pendingInvites} = req.body;

            if(!firstName && !lastName && !bio && !pendingInvites) {
                res.statusMessage = 'No parameters were changed for the update';
                return res.status(409).send();
            }

            let updatedUser = {};

            if(firstName) {
                updatedUser.firstName = firstName;
            }

            if(lastName) {
                updatedUser.lastName = lastName;
            }

            if(bio) {
                updatedUser.bio = bio;
            }

            if(pendingInvites) {
                updatedUser.pendingInvites = pendingInvites;
            }

            return UserController.update(id, updatedUser);
        })
        .then(uUser => {
            return res.status(202).json(uUser);
        })
        .catch(error => {
            console.log(error);
            if(error.code === 404) {
                res.statusMessage = 'No user was found with the given id';
                return res.status(404).send();
            } else {
                res.statusMessage = 'DB error';
                return res.status(500).send();
            }
        });
});

router.delete('/delete/:id', jsonParser, (req, res) => {
    const id = req.params.id;
    
    if (!id) {
        res.statusMessage = "No ID given to delete";
        return res.status(406).send();
    }

    UserController.getById(id)
        .then(user => {
            if (!user) {
                throw new ServerError(404);
            }

            return UserController.delete(id);
        })
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "User not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

module.exports = router;
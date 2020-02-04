const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();
const jsonParser = bodyParser.json();

const {ProyectController} = require('../models/proyect');
const {UserController} = require('../models/user');
const ServerError = require('../error');
const middleware = require('../middleware')

router.get('/all', jsonParser, middleware.isLoggedIn, (req, res) => {
    ProyectController.getAll()
        .then(proyects => {
            return res.status(200).json(proyects);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = 'DB error';
            return res.status(500).send();
        })
})

router.get('/category/:cat', jsonParser, middleware.isLoggedIn, (req, res) => {
    const category = req.params.cat;

    if(!category) {
        res.statusMessage = 'No category given in request';
        res.status(406).send();
    }

    ProyectController.getByCategory(category)
        .then(proyects => {
            return res.status(200).json(proyects);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = 'DB error';
            return res.status(500).send();
        });
})

router.get('/:id', jsonParser, middleware.isLoggedIn, (req, res) => {
    const id = req.params.id;

    if(!id) {
        res.statusMessage = 'No id was given';
        return res.status(406).send();
    }

    ProyectController.getById(id)
        .then(proyect => {
            if(!proyect) {
                throw new ServerError(404, 'ID not found');
            }
            return res.status(200).json(proyect);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = 'No proyect found with the given id';
                return res.status(404).send();
            } else {
                res.statusMessage = 'DB error';
                return res.status(500).send();
            }
        })
})

router.get('/owner/:id', jsonParser, middleware.isLoggedIn, (req, res) => {
    const id = req.params.id;

    if(!id) {
        res.statusMessage = 'No owner id was given';
        return res.status(406).send();
    }

    ProyectController.getByOwnerId(id)
        .then(proyects => {
            return res.status(200).json(proyects);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = 'DB error';
            return res.status(500).send();
        })
})

router.get('/exclude/:id', jsonParser, middleware.isLoggedIn, (req, res) => {
    const id = req.params.id;

    if(!id) {
        res.statusMessage = 'No id was given';
        return res.status(406).send();
    }

    ProyectController.getAllExcludeMembership(id)
        .then(proyects => {
            return res.status(200).json(proyects);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = 'DB error';
            return res.status(500).send();
        })
})

router.get('/team/:id', jsonParser, middleware.isLoggedIn, (req, res) => {
    const id = req.params.id;

    if(!id) {
        res.statusMessage = 'No id was given';
        return res.status(406).send();
    }

    ProyectController.getByTeamMembership(id)
        .then(proyects => {
            return res.status(200).json(proyects);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = 'DB error';
            return res.status(500).send();
        })
})

router.post('/create', jsonParser, middleware.isLoggedIn, (req, res) => {
    jwt.verify(req.token, 'secret', (err, user) => {
        if(err) {
            console.log(err);
            return res.status(403).send();
        } else {
            const {name, description, categories} = req.body;

            if(!name || !description || !categories) {
                res.statusMessage = 'Missing parameters for proyect creation';
                return res.status(406).send();
            }

            let newProyect = {
                name: name,
                description, description,
                categories: categories,
                image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
                owner: user.id,
                teamMembers: []
            }

            return ProyectController.create(newProyect)
            .then(nProyect => {
                return res.status(201).json(nProyect);
            })
            .catch(error => {
                console.log(error);
                res.statusMessage = 'DB error';
                return res.status(500).send();
            });
        }
    })
})

router.put('/update/:id', jsonParser, middleware.isLoggedIn, (req ,res) => {

    jwt.verify(req.token, 'secret', (err, user) => {
        if(err) {
            console.log(err);
            res.statusMessage = 'Restricted';
            return res.status(403).send();
        } else {
            const id = req.params.id;

            if(!id) {
                res.statusMessage = 'No id was given to update';
                return res.status(406).send();
            }

            ProyectController.getById(id)
                .then(proyect => {
                    if(!proyect) {
                        throw new ServerError(404, 'ID not found');
                    }

                    console.log(proyect.owner);
                    // if(proyect.owner._id != user.id) {
                    //     res.statusMessage = 'Restricted';
                    //     return res.status(403).send();
                    // }

                    const {name, description, image, categories, teamMembers, comments} = req.body;

                    if(!name && !description && !image && !categories && !teamMembers && !comments) {
                        res.statusMessage = 'No parameters were changed for the update';
                        return res.status(409).send();
                    }

                    let updatedProyect = {};

                    if(name) {
                        updatedProyect.name = name;
                    }

                    if(description) {
                        updatedProyect.description = description;
                    }

                    if(image) {
                        updatedProyect.image = image;
                    }

                    if(categories) {
                        updatedProyect.categories = categories;
                    }

                    if(teamMembers) {
                        updatedProyect.teamMembers = teamMembers;
                    }

                    if(comments) {
                        updatedProyect.comments = comments;
                    }

                    return ProyectController.update(id, updatedProyect);
                })
                .then(uProyect => {
                    return res.status(202).json(uProyect);
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
        }
    })
    
});

router.delete('/delete/:id', jsonParser, middleware.isLoggedIn, (req, res) => {

    jwt.verify(req.token, 'secret', (err, user) => {
        if(err) {
            console.log(err);
            res.statusMessage = 'Restricted';
            return res.status(403).send();
        }
        const id = req.params.id;

        if(!id) {
            res.statusMessage = 'No ID was given to delete';
            return res.status(406).send();
        }
    
        ProyectController.getById(id)
            .then(u => {
                if(!u) {
                    throw new ServerError(404);
                }

                if(u.owner._id != user) {
                    res.statusMessage = 'Restricted';
                    return res.status(403).send();
                }
    
                return ProyectController.delete(id);
            })
            .then(user => {
                return res.status(200).json(user);
            })
            .catch(error => {
                console.log(error);
                if(error.code === 404) {
                    res.statusMessage = 'User not found with the given id';
                    return res.status(404).send();
                } else {
                    res.statusMessage = 'DB error';
                    return res.status(500).send();
                }
            })

    });

})

module.exports = router;
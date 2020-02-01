const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();
const jsonParser = bodyParser.json();

const {ProyectController} = require('../models/proyect');
const ServerError = require('../error');
const middleware = require('../middleware')

router.get('/all', jsonParser, (req, res) => {
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

router.get('/category', jsonParser, (req, res) => {
    const category = req.query.category;

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

router.get('/:id', jsonParser, (req, res) => {
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
                res.statusMessage = 'No user found with the given id';
                return res.status(404).send();
            } else {
                res.statusMessage = 'DB error';
                return res.status(500).send();
            }
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
                owner: user.id
            }

            return ProyectController.create(newProyect)
            .then(nProyect => {
                return res.status(201).json(nProyect);
            })
            .catch(error => {
                console.log(error);
                res.statusMessage = 'DB error';
                return res.status(500).send();
            })
        }
    })

})

// router.put('/update/:id', jsonParser, (req ,res) => {
//     const id = req.params.id;

//     if(!id) {
//         res.statusMessage = 'No id was given to update';
//         return res.status(406).send();
//     }

//     ProyectController.getById(id)
//         .then(proyect => {
//             if(!proyect) {
//                 throw new ServerError(404, 'ID not found');
//             }
//         })
// })

module.exports = router;
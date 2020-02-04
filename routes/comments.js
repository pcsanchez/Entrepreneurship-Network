const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();
const jsonParser = bodyParser.json();

const {CommentController} = require('../models/comment');
const ServerError = require('../error');
const middleware = require('../middleware');

router.get('/all', jsonParser, (req, res) => {
    CommentController.getAll()
        .then(comments => {
            return res.status(200).json(comments);
        })
        .catch(error => {
            return res.status(500).send();
        })
})

router.post('/create', jsonParser, (req, res) => {
    const {text, author} = req.body;

    const newComment = {
        text: text,
        author: author
    }

    return CommentController.create(newComment)
        .then(nComment => {
            return res.status(201).json(nComment);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send('DB error');
        })
})

router.delete('/delete', jsonParser, (req, res) => {
    const id = req.body.id;

    return CommentController.delete(id)
        .then(dComment => {
            return res.status(200).json(dComment);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send('DB error');
        })
})

module.exports = router;
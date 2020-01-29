const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

let jsonParser = bodyParser.json();
let app = express();

let {ProyectController} = require('./models/proyect')
let {DATABASE_URL, PORT} = require('./config');

app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/test-api/proyects', jsonParser, (req, res) => {
    ProyectController.getAll()
        .then(proyects => {
            return res.status(200).json(proyects);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        })
});

app.post

let server;

function runServer(port, databaseUrl){
    return new Promise( (resolve, reject ) => {
        mongoose.connect(databaseUrl, response => {
            if ( response ){
                return reject(response);
            }
            else{
                server = app.listen(port, () => {
                    console.log( "App is running on port " + port );
                    resolve();
                })
                .on( 'error', err => {
                    mongoose.disconnect();
                    return reject(err);
                })
            }
        });
    });
   }
   
   function closeServer(){
        return mongoose.disconnect()
            .then(() => {
                return new Promise((resolve, reject) => {
                    console.log('Closing the server');
                    server.close( err => {
                        if (err){
                            return reject(err);
                        }
                        else{
                            resolve();
                        }
                    });
                });
            });
   }

   runServer(PORT, DATABASE_URL);

   module.exports = { app, runServer, closeServer }
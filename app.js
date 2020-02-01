const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

let app = express();

// Routes
let userRoutes = require('./routes/users');
let authRoutes = require('./routes/auth');
let proyectRoutes = require('./routes/proyects');

let {DATABASE_URL, PORT} = require('./config');

app.use(express.static('public'));
app.use(morgan('dev'));

app.use('/api/users', userRoutes);
app.use('/api', authRoutes);
app.use('/api/proyects', proyectRoutes);

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
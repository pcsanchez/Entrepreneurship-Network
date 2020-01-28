const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let proyectCollection = mongoose.Schema( {
    name: {type: String},
    image: {type: String},
    description: {type: String}
});

const Proyect = mongoose.model('proyects', proyectCollection);
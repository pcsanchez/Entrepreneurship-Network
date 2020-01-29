const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let proyectCollection = mongoose.Schema( {
    name: {type: String},
    image: {type: String},
    description: {type: String}
});

const Proyect = mongoose.model('proyect', proyectCollection);

let ProyectController = {
    getAll: function() {
        return Proyect.find()
            .then(proyects => {
                return proyects;
            })
            .catch(error => {
                throw Error(error);
            });
    }
}

module.exports = {ProyectController};
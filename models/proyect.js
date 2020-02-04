const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let proyectCollection = mongoose.Schema( {
    name: {type: String},
    image: {type: String},
    description: {type: String},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    categories: [{type: String}],
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
    zeroStars: 0,
    
});

const Proyect = mongoose.model('proyects', proyectCollection);

const ProyectController = {
    getAll: function() {
        return Proyect.find().populate('owner', '-password')
            .then(proyects => {
                return proyects;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getById: function(id) {
        return Proyect.findById(id).populate('owner', '-password')
            .then(proyect => {
                return proyect;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getByCategory: function(category) {
        return Proyect.find({categories: category}).populate('owner', '-password')
            .then(proyects => {
                return proyects;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getByOwnerId: function(id) {
        return Proyect.find({owner: id}).populate('owner', '-password')
            .then(proyects => {
                return proyects;
            })
            .catch(error => {
                throw Error(error);
            })
    },
    getByTeamMembership: function(id) {
        return Proyect.find({teamMembers: id}).populate('owner', '-password')
            .then(proyects => {
                return proyects;
            })
            .catch(error => {
                throw Error(error);
            })
    },
    getAllExcludeMembership: function(id) {
        return Proyect.find({owner: {$ne: id}, teamMembers: {$ne: id}}).populate('owner', '-password')
            .then(proyects => {
                return proyects;
            })
            .catch(error => {
                throw Error(error);
            })
    },
    create: function(newProyect) {
        return Proyect.create(newProyect)
            .then(nProyect => {
                return nProyect;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    update: function(id, updatedProyect) {
        return Proyect.findByIdAndUpdate(id, updatedProyect)
            .then(uProyect => {
                return uProyect;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    delete: function(id) {
        return Proyect.findByIdAndDelete(id)
            .then(dProyect => {
                return dProyect;
            })
            .catch(error => {
                throw Error(error);
            });
    }
}

module.exports = {ProyectController};
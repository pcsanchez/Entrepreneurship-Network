const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userCollection = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    bio: {type: String},
    pendingInvites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'proyects'
    }],
    pendingRequests: [{
        proyect: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'proyects'
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        name: {type: String},
        proyectName: {type: String}

    }],
    email: {type: String},
    password: String
});

const User = mongoose.model('users', userCollection);

const UserController = {
    getAll: function() {
        return User.find()
            .then(users => {
                return users;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getById: function(id) {
        return User.findById(id).populate({
            path: 'pendingInvites',
            populate: {path: 'owner'}
        })
            .then(user => {
                return user;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getByEmail: function(email) {
        return User.findOne({email: email})
            .then(user => {
                return user;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    create: function(newUser) {
        return User.create(newUser)
            .then(nUser => {
                return nUser;
            })
            .catch(error => {
                throw Error(error);
            });

    },
    update: function(id, updatedUser) {
        return User.findByIdAndUpdate(id, updatedUser)
            .then(uUser => {
                return uUser;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    delete: function(id) {
        return User.findByIdAndRemove(id)
            .then(dUser => {
                return dUser;
            })
            .catch(error => {
                throw Error(error);
            });
    }
};

module.exports = {UserController};
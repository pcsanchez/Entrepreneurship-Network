const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const commentCollection = mongoose.Schema({
    text: {type: String},
    author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
    }
});

const Comment = mongoose.model('comments', commentCollection);

const CommentController = {
    getAll: function() {
        return Comment.find().populate('author')
            .then(comments => {
                return comments;
            })
            .catch(error => {
                throw Error(error);
            })
    },
    create: function(newComment) {
        return Comment.create(newComment)
            .then(nComment => {
                return nComment;
            })
            .catch(error => {
                throw Error(error);
            })
    },
    delete: function(id) {
        return Comment.findByIdAndDelete(id)
            .then(dComment => {
                return dComment;
            })
            .catch(error => {
                throw Error(error);
            })
    }
}

module.exports = {CommentController};
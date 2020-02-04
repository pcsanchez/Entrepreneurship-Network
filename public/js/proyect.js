let proyect;

function fetchProyect() {
    const id = localStorage.getItem('proyectID');
    $('#mainContent').empty();

    $.ajax({
        url: '/api/proyects/' + id,
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            console.log(responseJSON);
            proyect = responseJSON;
            if(responseJSON.owner._id === localStorage.getItem('userID')) {
                displayOwnedProyect(responseJSON);
            } else {
                displayGenericProyect(responseJSON);
            }
        },
        error: function(error) {
            console.log(error);
        }
    })
}

function displayOwnedProyect(response) {
    let collaborators = '';
    response.teamMembers.forEach(el => {
        collaborators += `<p>${el.firstName} ${el.lastName}</p>`
    })
    $('#mainContent').append(`
        <div class="card">
            <img src="${response.image}" class="card-img-top" alt="ProyectImg">
            <div class="card-body">
                <h1 class="card-title">${response.name}</h1>
                <button id="editBtn" class="btn btn-success">Edit Info</button>
                <h5>Created By</h5>
                <h4><strong>${response.owner.firstName} ${response.owner.lastName}</strong></h4>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><h4 class="card-text pdesc">${response.description}</h4></li>
                <li class="list-group-item">
                    <h4>Collaborators:</h4>
                    ${collaborators}
                    <form id="invite">
                        <div class="form-group">
                            <input placeholder="email" class="form-control" type="text" id="userEmail" required>
                            <button id="invBtn" type="submit" class="btn btn-warning">Invite Collaborator</button>
                        </div>
                    </form>
                </li>
            </ul>
        </div>
    `)
}

function displayGenericProyect(response) {
    let collaborators = '';
    response.teamMembers.forEach(el => {
        collaborators += `<p>${el.firstName} ${el.lastName}</p>`
    })
    let comments = '';
    response.comments.forEach(el => {
        comments += `<div class="comment"><h5>${el.text}</h5><p>By ${el.author.firstName} ${el.author.lastName}</p></div>`
    })
    $('#mainContent').append(`
    <div class="card">
    <img src="${response.image}" class="card-img-top" alt="ProyectImg">
    <div class="card-body">
        <h1 class="card-title">${response.name}</h1>
        <h5>Created By</h5>
        <h4><strong>${response.owner.firstName} ${response.owner.lastName}</strong></h4>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item"><h4 class="card-text pdesc">${response.description}</h4></li>
        <li class="list-group-item">
            <h4>Collaborators:</h4>
            ${collaborators}
        </li>
        <li class="list-group-item">
            <h4>Comments:</h4>
            ${comments}
            <form id="comments">
                <div class="form-group">
                    <input placeholder="Leave a comment" class="form-control" type="text" id="commentText" required>
                    <button id="commentBtn" type="submit" class="btn btn-primary">Comment!</button>
                </div>
            </form>
            <button id="join" type="text" class="btn btn-secondary">Ask to Join!</button>
        </li>
    </ul>
</div>
    `)
}

function watchButtons() {
    $('.logo').on('click', event => {
        console.log('clicked');
        event.preventDefault();
        window.location.href = 'feed.html';
    })

    $('#profileBtn').on('click', event => {
        event.preventDefault();
        window.location.href = 'profile.html';
    })

    $('#plusBtn').on('click', event => {
        event.preventDefault();
        window.location.href = 'new.html';
    })

    $('#mainContent').on('click', '#editBtn', event => {
        event.preventDefault();
        window.location.href = 'editProyect.html'
    })

    $('#mainContent').on('click', '#join', event => {
        event.preventDefault();

        let requests = proyect.owner.pendingRequests;
        requests.push({
            proyect: proyect._id,
            sender: localStorage.getItem('userID'),
            name: localStorage.getItem('userName'),
            proyectName: proyect.name
        });

        const newUser = {
            pendingRequests: requests
        }

        console.log(newUser);

        $.ajax({
            url: '/api/users/update/' + proyect.owner._id,
            method: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataTye: 'json',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify(newUser),
            succes: function(responseJSON) {
                console.log(responseJSON);
            },
            error: function(error) {
                console.log(error);
            }

        })
    })
}

function watchForm() {
    $('#mainContent').on('click', '#invBtn', event => {
        event.preventDefault();

        $.ajax({
            url: '/api/users/email/' + $('#userEmail').val(),
            method: 'GET',
            dataType: 'json',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            },
            success: function(responseJSON) {
                let invites = responseJSON.pendingInvites;
                invites.push(proyect._id);
                const updatedUser = {
                    pendingInvites: invites
                }
                $.ajax({
                    url: '/api/users/update/' + responseJSON._id,
                    method: 'PUT',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    data: JSON.stringify(updatedUser),
                    success: function(responseJSON2) {
                        console.log(responseJSON2);
                        fetchProyect();
                    },
                    error: function(error) {
                        console.log(error);
                    }
                })
            },
            error: function(error) {
                console.log(error);
            }
        })
    })

    $('#mainContent').on('click', '#commentBtn', event => {
        event.preventDefault();

        const newComment = {
            text: $('#commentText').val(),
            author: localStorage.getItem('userID')
        }

        console.log(newComment);

        $.ajax({
            url: '/api/comments/create',
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataTye: 'json',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify(newComment),
            success: function(responseJSON) {
                let comments = proyect.comments;
                comments.push(responseJSON);
                const updatedProyect = {
                    comments: comments
                }
                $.ajax({
                    url: '/api/proyects/update/' + proyect._id,
                    method: 'PUT',
                    contentType: 'application/json; charset=utf-8',
                    dataTye: 'json',
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    data: JSON.stringify(updatedProyect),
                    success: function(responseJSON2) {
                        console.log(responseJSON2);
                        fetchProyect();
                    },
                    error: function(error) {
                        console.log(error);
                    }
                })
            },
            error: function(error) {
                console.log(error);
            }
        })
    })
}

function init() {
    fetchProyect();
    watchButtons();
    watchForm();
}

init();
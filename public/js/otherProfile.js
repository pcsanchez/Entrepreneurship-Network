let user;

function fetchUser() {
    $.ajax({
        url: '/api/users/' + localStorage.getItem('searchedID'),
        method: 'GET',
        dataType: 'json',
        success: function(responseJSON) {
            user = responseJSON;
            displayData(responseJSON);
        },
        error: function(error) {
            console.log(error);
        }
    })
 }

function displayData(response) {
    $('#userName').empty();
    $('#userName').append(`${response.firstName} ${response.lastName}`);
    $('#userBio').empty();
    if(response.bio === '') {
        $('#userBio').append('No bio to display');
    } else {
        $('#userBio').append(`${response.bio}`);
    }

    $('#pills-home').empty();
    $.ajax({
        url: '/api/proyects/owner/' + localStorage.getItem('searchedID'),
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            responseJSON.forEach(pr => {
                $('#pills-home').append(`
                    <div class="proyect click" value="${pr._id}">
                        <h1 class="click" value="${pr._id}">${pr.name}</h1>
                        <p class="click" value="${pr._id}">${pr.description}</p>
                    </div>
                `);
            })
        },
        error: function(error) {
            console.log(error);
        }
    })

    $('#pills-profile').empty();
    $.ajax({
        url: '/api/proyects/team/' + localStorage.getItem('userID'),
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            responseJSON.forEach(pr => {
                $('#pills-profile').append(`
                    <div class="proyect click" value="${pr._id}">
                        <h1 class="click" value="${pr._id}">${pr.name}</h1>
                        <p class="click" value="${pr._id}">${pr.description}</p>
                    </div>
                `);
            })
        },
        error: function(error) {
            console.log(error);
        }
    })

}

function watchButtons() {

    $('#plusBtn').on('click', event => {
        event.preventDefault();
        window.location.href = 'new.html';
    })

    $('.logo').on('click', event => {
        event.preventDefault();
        window.location.href = 'feed.html';
    })

    $('#profileBtn').on('click', event => {
        event.preventDefault();
        window.location.href = 'profile.html';
    })
}

function removeInvite(proyect) {
    let pending = user.pendingInvites;
    pending = pending.filter(el => el._id != proyect);
    const updatedUser = {
        pendingInvites: pending
    }
    $.ajax({
        url: '/api/users/update/' + user._id,
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        data: JSON.stringify(updatedUser),
        success: function(responseJSON) {
            fetchUser();
        },
        error: function(error) {
            console.log(error);
        }
    })
}

function watchProyects() {
    $('#pills-home').on('click', '.click', event => {
        event.preventDefault();

        const id = $(event.target).attr('value');
        localStorage.setItem('proyectID', id);
        window.location.href = 'proyect.html';
    })

    $('#pills-profile').on('click', '.click', event => {
        event.preventDefault();

        const id = $(event.target).attr('value');
        localStorage.setItem('proyectID', id);
        window.location.href = 'proyect.html';
    })
}

function init() {
    fetchUser();
    watchButtons();
    watchProyects();
}

init();
let user;

function fetchUser() {
    $.ajax({
        url: '/api/users/' + localStorage.getItem('userID'),
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
        url: '/api/proyects/owner/' + localStorage.getItem('userID'),
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            responseJSON.forEach(pr => {
                $('#pills-home').append(`
                    <div class="proyect">
                        <h1 value="${pr._id}">${pr.name}</h1>
                        <p>${pr.description}</p>
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
                    <h1>${pr.name}</h1>
                `);
            })
        },
        error: function(error) {
            console.log(error);
        }
    })

    $('#pills-contact').empty();

    let inviteElements = '';
    response.pendingInvites.forEach(el => {
        inviteElements +=`
        <div class="invites">
            <p>${el.owner.firstName} invited you to collaborate in ${el.name}</p>
            <button class="btn btn-success yesBtn" value="${el._id}">Accept</button>
            <button class="btn btn-danger noBtn" value="${el._id}">Decline</button>
        </div>
        `
    })
    $('#pills-contact').append(`
        ${inviteElements}
    `)
}

function watchButtons() {
    $('#edit').on('click', event => {
        window.location.href = 'editProfile.html';
    })

    $('#pills-contact').on('click', '.yesBtn', event => {
        event.preventDefault();

        const proyectId = $(event.target).attr('value');

        $.ajax({
            url: '/api/proyects/' + proyectId,
            method: 'GET',
            dataType: 'json',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            },
            success: function(responseJSON) {
                let newTeams = responseJSON.teamMembers;
                newTeams.push(user._id);
                const updatedProyect = {
                    teamMembers: newTeams
                }

                $.ajax({
                    url: '/api/proyects/update/' + responseJSON._id,
                    method: 'PUT',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    data: JSON.stringify(updatedProyect),
                    success: function(responseJSON2) {
                        removeInvite(proyectId);
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

    $('#pills-contact').on('click', '.noBtn', event => {
        event.preventDefault();

        const proyectId = $(event.target).attr('value');
        removeInvite(proyectId);
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

function init() {
    fetchUser();
    watchButtons();
}

init();
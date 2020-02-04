function watchForm() {
    $('#newForm').on('submit', event => {
        event.preventDefault();

        const newProyect = {
            name: $('#name').val(),
            description: $('#desc').val(),
            categories: $('#category').val(),
        }

        $.ajax({
            url: '/api/proyects/create',
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify(newProyect),
            success: function(responseJSON) {
                sendInvites(responseJSON);
            },
            error: function(err) {
                console.log(err);
            }
        })
    })
}

function sendInvites(response) {

    const invites = $('#members').val().split('\n');

    invites.forEach((email, index) => {
        $.ajax({
            url: '/api/users/email/' + email,
            method: 'GET',
            dataType: 'json',
            success: function(responseJSON) {
                let newInvites = responseJSON.pendingInvites;
                newInvites.push(response._id);
                const updatedUser = {
                    pendingInvites: newInvites
                }
                $.ajax({
                    url: '/api/users/update/' + responseJSON._id,
                    method: 'PUT',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify(updatedUser),
                    success: function(responseJSON2) {
                        console.log(responseJSON2);
                        if(index === invites.length - 1 ) {
                            window.location.href = 'feed.html';
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },
            error: function(err) {
                console.log(err);
            }
        })
    })


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
}

function init() {
    watchForm();
    watchButtons();
}

init();
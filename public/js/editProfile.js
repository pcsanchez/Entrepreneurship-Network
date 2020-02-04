function displayData() {
    $.ajax({
        url: '/api/users/' + localStorage.getItem('userID'),
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            $('#fname').val(`${responseJSON.firstName}`);
            $('#lname').val(`${responseJSON.lastName}`);
            $('#bio').val(`${responseJSON.bio}`);
        },
        error: function(error) {
            console.log(error);
        }
    })
}

function watchForm() {
    $('#editForm').on('submit', event => {
        event.preventDefault();

        let updatedUser = {
            firstName: $('#fname').val(),
            lastName: $('#lname').val(),
            bio: $('#bio').val()
        }

        $.ajax({
            url: '/api/users/update/' + localStorage.getItem('userID'),
            method: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify(updatedUser),
            success: function(responseJSON) {
                console.log(responseJSON);
                window.location.href = 'profile.html';
            },
            error: function(error) {
                console.log(error);
            }
        })
    })
}

function watchButton() {
    $('#cancel').on('click', event => {
        window.location.href = 'profile.html';
    })
}

function init() {
    displayData();
    watchForm();
    watchButton();
}

init();
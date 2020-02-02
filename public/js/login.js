function watchForm() {
    const form = $('#loginForm');

    form.on('submit', (event) => {
        event.preventDefault();

        const email = $('#emailField').val();
        const password = $('#passwordField').val();

        const user = {
            'email': email,
            'password': password
        }

        const url = '/api/login';

        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json; charser=utf-8',
            dataType: 'json',
            data: JSON.stringify(user),
            success: function(responseJSON) {
                login(responseJSON);
            },
            error: function(err) {
                console.log(err);
            }
        })
    })
}

function login(response) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userID', response.id);
    window.location.href = 'feed.html';
}

function init() {
    watchForm();
}

init();
function watchForm() {
    $('#registerForm').on('submit', (event) => {
        event.preventDefault();

        let newUser = {
            'firstName': $('#fnameField').val(),
            'lastName': $('#lnameField').val(),
            'email': $('#emailField').val(),
            'password': $('#passwordField').val()
        };

        $.ajax({
            url: '/api/users/create',
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(newUser),
            success: function(responseJSON) {
                console.log('success');
                window.location.href = 'index.html';
            },
            error: function(err) {
                console.log(err);
            }
        })

    })
}

function init() {
    watchForm();
}

init();
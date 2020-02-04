function displayData() {
    $.ajax({
        url: '/api/proyects/' + localStorage.getItem('proyectID'),
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            $('#name').val(`${responseJSON.name}`);
            $('#desc').val(`${responseJSON.description}`);
        },
        error: function(error) {
            console.log(error);
        }
    })
}

function watchButtons() {
    $('#cancel').on('click', event => {
        event.preventDefault();

        window.location.href = 'proyect.html';
    })

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

function watchForm() {

    $('#editForm').on('submit', event => {
        event.preventDefault();

        const updatedProyect = {
            name: $('#name').val(),
            description: $('#desc').val()
        }

        $.ajax({
            url: '/api/proyects/update/' + localStorage.getItem('proyectID'),
            method: 'PUT',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify(updatedProyect),
            success: function(responseJSON) {
                console.log(responseJSON);
                window.location.href = 'proyect.html'
            },
            error: function(error) {
                console.log(error);
            }
        })
    })
}

function init() {
    watchForm();
    displayData();
    watchButtons();
}

init();
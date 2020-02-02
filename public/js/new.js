function watchForm() {
    $('#newForm').on('submit', event => {
        event.preventDefault();

        const newProyect = {
            name: $('#name').val(),
            description: $('#desc').val(),
            categories: [$('#cat').val()]
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
                console.log(responseJSON)
                window.location.href = 'feed.html';
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
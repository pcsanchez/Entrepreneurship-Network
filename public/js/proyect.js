function fetchProyect() {
    const id = localStorage.getItem('proyectID');

    $.ajax({
        url: '/api/proyects/' + id,
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function(responseJSON) {
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
    $('#proyectName').append(`${response.name}`)
}

function displayGenericProyect(response) {
    console.log(response);
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
}

function init() {
    fetchProyect();
    watchButtons();
}

init();
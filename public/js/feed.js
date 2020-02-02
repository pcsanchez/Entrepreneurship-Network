function fetchContent() {
    $.ajax({
        url: '/api/proyects/owner/' + localStorage.getItem('userID'),
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: "Bearer " + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            displayUserOwnedProyects(responseJSON);
        },
        error: function(err) {
            console.log(err);
        }
    })

    $.ajax({
        url: '/api/proyects/team/' + localStorage.getItem('userID'),
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            displayMemberProyects(responseJSON);
        },
        error: function(err) {
            console.log(err);
        }
    })

    $.ajax({
        url: '/api/proyects/exclude/' + localStorage.getItem('userID'),
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            displayPopularProyects(responseJSON)
        },
        error: function(err) {
            console.log(err);
        }
    })
}

function displayUserOwnedProyects(response) {
    const container = $('#ownProyects');
    $(container).empty();

    response.forEach((el) => {
        $(container).append(`
            <h2>${el.name}</h2>
        `)
    })
}

function displayMemberProyects(response) {
    const container = $('#memberProyects');
    $(container).empty();

    response.forEach(el => {
        $(container).append(`
            <h2>${el.name}</h2>
        `)
    })
}

function displayPopularProyects(response) {
    const container = $('#popularProyects');
    $(container).empty();

    response.forEach(el => {
        $(container).append(`
            <h2>${el.name}</h2>
        `)
    })
}

function watchButtons() {
    $('#newBtn').on('click', event => {
        event.preventDefault();
        window.location.href = 'new.html';
    }) 
}

function init() {
    fetchContent();
    watchButtons();
}

init();
function fetchContent() {
    $.ajax({
        url: '/api/proyects/owner/' + localStorage.getItem('userID'),
        method: 'GET',
        dataType: 'json',
        headers: {
            authorization: "Bearer " + localStorage.getItem('token')
        },
        success: function(responseJSON) {
            displaySideBarProyects($('#ownProyects'), responseJSON);
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
            displaySideBarProyects($('#memberProyects'), responseJSON);
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
            displayProyects($('#popularProyects'), responseJSON)
        },
        error: function(err) {
            console.log(err);
        }
    })
}

function displayProyects(container, response) {
    $(container).empty();
    let cats = "";

    response.forEach((el) => {
        cats = "";
        el.categories.forEach(c => {
            cats += `<span class="pcat">${c}</span> `
        })
        $(container).append(`
            <div class="card proy">
                <img src="${el.image}" class="hoverable card-img-top" alt="ProyectImg" value="${el._id}">
                <div class="card-body">
                    <h3 class="hoverable card-title" value="${el._id}">${el.name}</h3>
                    <p class="hoverable card-text pdesc" value="${el._id}">${el.description}</p>
                    <p class="card-text">By ${el.owner.firstName} ${el.owner.lastName}</p>
                    <p class="card-text">${cats}</p>
                </div>
            </div>
        `)
    })
}

function displaySideBarProyects(container, response, term) {
    $(container).empty();

    response.forEach(el => {
        $(container).append(`
            <h5>${el.name}</h5>
        `)
    })
}

function displaySearchedProyects(container, response, term) {

    if(term === "") {
        $.ajax({
            url: '/api/proyects/exclude/' + localStorage.getItem('userID'),
            method: 'GET',
            dataType: 'json',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            },
            success: function(responseJSON) {
                displayProyects($('#popularProyects'), responseJSON)
            },
            error: function(err) {
                console.log(err);
            }
        })
    }
    let results = response.filter(proyect => proyect.name.toLowerCase().includes(term));

    let matchContent = response.filter(proyect => proyect.description.toLowerCase().includes(term));

    Array.prototype.push.apply(results, matchContent);

    $(container).empty();

    if(results.length < 1) {
        $(container).append(`
        <h4 class="info">Oops! Nothing matched your search, please try another search term!</h4>
        `)
    } else {
        results.forEach((el) => {
            $(container).append(`
                <div class="card proy">
                    <img src="${el.image}" class="hoverable card-img-top" alt="ProyectImg" value="${el._id}">
                    <div class="card-body">
                        <h3 class="hoverable card-title" value="${el._id}">${el.name}</h5>
                        <p class="hoverable card-text pdesc" value="${el._id}">${el.description}</p>
                        <p class="card-text">By ${el.owner.firstName} ${el.owner.lastName}</p>
                        <p class="pcat card-text">${el.categories[0]}</p>
                    </div>
                </div>
            `)
        })
    }

}

function watchButtons() {
    $('#newBtn').on('click', event => {
        event.preventDefault();
        window.location.href = 'new.html';
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

function watchProyects() {
    $('.proyectContainer').on('click', '.card .hoverable',  event => {
        event.preventDefault();
        
        const id = $(event.target).attr('value');
        localStorage.setItem('proyectID', id);
        window.location.href = 'proyect.html';
    })
}

function watchForm() {
    $('#searchForm').on('submit', event => {
        event.preventDefault();

        const searchTerm = $('#searchTerm').val();

        $.ajax({
            url: '/api/proyects/exclude/' + localStorage.getItem('userID'),
            method: 'GET',
            dataType: 'json',
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            },
            success: function(responseJSON) {
                displaySearchedProyects($('#popularProyects'), responseJSON, searchTerm)
            },
            error: function(err) {
                console.log(err);
            }
        })
    })
}

function init() {
    fetchContent();
    watchButtons();
    watchProyects();
    watchForm();
}

init();
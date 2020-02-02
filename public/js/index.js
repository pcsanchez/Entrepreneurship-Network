function watchButtons() {
    $('#loginBtn').on('click', (event) => {
        window.location.href = 'login.html';
    })

    $('#registerBtn').on('click', (event) => {
        window.location.href = 'register.html';
    })
}

function init(){
    watchButtons();
}

init();
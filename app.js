let express = require('express');

let app = express();

app.listen(8080, ()=> {
    console.log('Server started in port 8080');
})
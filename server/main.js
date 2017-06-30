const express    = require('express');
const app        = express();
const server     = require("http").createServer(app);
const io         = require("socket.io")(server);
const port = process.env.PORT || 3008;

require('./config/environment')(app, express);
require('./config/routes.js')(app);
require('./io/main.js')(io)

server.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }

    console.log(`Estimation backend listening at http://localhost:${port}/`);
});
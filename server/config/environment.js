const bodyParser = require('body-parser');
const path       = require('path');

module.exports = (app, express) => {
    app.use(bodyParser.json());
    app.use(express.static(__dirname));
    app.use("*/dist", express.static(__dirname + '/../../dist'));
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, '/../../index.html'));
    });
}

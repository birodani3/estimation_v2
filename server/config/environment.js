const bodyParser = require('body-parser');
const path       = require('path');

module.exports = (app, express) => {
    app.use(bodyParser.json());
    app.use('/service-worker.js', express.static(__dirname + '/../../service-worker.js'));
    app.use('/index.html', express.static(__dirname + '/../../index.html'));
    app.use('/manifest.json', express.static(__dirname + '/../../manifest.json'));
    app.use('/dist', express.static(__dirname + '/../../dist'));
    app.use('/fonts', express.static(__dirname + '/../../fonts'));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, '/../../index.html'));
    });
}

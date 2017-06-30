const JiraClient = require('jira-connector');
const Q          = require('q');

module.exports = (app) => {
    let Jira;

    const sendResponse = (res, data) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    };

    app.post("/jira", (req, res) => {
        if (!req.body.username || !req.body.password || !req.body.sprintId) {
            res.send();
            return;
        }

        Jira = new JiraClient({
            host: 'jira.cas.de',
            basic_auth: {
                username: req.body.username,
                password: req.body.password
            }
        });

        Jira.sprint.getSprintIssues({ "sprintId": req.body.sprintId, "maxResults": 99 }, (err, issues) => {
            sendResponse(res, issues);
        });
    });

    app.post("/jira/setStoryPoints", (req, res) => {
        if (!req.body.tickets) {
            res.send();
            return;
        }

        if (Jira) {
            let promises = req.body.tickets.map((ticket) => {
                return Jira.issue.setIssueEstimation({ issueId: ticket.issueId, value: ticket.storyPoint, boardId: ticket.boardId });
            });

            Q.all(promises)
                .then(() => {
                    sendResponse(res, "SUCCESS");
                })
                .catch(() => {
                    sendResponse(res, "ERROR");
                });
        } else {
            console.log("JIRA not inited yet");
        }
    });
}

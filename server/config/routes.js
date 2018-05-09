const JiraClient = require('jira-connector');
const Q          = require('q');

module.exports = (app) => {
    let Jira;

    const sendResponse = (res, data) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    };

    app.post("/jira", (req, res) => {
        if (!req.body.username || !req.body.password || !req.body.projectId) {
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

        Jira.search.search({ jql: `project="${ req.body.projectId }"`, maxResults: 199 }, (err, issues) => {
            sendResponse(res, issues);
        });
    });

    app.post("/jira/setStoryPoints", (req, res) => {
        if (!req.body.tickets) {
            res.send();
            return;
        }

        if (Jira) {
            const promises = req.body.tickets
                .filter(ticket => ticket.boardId)
                .map((ticket) => {
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
            sendResponse(res, "ERROR");
        }
    });
}
